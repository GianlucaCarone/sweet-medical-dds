import { NotificacionesService } from "../services/notificacionesService.js"; 

export class NotificacionesController {
    constructor ({ notificacionesService = new NotificacionesService () } = {}) {
        this.notificacionesService = notificacionesService;
    }

    getLeidos = async (req, res, next) => {
        try {
            const id = this.parsearId(req.params.id);
            const notificaciones = await this.notificacionesService.getLeidosNoLeidos(id, true);
            res.status(200).json( {
                status: "success",
                data: notificaciones
            });
        } catch (error) {
            next(error);
        }
    };

    getNoLeidos = async (req, res, next) => {
        try {
            const id = this.parsearId(req.params.id);
            const notificaciones = await this.notificacionesService.getLeidosNoLeidos(id, false);
            res.status(200).json( {
                status: "success",
                data: notificaciones
            });
        } catch (error) {
            next(error);
        }
    };

    leer = async (req, res, next) => {
        try {
            const id = this.parsearId(req.params.id);
            const notificacion = await this.notificacionesService.leer(id);
            res.status(200).json( {
                status: "success",
                data: notificacion
            });
        } catch (error) {
            next(error);
        }
    };

    parsearId (idParam) {
        const id = Number(idParam);
        this.validarEnteroPositivo(id, "id");
        return id;
    }
}