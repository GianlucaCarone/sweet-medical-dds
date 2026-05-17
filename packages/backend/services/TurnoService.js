import { BadRequestError, ConflictError, NotFoundError, UnprocessableEntityError } from "../errors/AppError.js";
import { filtrosTurnoSchema } from "../schemas/zod/turnoSchema.js";
import { Turno } from "../domain/turnos/turno.js";
import { NivelCobertura } from "../domain/coberturas/nivelCoberturaEnum.js";
import { EstadoTurnoEnum } from "../domain/turnos/estadoTurnoEnum.js";
import { TurnoRepository } from "../repositories/TurnoRepository.js";
import { ObraSocialRepository } from "../repositories/ObraSocialRepository.js";
import { MedicoRepository } from "../repositories/MedicoRepository.js";
import { PacienteRepository } from "../repositories/PacienteRepository.js";


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

    toDTO(turno) {
        return {
            id: turno.id || turno._id, //validacion de if default de mongo
            fechaHora: turno.fechaHora,
            estado: turno.estado,
            medico: turno.medico?.id,
            paciente: turno.paciente?.id,
            practica: turno.practica?.id ?? turno.practica,
            especialidad: turno.especialidad?.id ?? turno.especialidad,
            sede: turno.sede?.id,
            costo: turno.costo,
            historialEstado: turno.historialEstado?.map(h => ({
                fechaHoraIngreso: h.fechaHoraIngreso,
                estado: h.estado,
                usuario: h.usuario?.id ?? h.usuario, // por si el usuario es un objeto o un string
                motivo: h.motivo
            })) ?? []
        }
    }

    async cambiarEstadoTurno(id, nuevoEstado, quien, motivo) {
        const turno = await this.turnoRepository.findById(id);
        if (!turno) {
            throw new BadRequestError("No se encontro el turno con el id " + id)
        }
        turno.actualizarEstadoTurno({ nuevoEstado, quien, motivo })
        return this.toDTO(await this.turnoRepository.update(id, turno));
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
            throw new NotFoundError("No se encontro el medico con el id " + medicoId)
        }

        const sede = await this.sedeRepository.findById(sedeId);
        if (!sede) {
            throw new NotFoundError("No se encontro la sede con el id " + sedeId)
        }

        const servicio = await this.servicioRepository.findById(servicioId);
        if (!servicio) {
            throw new NotFoundError("No se encontro el servicio con el id " + servicioId)
        }

        const turno = new Turno({ medico, sede, fechaHora, servicio });
        const turnoGuardado = await this.turnoRepository.save(turno);
        return this.toDTO(turnoGuardado);
    }

    async asignarTurno(idTurno, pacienteId, data) {
        const { costoTurno } = data

        const turno = await this.turnoRepository.findById(idTurno);
        if (!turno) {
            throw new NotFoundError("No se encontro el turno con el id " + idTurno)
        }
        const paciente = await this.pacienteRepository.findById(pacienteId);
        if (!paciente) {
            throw new NotFoundError("No se encontro el paciente con el id " + pacienteId)
        }

        turno.paciente = paciente;
        turno.costo = costoTurno;

        turno.actualizarEstadoTurno({ nuevoEstado: EstadoTurnoEnum.RESERVADO, paciente });

        return this.toDTO(await this.turnoRepository.update(idTurno, turno));
    }


    // TODO:● Ordenamiento por costo y fecha ascendente/descendente FALTA
    async obtenerTodosPaginados(numeroPagina = 1, limitePorPagina = Number(process.env.ITEMS_PER_PAGE) || 10, filtros = {}) {
        this.validarPaginacion(numeroPagina, limitePorPagina);
        const filtrosValidados = this.validarFiltros(filtros);

        const { turnos, totalTurnos } = await this.turnoRepository.obtenerPaginados(numeroPagina, limitePorPagina, filtrosValidados);

        const totalPaginas = totalTurnos === 0 ? 0 : Math.ceil(totalTurnos / limitePorPagina)

        /*
        TODO Por cada turno calcular el precio que tiene que pagar el paciente, si la obra social y el plan del paciente cubren la prestacion, el paciente no tiene que pagar nada,
         si la obra social cubre la prestacion pero el plan del paciente no, el paciente tiene que pagar un porcentaje de la prestacion,
         si la obra social no cubre la prestacion, el paciente tiene que pagar el 100% de la prestacion.
         TODO Si el paciente no tiene obra social ni plan, el paciente tiene que pagar el 100% de la prestacion.
         SOLUCION:
         1) MODO FACIL: QUERY PARAM Y QUE CARGUE LA OBRA SOCIAL Y EL PLAN CADA VEZ QUE SOLICITE UNA BUSQUEDA DE TURNOS
         2) REALISTA: http::.../turnos?pacienteId={id} --> De aca obtenemos datos del paciente, su obra social, plan y de ahi podemos obtener  cuanto cubre su plan con esa obra social,
         hay que chequear si tiene obra social, si existe esa practica o especialidad en el plan que tiene, luego si existe, cuanto es el porcentaje que le cubre y ahi calcular el cobro.
        */

        const { obraSocial, plan } = await this.obtenerObraSocialYPlanPorPaciente(filtrosValidados.pacienteId);

        const turnosConCobertura = turnos.map(t => {
            const cobertura = this.calcularCostoTurno(obraSocial, plan, t.servicio, t.medico.honorario);
            const turnoDto = this.toDTO(t);

            turnoDto.costo = cobertura.costoFinal;
            turnoDto.estadoCobertura = cobertura.estadoCobertura;

            return turnoDto;
        }); // TODO ANALIZAR SI QUEREMOS TODOS LOS TURNOS QUE EXISTEN SI HACER OTRA FUNCION

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
            throw new NotFoundError("No se encontro el turno con el id " + id)
        }
        return this.toDTO(turno);
    }

    async findByEstado(estado) {
        const turnos = await this.turnoRepository.findByEstado(estado);
        if (turnos.length === 0) {
            throw new NotFoundError(`No se encontró ningún turno con el estado ${estado}`);
        }
        return turnos.map(t => this.toDTO(t));
    }

    async update(idTurno, turno) {
        const turnoActualizado = await this.turnoRepository.update(idTurno, turno);
        if (!turnoActualizado) {
            throw new NotFoundError("No se encontro el turno con el id " + idTurno);
        }
        return this.toDTO(turnoActualizado);
    }


    //-------Funciones aux----------

    calcularCostoTurno(obraSocial, plan, servicio, honorarioMedico) {
        const precioInicial = servicio.precio + honorarioMedico;

        if (!obraSocial || !plan) {
            return precioInicial; // Si no hay obra social ni plan, el paciente paga el 100%
        }

        const { nivel, porcentaje } = plan.obtenerCoberturaServicio(servicio);

        switch (nivel) {
            case NivelCobertura.TOTAL:
                return { costoFinal: 0, estadoCobertura: "TOTAL" };
            case NivelCobertura.PARCIAL:
                return { costoFinal: precioInicial * porcentaje, estadoCobertura: "PARCIAL" };
            case NivelCobertura.NO_CUBIERTA:
                return { costoFinal: precioInicial, estadoCobertura: "NO_CUBIERTA" };
            default:
                return { costoFinal: precioInicial, estadoCobertura: "NO_CUBIERTA" };
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
            const mensajesError = validacion.error.issues.map(issue => issue.message).join(', ');
            throw new BadRequestError(`Filtros inválidos: ${mensajesError}`);
        }
        return validacion.data;
    }


    validarPaginacion(numeroPagina, limitePorPagina) {
        this.validarEnteroPositivo(numeroPagina, "Numero de página")
        this.validarEnteroPositivo(limitePorPagina, "Límite por página")
    }

    validarEnteroPositivo(numero, parametro) {
        if (!Number.isInteger(numero) || numero <= 0) {
            throw new BadRequestError(`${parametro} debe ser un entero positivo`)
        }
    }
}