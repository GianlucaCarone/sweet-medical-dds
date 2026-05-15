import { NotificacionModel } from "../schemas/database/notificacionSchema.js";
import { logger } from '../config/logger.js';

export class NotificacionesRepository {
    //Este es el modelo que creamos en el esquema, es el modelo de mongoose que nos ayudara con todas las consultas a la base
    constructor () {this.model = NotificacionModel;}

    
    async getByDestinatarioIdAndLeido(idDestinatario, leido) {
        logger.info("[NOTIFICACIONES REPOSITORY]: Obteniendo notificaciones " + ((leido) ? "leidas":"no leidas") + " del destinatario " + idDestinatario);
        const notificaciones = await this.model.findAll({ 
            destinatario: idDestinatario, 
            leido: leido }).populate("remitente");
        logger.info("[NOTIFICACIONES REPOSITORY]: Notificaciones obtenidas: ", notificaciones.length(), notificaciones);
    }
    
    async getByDestinatarioIdAndLeidoPaginado(idDestinatario, leido, page, limit) {
        logger.info("[NOTIFICACIONES REPOSITORY]: Obteniendo notificaciones " + (leido ? "leidas" : "no leidas") + " del destinatario " + idDestinatario);
        const skip = (page - 1) * limit;

        const notificaciones = await this.model.find({destinatario: idDestinatario, leido: leido}).populate("remitente").skip(skip).limit(limit);

        const total = await this.model.countDocuments({
            destinatario: idDestinatario,
            leido: leido
        });

        logger.info(
            "[NOTIFICACIONES REPOSITORY]: Notificaciones obtenidas:",
            notificaciones.length,
            notificaciones
        );

        return {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            data: notificaciones
        };
    }

//    async getByDestinatarioAndLeido(destinatario, leido) {
//        return await this.model.find({ 
//            destinatario: destinatario._id, 
//            leido: leido }).populate('remitente')
//        
//    }

    async save (notificacion) {
        logger.info("[NOTIFICACIONES REPOSITORY]: Guardando notificacion: ", notificacion);
        const nuevaNotificacion = new this.model(notificacion);
        const notificacionGuardada = await nuevaNotificacion.save();
        logger.info("[NOTIFICACIONES REPOSITORY]: Notificacion guardada: ", notificacionGuardada);
        return notificacionGuardada;
    }

    async getById (idNotificacion) {
        logger.info("[NOTIFICACIONES REPOSITORY]: Obteniendo notificacion por id: ", idNotificacion);
        const notificacion = await this.model.findById(idNotificacion).populate("remitente");
        logger.info("[NOTIFICACIONES REPOSITORY]: Notificacion obtenida: ", notificacion);
        return notificacion;
    }

    //para el futuro
    /*async obtenerPaginadas(numeroPagina, limitePorPagina, filtros = {}) {
        const query = {};
        const inicio = (numeroPagina - 1) * limitePorPagina;

        if (filtros.destinatarioId !== undefined) { //filtro destinatario
            query.destinatario = filtros.destinatarioId;
        }
        if (filtros.remitenteId !== undefined) { //filtro remitente
            query.remitente = filtros.remitenteId;
        }
        if (filtros.leida !== undefined) { //filtro leido
            query.leida = filtros.leida;
        }

        // Ejecutar la consulta y el conteo en paralelo
        const [notificaciones, totalNotificaciones] = await Promise.all([
            this.model.find(query)
                .populate("destinatario remitente")
                .skip(inicio)
                .limit(limitePorPagina)
                .lean()
                .exec(),
            this.model.countDocuments(query).exec()
        ]);

        return {
            notificaciones,
            totalNotificaciones
        };
    }*/    
}