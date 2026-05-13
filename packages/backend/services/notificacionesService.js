import { NotificacionesRepository } from "../repositories/notificacionesRepository.js";
import { BadRequestError } from "../errors/AppError.js";
import { Notificacion } from "../domain/notificacion.js";
import { UsuarioService } from "./usuariosService.js";

export class NotificacionesService {
    constructor({ notificacionesRepository = new NotificacionesRepository(), usuariosService = new UsuarioService() } = {}) {
        this.notificacionesRepository = notificacionesRepository;
        this.usuariosService = usuariosService;
    }

    toDTO (notificacion) {
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

    async crearNotificacion (notificacionData) {
        const destinatario = this.usuariosService.findById(notificacionData.destinatario);
        notificacionData.destinatario = destinatario;
        const remitente = this.usuariosService.findById(notificacionData.remitente);
        notificacionData.remitente = remitente;

        const notificacion = new Notificacion(notificacionData);
        return this.notificacionesRepository.save(notificacion);
    }

    async getLeidosNoLeidos (idDestinatario, leido) {
       return this.notificacionesRepository.getLeidos(idDestinatario, leido).toDTO(); //leido es un booleano
    }

    async leer (idNotificacion) {
        const notificacion = this.notificacionesRepository.getById(idNotificacion);
        if (!notificacion) throw new BadRequestError("No se encontro la notificacion con el id " + idNotificacion);
        notificacion.marcarComoLeida();
        return this.notificacionesRepository.save(notificacion).toDTO();
    }
}