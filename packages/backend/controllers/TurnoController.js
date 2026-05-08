import { TurnoService } from '../services/TurnoService.js';
import { BadRequestError } from "../errors/AppError.js";



export class TurnoController {
    constructor({ turnoService = new TurnoService() } = {}) {
        this.turnoService = turnoService;
    }

    create = async (req, res, next) => {
        try {
            const datosTurno = this.extraerYValidarBodyTurno(req.body);
            const turno = await this.turnoService.create(datosTurno);
            res.status(201).json({
                status: 'success',
                data: turno
            });
        } catch (error) {
            next(error);
        }
    }

    delete = async (req, res, next) => {
        try {
            const id = this.parsearId(req.params.id)
            const turnoEliminado = this.turnoService.eliminar(id)

            return res.status(200).json({ status: "success", data: turnoEliminado })
        } catch (error) {
            return next(error)
        }
    }

    update = async (req, res, next) => {
        try {
            const id = this.parsearId(req.params.id)
            const datosTurno = this.extraerYValidarBodyTurno(req.body)
            const turnoActualizado = this.turnoService.actualizar(id, datosTurno)

            return res.status(200).json({ status: "success", data: productoActualizado })
        } catch (error) {
            return next(error)
        }
    }


    findAllPaginated = async (req, res, next) => {
        try {
            const paginacion = this.extraerPaginacion(req.query)
            const filtros = this.extraerFiltros(req.query)

            const resultado = this.turnoService.obtenerTodosPaginados({ ...paginacion, filtros });
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


    extraerYValidarBodyTurno(body) {
        if (!body || typeof body !== "object" || Array.isArray(body)) {
            throw new BadRequestError("El cuerpo de la request es inválido")
        }

        const camposPermitidos = ["medico", "servicio", "fechaHora", "sede"]
        const camposBody = Object.keys(body)
        const camposNoPermitidos = camposBody.filter((campo) => !camposPermitidos.includes(campo))
        if (camposNoPermitidos.length > 0) {
            throw new BadRequestError(`Campos no permitidos en la request: ${camposNoPermitidos.join(", ")}`)
        }

        const camposFaltantes = camposPermitidos.filter((campo) => body[campo] === undefined)
        if (camposFaltantes.length > 0) {
            throw new BadRequestError(`Faltan campos obligatorios en la request: ${camposFaltantes.join(", ")}`)
        }

        return {
            medico: body.medico,
            servicio: body.servicio,
            sede: body.sede,
            fechaHora: body.fechaHora
        }

    }



    extraerFiltros(query) {
        const filtros = {}

        if (query.estado != undefined) {
            filtros.estado = query.estado;
        }
        if (query.medicoId != undefined) {
            filtros.medicoId = query.medicoId;
        }
        if (query.especialidadId != undefined) {
            filtros.especialidadId = query.especialidadId;
        }
        if (query.practicaId != undefined) {
            filtros.practicaId = query.practicaId;
        }
        if (query.sedeId != undefined) {
            filtros.sedeId = query.sedeId;
        }
        if (query.fechaHoraInicio != undefined) {
            filtros.fechaHoraInicio = query.fechaHoraInicio;
        }
        if (query.fechaHoraFin != undefined) {
            filtros.fechaHoraFin = query.fechaHoraFin;
        }

        return filtros
    }

    extraerPaginacion(query) {
        const numeroPagina = query?.page === undefined ? 1 : Number(query.page)
        const limitePorPagina = query?.limit === undefined ? 10 : Number(query.limit)

        this.validarEnteroPositivo(numeroPagina, "page")
        this.validarEnteroPositivo(limitePorPagina, "limit")

        return { numeroPagina, limitePorPagina }
    }

}