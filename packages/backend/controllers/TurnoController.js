import { TurnoService } from '../services/TurnoService.js';
import { BadRequestError } from "../errors/AppError.js";
import { idParamsSchema, bodyCambioEstadoTurnoSchema, bodyAsignarTurnoSchema } from "../schemas/zod/turnoSchema.js";


export class TurnoController {
    constructor({ turnoService = new TurnoService() } = {}) {
        this.turnoService = turnoService;
    }

    cambiarEstadoTurno = async (req, res, next) => {
        try {
            const idTurno = idParamsSchema.parse(req.params);
            const cambioTurnoData = bodyCambioEstadoTurnoSchema.parse(req.body);

            const turnoActualizado = await this.turnoService.cambiarEstadoTurno(
                idTurno,
                cambioTurnoData.nuevoEstado,
                cambioTurnoData.quien,
                cambioTurnoData.motivo
            );

            return res.status(200).json({ status: "success", data: turnoActualizado })
        } catch (error) {
            return next(error)
        }
    }

    asignarTurno = async (req, res, next) => {
        try {
            const idTurno = idParamsSchema.parse(req.params);
            const turnoData = bodyAsignarTurnoSchema.parse(req.body);

            const turnoAsignado = await this.turnoService.asignarTurno(idTurno, turnoData.pacienteId, turnoData.costoTurno);

            return res.status(200).json({ status: "success", data: turnoAsignado })
        } catch (error) {
            return next(error)
        }
    }


    findAllPaginated = async (req, res, next) => {
        try {
            const paginacion = this.turnoService.extraerPaginacion(req.query)
            const filtros = this.turnoService.extraerFiltros(req.query)

            const resultado = await this.turnoService.obtenerTodosPaginados(
                paginacion.numeroPagina,
                paginacion.limitePorPagina,
                filtros
            );
            res.status(200).json({
                status: 'success',
                data: resultado.turnos,
                paginacion: {
                    numeroPagina: resultado.numeroPagina,
                    limitePorPagina: resultado.limitePorPagina,
                    totalPaginas: resultado.totalPaginas,
                    totalTurnos: resultado.totalTurnos
                }
            });
        } catch (error) {
            return next(error);
        }
    }

    extraerFiltros(query) {
        const filtros = {}

        if (query.pacienteId !== undefined) {
            filtros.pacienteId = query.pacienteId;
        }

        if (query.estado !== undefined) {
            filtros.estado = query.estado;
        }
        if (query.medicoId !== undefined) {
            filtros.medicoId = query.medicoId;
        }
        if (query.especialidadId !== undefined) {
            filtros.especialidadId = query.especialidadId;
        }
        if (query.practicaId !== undefined) {
            filtros.practicaId = query.practicaId;
        }
        if (query.sedeId !== undefined) {
            filtros.sedeId = query.sedeId;
        }
        if (query.fechaHoraInicio !== undefined) {
            filtros.fechaHoraInicio = query.fechaHoraInicio;
        }
        if (query.fechaHoraFin !== undefined) {
            filtros.fechaHoraFin = query.fechaHoraFin;
        }

        return filtros
    }

    extraerPaginacion(query) {
        const numeroPagina = query?.page === undefined ? 1 : Number(query.page)
        const limitePorPagina = query?.limit === undefined ? 10 : Number(query.limit)

        this.turnoService.validarEnteroPositivo(numeroPagina, "page")
        this.turnoService.validarEnteroPositivo(limitePorPagina, "limit")

        return { numeroPagina, limitePorPagina }
    }

}