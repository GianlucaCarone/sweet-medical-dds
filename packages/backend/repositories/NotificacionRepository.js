import { NotificacionModel } from "../schemas/database/notificacionSchema.js";
import { logger } from "../config/logger.js";
import { NotificacionMapper } from "../mappers/notificacionMapper.js";

export class NotificacionRepository {
    constructor() { this.model = NotificacionModel; }

    async getByDestinatarioIdAndLeido(idDestinatario, leida) {
        logger.info("[NOTIFICACIONES REPOSITORY]: Obteniendo notificaciones " + ((leida) ? "leidas" : "no leidas") + " del destinatario " + idDestinatario);
        const notificaciones = await this.model.find({ destinatarioId: idDestinatario, leida: leida }).populate(["destinatarioId", "remitenteId"]);
        logger.info("[NOTIFICACIONES REPOSITORY]: Notificaciones obtenidas: ", notificaciones);
        return notificaciones.map(n => NotificacionMapper.toDomain(n, n.destinatarioId, n.remitenteId));
    }

    async getByDestinatarioIdAndLeidoPaginado(idDestinatario, leido, page, limit) {
        logger.info("[NOTIFICACIONES REPOSITORY]: Obteniendo notificaciones " + (leido ? "leidas" : "no leidas") + " del destinatario " + idDestinatario);
        const skip = (page - 1) * limit;

        const notificaciones = await this.model.find({ destinatario: idDestinatario, leido: leido })
            .populate(["destinatarioId", "remitenteId"])
            .skip(skip)
            .limit(limit);

        const total = await this.model.countDocuments({
            destinatario: idDestinatario,
            leido: leido
        });

        notificaciones.map(n => NotificacionMapper.toDomain(n, n.destinatarioId, n.remitenteId));
        logger.info("[NOTIFICACIONES REPOSITORY]: Notificaciones obtenidas:", notificaciones);

        return {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            data: notificaciones
        };
    }

    /*async save(notificacion) {
        logger.info("[NOTIFICACIONES REPOSITORY]: Guardando notificacion: ", notificacion);
        const nuevaNotificacion = new this.model(NotificacionMapper.toPersistence(notificacion));
        const notificacionGuardada = await nuevaNotificacion.save();

        logger.info("[NOTIFICACIONES REPOSITORY]: Notificacion guardada: ", notificacionGuardada);
        await notificacionGuardada.populate(["destinatarioId", "remitenteId"]);

        return NotificacionMapper.toDomain(notificacionGuardada, notificacionGuardada.destinatarioId, notificacionGuardada.remitenteId);
    }*/

    async save(notificacion) {
        logger.info("[NOTIFICACIONES REPOSITORY]: Guardando notificacion:", notificacion);
        let notificacionGuardada;
        if (notificacion.id) {
            notificacionGuardada = await this.model.findByIdAndUpdate(notificacion.id, NotificacionMapper.toPersistence(notificacion), { new: true, runValidators: true });
        } else {
            const nuevaNotificacion = new this.model(NotificacionMapper.toPersistence(notificacion));
            notificacionGuardada = await nuevaNotificacion.save();
        }
        await notificacionGuardada.populate(["destinatarioId", "remitenteId"]);
        logger.info("[NOTIFICACIONES REPOSITORY]: Notificacion guardada:", notificacionGuardada);

        return NotificacionMapper.toDomain(notificacionGuardada, notificacionGuardada.destinatarioId, notificacionGuardada.remitenteId);
    }

    async getById(idNotificacion) {
        logger.info("[NOTIFICACIONES REPOSITORY]: Obteniendo notificacion por id: ", idNotificacion);
        const notificacion = await this.model.findById(idNotificacion).populate(["destinatarioId", "remitenteId"]);
        logger.info("[NOTIFICACIONES REPOSITORY]: Notificacion obtenida: ", notificacion);

        return NotificacionMapper.toDomain(notificacion, notificacion.destinatarioId, notificacion.remitenteId);
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