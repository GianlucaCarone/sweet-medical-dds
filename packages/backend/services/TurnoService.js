import { BadRequestError, ConflictError, NotFoundError, UnprocessableEntityError } from "../errors/AppError.js";
import { filtrosTurnoSchema } from "../schemas/zod/turnoSchema.js";
import { Turno } from "../domain/turnos/turno.js";
import { NivelCobertura } from "../domain/coberturas/nivelCoberturaEnum.js";
import { EstadoTurnoEnum } from "../domain/turnos/estadoTurnoEnum.js";
import { TurnoRepository } from "../repositories/TurnoRepository.js";
import { ObraSocialRepository } from "../repositories/ObraSocialRepository.js";
import { MedicoRepository } from "../repositories/MedicoRepository.js";
import { PacienteRepository } from "../repositories/PacienteRepository.js";
import { TurnoMapper } from "../mappers/turnoMapper.js";


export class TurnoService {
    constructor({
        turnoRepository = new TurnoRepository(),
        pacienteRepository = new PacienteRepository(),
        obraSocialRepository = new ObraSocialRepository(),
        medicoRepository = new MedicoRepository()
    } = {}) {
        this.turnoRepository = turnoRepository;
        this.pacienteRepository = pacienteRepository;
        this.obraSocialRepository = obraSocialRepository;
        this.medicoRepository = medicoRepository;
    }

    async cambiarEstadoTurno(id, nuevoEstado, quien, motivo) {
        const turno = await this.turnoRepository.findById(id);
        if (!turno) {
            throw new BadRequestError("No se encontro el turno con el id " + id);
        }
        turno.actualizarEstadoTurno({ nuevoEstado, quien, motivo });
        //llamar a notificacion service
        return TurnoMapper.toDTO(await this.turnoRepository.update(id, turno));
    }


    async create(data) {
        const { fechaHora, medicoId, sedeId, servicioId } = data

        if (!medicoId || !sedeId || !fechaHora || !servicioId) {
            throw new UnprocessableEntityError("Datos incompletos para crear el turno")
        }

        const yaExiste = await this.turnoRepository.existeTurno(medicoId, fechaHora);
        if (yaExiste) {
            throw new ConflictError("El médico ya tiene un turno creado en esa fecha y horario");
        }

        const medico = await this.medicoRepository.findById(medicoId);
        if (!medico) {
            throw new NotFoundError("No se encontro el medico con el id " + medicoId);
        }

        const sede = await this.sedeRepository.findById(sedeId);
        if (!sede) {
            throw new NotFoundError("No se encontro la sede con el id " + sedeId);
        }

        const servicio = await this.servicioRepository.findById(servicioId);
        if (!servicio) {
            throw new NotFoundError("No se encontro el servicio con el id " + servicioId)
        }

        const turno = new Turno({ medico, sede, fechaHora, servicio });
        const turnoGuardado = await this.turnoRepository.save(turno);
        return TurnoMapper.toDTO(turnoGuardado);
    }

    async asignarTurno(idTurno, pacienteId, data) {
        const { costoTurno } = data

        const turno = await this.turnoRepository.findById(idTurno);
        if (!turno) {
            throw new NotFoundError("No se encontro el turno con el id " + idTurno);
        }
        const paciente = await this.pacienteRepository.findById(pacienteId);
        if (!paciente) {
            throw new NotFoundError("No se encontro el paciente con el id " + pacienteId);
        }

        turno.paciente = paciente;
        turno.costo = costoTurno;

        turno.actualizarEstadoTurno({ nuevoEstado: EstadoTurnoEnum.RESERVADO, paciente });
        //llamar al service de notificacion

        return TurnoMapper.toDTO(await this.turnoRepository.update(idTurno, turno));
    }

