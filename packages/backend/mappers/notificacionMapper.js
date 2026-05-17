import { Notificacion } from "../domain/notificacion.js";
import { UsuarioMapper } from "./usuarioMapper.js";

export class NotificacionMapper {
    static toDomain(notificacionDoc, destinatarioDoc, remitenteDoc) {
        const notificacion = new Notificacion({
            destinatario: UsuarioMapper.toDomain(destinatarioDoc),
            remitente: UsuarioMapper.toDomain(remitenteDoc),
            mensaje: notificacionDoc.mensaje,
            fechaHoraCreacion: notificacionDoc.fechaHoraCreacion
        });

        notificacion.id = notificacionDoc._id?.toString() ?? notificacionDoc.id;
        notificacion.leida = notificacionDoc.leida;
        notificacion.fechaHoraLeida = notificacionDoc.fechaHoraLeida;

        return notificacion;
    }

    static toDTO(notificacion) {
        return {
            id: notificacion.id,
            destinatario: notificacion.destinatario.nombre,
            remitente: notificacion.remitente.nombre,
            mensaje: notificacion.mensaje,
            fechaHoraCreacion: notificacion.fechaHoraCreacion,
            fechaHoraLeida: notificacion.fechaHoraLeida,
            leida: notificacion.leida
        };
    }

    static toPersistence(notificacion) {
        return {
            destinatarioId: notificacion.destinatario.id,
            remitenteId: notificacion.remitente.id,
            mensaje: notificacion.mensaje,
            fechaHoraCreacion: notificacion.fechaHoraCreacion,
            fechaHoraLeida: notificacion.fechaHoraLeida,
            leida: notificacion.leida
        };
    }
}