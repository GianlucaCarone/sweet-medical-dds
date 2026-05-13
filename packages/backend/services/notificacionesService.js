import { NotificacionesRepository } from "../repositories/notificacionesRepository.js";
import { BadRequestError } from "../errors/AppError.js";

export class NotificacionesService {
    constructor({ notificacionesRepository = new NotificacionesRepository() } = {}) {
        this.notificacionesRepository = notificacionesRepository;
    }

    async getLeidosNoLeidos (idDestinatario, leido) {
       return this.notificacionesRepository.getLeidos(idDestinatario, leido); //leido es un booleano
    }

    async leer (idNotificacion) {
        const notificacion = this.notificacionesRepository.getById(idNotificacion);
        if (!notificacion) throw new BadRequestError("No se encontro la notificacion con el id " + idNotificacion);
        notificacion.marcarComoLeida();
        return this.notificacionesRepository.save(notificacion);
    }
}