    async obtenerTodosPaginados(numeroPagina = 1, limitePorPagina = Number(process.env.ITEMS_PER_PAGE) || 10, filtros = {}) {
        this.validarPaginacion(numeroPagina, limitePorPagina);
        const filtrosValidados = this.validarFiltros(filtros);

        const { turnos, totalTurnos } = await this.turnoRepository.obtenerPaginados(numeroPagina, limitePorPagina, filtrosValidados);

        const totalPaginas = totalTurnos === 0 ? 0 : Math.ceil(totalTurnos / limitePorPagina);

        // Solo buscaremos el plan si tenemos un paciente para calcular la cobertura.
        // Si el front pide por medicoId o algo sin paciente, no se calcularán coberturas que no aplican
        if (filtrosValidados.pacienteId) {
            const { obraSocial: osObtenida, plan: planObtenido } = await this.obtenerObraSocialYPlanPorPaciente(filtrosValidados.pacienteId);
            obraSocial = osObtenida;
            plan = planObtenido;
        }

        //solo se calcula si el turno tiene un servicio y si se filtra por pacienteID para una busqueda de turnos.
        const turnosConCobertura = turnos.map(t => {
            const turnoDto = TurnoMapper.toDTO(t);
            if (t.servicio && filtrosValidados.pacienteId) {
                const cobertura = this.calcularCostoTurno(obraSocial, plan, t.costo);
                turnoDto.costo = cobertura.costoFinal;
                turnoDto.estadoCobertura = cobertura.estadoCobertura;
            }
            return turnoDto;
        });

        return {
            turnosConCobertura,
            numeroPagina,
            limitePorPagina,
            totalPaginas,
            totalTurnos
        };
    }

    async findById(id) {
        const turno = await this.turnoRepository.findById(id);
        if (!turno) {
            throw new NotFoundError("No se encontro el turno con el id " + id);
        }
        return TurnoMapper.toDTO(turno);
    }

    async findByEstado(estado) {
        const turnos = await this.turnoRepository.findByEstado(estado);
        if (turnos.length === 0) {
            throw new NotFoundError(`No se encontró ningún turno con el estado ${estado}`);
        }
        return turnos.map(t => TurnoMapper.toDTO(t));
    }

    async update(idTurno, turno) {
        const turnoActualizado = await this.turnoRepository.update(idTurno, turno);
        if (!turnoActualizado) {
            throw new NotFoundError("No se encontro el turno con el id " + idTurno);
        }
        return TurnoMapper.toDTO(turnoActualizado);
    }

    async solicitarCambioFecha(idTurno, nuevaFechaHora, usuarioId) {
        const turno = await this.turnoRepository.findById(idTurno);
        if (!turno) {
            throw new NotFoundError("No se encontro el turno con el id " + idTurno);
        }

        let quien;
        let receptor;
        let rol;
        if (turno.paciente && (turno.paciente.toString() === usuarioId || turno.paciente.id === usuarioId)) {
            quien = await this.pacienteRepository.findById(usuarioId);
            receptor = await this.medicoRepository.findById(turno.medico);
            rol = "paciente";
        } else if (turno.medico && (turno.medico.toString() === usuarioId || turno.medico.id === usuarioId)) {
            quien = await this.medicoRepository.findById(usuarioId);
            receptor = await this.pacienteRepository.findById(turno.paciente);
            rol = "médico";
        } else {
            throw new BadRequestError("El turno no pertenece a este usuario");
        }

        turno.fechaHoraPropuesta = nuevaFechaHora;
        turno.actualizarEstadoTurno({
            nuevoEstado: EstadoTurnoEnum.PENDIENTECAMBIO,
            quien,
            motivo: `El ${rol} propone cambio de fecha a ${nuevaFechaHora}`
        });

        // TODO: notificacionService.notificarCambio(receptor, quien);

        return TurnoMapper.toDTO(await this.turnoRepository.update(idTurno, turno));
    }

