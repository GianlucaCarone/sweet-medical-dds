import { BadRequestError, ConflictError, UnprocessableEntityError } from "../errors/AppError.js";
import { filtrosTurnoSchema } from "../schemas/turnoSchema.js";
import { Turno } from "../domain/turnos/turno.js";
import { NivelCobertura } from "../domain/coberturas/nivelCoberturaEnum.js";
import { EstadoTurnoEnum } from "../domain/turnos/estadoTurnoEnum.js";


export class TurnoService {
    constructor({ turnoRepository, pacienteRepository, obraSocialRepository, medicoRepository} = {}) {
        this.turnoRepository = turnoRepository;
        this.pacienteRepository = pacienteRepository;
        this.obraSocialRepository = obraSocialRepository;
        this.medicoRepository = medicoRepository;
    }

    /*
    //Aca como mas nos guste podemos transformar el objeto a un DTO
    toDTO(alojamiento) {
        return {
            id: alojamiento.id || alojamiento._id, //validacion de if default de mongo
            nombre: alojamiento.nombre,
            //precioPorNoche: alojamiento.precioPorNoche,
        };
    }*/

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
        return await this.turnoRepository.save(turno)
    }


    async create(data) {
        const { fechaHora, medicoId, sedeId } = data

        if (!medicoId || !sedeId || !fechaHora) {
            throw new UnprocessableEntityError("Datos incompletos para crear el turno")
        }

        const yaExiste = await this.turnoRepository.existeTurno(medicoId, fechaHora);
        if (yaExiste) {
            throw new ConflictError("El médico ya tiene un turno creado en esa fecha y horario");
        }

        const medico = await this.medicoRepository.findById(medicoId);
        if (!medico) {
            throw new BadRequestError("No se encontro el medico con el id " + medicoId)
        }

        const sede = await this.sedeRepository.findById(sedeId);
        if (!sede) {
            throw new BadRequestError("No se encontro la sede con el id " + sedeId)
        }

        const turno = new Turno({ medico, sede, fechaHora });
        const turnoGuardado = await this.turnoRepository.save(turno);
        return this.toDTO(turnoGuardado);
    }

    async asignarTurno(idTurno, pacienteId, data) {
        const { costoTurno, practicaId, especialidadId } = data

        const turno = await this.turnoRepository.findById(idTurno);
        if (!turno) {
            throw new BadRequestError("No se encontro el turno con el id " + idTurno)
        }
        const paciente = await this.pacienteRepository.findById(pacienteId);
        if (!paciente) {
            throw new BadRequestError("No se encontro el paciente con el id " + pacienteId)
        }

        if (practicaId) {
            turno.practica = practicaId;
        } else if (especialidadId) {
            turno.especialidad = especialidadId;
        }
        turno.paciente = paciente;
        turno.costoTurno = costoTurno;

        turno.actualizarEstadoTurno({ nuevoEstado: EstadoTurnoEnum.RESERVADO, paciente });

        return this.toDTO(await this.turnoRepository.update(turno));
    }

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

        const turnosConCosto = turnos.map(t => {
            const costo = this.calcularCostoTurno(obraSocial, plan, t.servicio);
            t.costoTurno = costo;
            return t;
        }); // TODO ANALIZAR SI QUEREMOS TODOS LOS TURNOS QUE EXISTEN SI HACER OTRA FUNCION



        return {
            turnosConCosto,
            numeroPagina,
            limitePorPagina,
            totalPaginas,
            totalTurnos
        };
    }

    async findById(id) {
        const turno = await this.turnoRepository.findById(id);
        if (!turno) {
            throw new BadRequestError("No se encontro el turno con el id " + id)
        }
        return this.toDTO(turno);
    }

    calcularCostoTurno(obraSocial, plan, servicio) {
        const precioInicial = servicio.precio;

        if (!obraSocial || !plan) {
            return precioInicial;
        }

        const { nivel, porcentaje } = plan.obtenerCoberturaServicio(servicio);

        switch (nivel) {
            case NivelCobertura.TOTAL:
                return 0;
            case NivelCobertura.PARCIAL:
                return precioInicial * porcentaje; // TODO: NO ESTA DEFINIDO EL PORCENTAJE DE DESCUENTO SI ES PARCIAL -> Implemente porcentajeCobertura en coberturaEspecialidad y coberturaPractica para no hardcodearlo y que cada obrasocial lo defina en su plan
            case NivelCobertura.NO_CUBIERTA:
                return precioInicial;
            default:
                return precioInicial;
        }
    }

    async obtenerObraSocialYPlanPorPaciente(pacienteId) {
        const paciente = await this.pacienteRepository.findById(pacienteId);

        if (!paciente.obraSocialId) {
            return { obraSocial: null, plan: null };
        }

        // TODO revisar si hacerlo embebida o referencia
        const obraSocial = await this.obraSocialRepository.findById(paciente.obraSocialId);
        if (!obraSocial) {
            throw new BadRequestError("No se encontro la obra social con el id " + paciente.obraSocialId);
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