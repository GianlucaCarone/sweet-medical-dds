import { TurnoService } from '../services/TurnoService.js';

export class TurnoController {
    constructor({ turnoService = new TurnoService() } = {}) {
        this.turnoService = turnoService;
    }


    findAll = async (req, res) => {
        try {
            const paginacion = this.extraerPaginacion(req.query)
            const filtros = this.extraerFiltros(req.query)

            const turnos = await this.turnoService.obtenerPaginados({ ...paginacion, filtros });
            res.status(200).json({
                status: 'success',
                data: turnos
            });
        } catch (error) {
            next(error);
        }
    }

    create = async (req, res, next) => {
        try {
            const turno = await this.turnoService.create(req.body);
            res.status(201).json({
                status: 'success',
                data: turno
            });
        } catch (error) {
            next(error);
        }
    }

}