    async responderCambioFecha(idTurno, aceptado, usuarioId) {
        const turno = await this.turnoRepository.findById(idTurno);
        if (!turno) {
            throw new NotFoundError("No se encontro el turno con el id " + idTurno);
        }

        if (turno.estado !== EstadoTurnoEnum.PENDIENTECAMBIO) {
            throw new BadRequestError("El turno no está pendiente de cambio");
        }

        let quien;
        let receptor;
        let rol;
        if (turno.paciente && (turno.paciente.toString() === usuarioId || turno.paciente.id === usuarioId)) {
            quien = await this.pacienteRepository.findById(usuarioId);
            receptor = await this.medicoRepository.findById(turno.medico);
            rol = "paciente";
        } else if (turno.medico && (turno.medico.toString() === usuarioId || turno.medico.id === usuarioId)) {
            quien = await this.medicoRepository.findById(usuarioId);
            receptor = await this.pacienteRepository.findById(turno.paciente);
            rol = "médico";
        } else {
            throw new BadRequestError("El turno no pertenece a este usuario");
        }

        if (aceptado) {
            turno.fechaHora = turno.fechaHoraPropuesta;
            turno.fechaHoraPropuesta = undefined;
            turno.actualizarEstadoTurno({
                nuevoEstado: EstadoTurnoEnum.CONFIRMADO,
                quien,
                motivo: `El ${rol} aceptó la propuesta de cambio de fecha`
            });
            // TODO: notificacionService.notificarCambio(receptor, quien);
        } else {
            turno.fechaHoraPropuesta = undefined;
            turno.actualizarEstadoTurno({
                nuevoEstado: EstadoTurnoEnum.RESERVADO,
                quien,
                motivo: `El ${rol} rechazó el cambio de fecha. Se conserva la original.`
            });
            // TODO: notificacionService.notificarCambio(receptor, quien);
        }

        return TurnoMapper.toDTO(await this.turnoRepository.update(idTurno, turno));
    }


    //-------Funciones aux----------

    calcularCostoTurno(obraSocial, plan, precioBase) {
        const precioFinal = precioBase;

        if (!obraSocial || !plan) {
            return precioFinal; // Si no hay obra social ni plan, el paciente paga el 100%
        }

        const { nivel, porcentaje } = plan.obtenerCoberturaServicio(servicio);

        switch (nivel) {
            case NivelCobertura.TOTAL:
                return { costoFinal: 0, estadoCobertura: "TOTAL" };
            case NivelCobertura.PARCIAL:
                return { costoFinal: precioFinal * porcentaje, estadoCobertura: "PARCIAL" };
            case NivelCobertura.NO_CUBIERTA:
                return { costoFinal: precioFinal, estadoCobertura: "NO_CUBIERTA" };
            default:
                return { costoFinal: precioFinal, estadoCobertura: "NO_CUBIERTA" };
        }
    }

    async obtenerObraSocialYPlanPorPaciente(pacienteId) {
        const paciente = await this.pacienteRepository.findById(pacienteId);

        if (!paciente.obraSocialId) {
            return { obraSocial: null, plan: null };
        }

        const obraSocial = await this.obraSocialRepository.findById(paciente.obraSocialId);
        if (!obraSocial) {
            throw new NotFoundError("No se encontro la obra social con el id " + paciente.obraSocialId);
        }
        const plan = obraSocial.obtenerPlanPorId(paciente.planId);
        return {
            obraSocial,
            plan
        };
    }

    validarFiltros(filtrosRecibidos) {
        const validacion = filtrosTurnoSchema.safeParse(filtrosRecibidos); //Analiza y devuelve un objeto con success y data entonces lo que hacemos es usar ese obkjecto para manejar el estado de la respuesta de success
        if (!validacion.success) {
            const mensajesError = validacion.error.issues.map(issue => issue.message).join(", ");
            throw new BadRequestError(`Filtros inválidos: ${mensajesError}`);
        }
        return validacion.data;
    }


    validarPaginacion(numeroPagina, limitePorPagina) {
        this.validarEnteroPositivo(numeroPagina, "Numero de página");
        this.validarEnteroPositivo(limitePorPagina, "Límite por página");
    }

    validarEnteroPositivo(numero, parametro) {
        if (!Number.isInteger(numero) || numero <= 0) {
            throw new BadRequestError(`${parametro} debe ser un entero positivo`);
        }
    }
}