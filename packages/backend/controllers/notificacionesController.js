import { NotificacionesService } from "../services/notificacionesService.js";
import { notificacionIdSchema, notificacionSchema, usuarioIdSchema } from "../schemas/dto/notificacionSchema.js";

export class NotificacionesController {
    constructor ({ 
        notificacionesService = new NotificacionesService () 
    } = {}) {
        this.notificacionesService = notificacionesService;
    }

    //este endpoint en la siguiente entrega vuela (es por logica del sistema que se crean)
    crearNotificacion = async (req, res, next) => {
        try {
            const notificacionData = notificacionSchema.parse(req.body);
            const notificacion = await this.notificacionesService.crearNotificacion(notificacionData);
            res.status(201).json( {
                status: "success",
                data: notificacion
            });
        } catch (error) {
            next(error);
        }
    };

    getLeidos = async (req, res, next) => {
        try {
            const idUsuario = usuarioIdSchema.parse(req.body.idUsuario);
            const notificaciones = await this.notificacionesService.getLeidosNoLeidos(idUsuario, true);
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
            const idUsuario = usuarioIdSchema.parse(req.body.idUsuario);
            const notificaciones = await this.notificacionesService.getLeidosNoLeidos(idUsuario, false);
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
            const idNotificacion = notificacionIdSchema.parse(req.body.idUsuario);
            const notificacion = await this.notificacionesService.leer(idNotificacion);
            res.status(200).json( {
                status: "success",
                data: notificacion
            });
        } catch (error) {
            next(error);
        }
    };

    async seed (usuarios) {
        const notificaciones = [
            {
                destinatario: usuarios[1].id,
                remitente: usuarios[0].id,
                mensaje: "Se ha generado un turno."
            },
            {
                destinatario: usuarios[1].id,
                remitente: usuarios[0].id,
                mensaje: "Se ha reservado un turno."
            },
            {
                destinatario: usuarios[1].id,
                remitente: usuarios[0].id,
                mensaje: "Se ha cancelado un turno."
            },
            {
                destinatario: usuarios[1].id,
                remitente: usuarios[0].id,
                mensaje: "Se ha realizado un turno."
            }
        ];

        return notificaciones.map(n => this.notificacionesService.crearNotificacion(n));
    }
}