import { notificacion } from "../domain/notificacion.js"
import { NotificacionesRepository } from "../repositories/notificacionesRepository.js";
import { BadRequestError } from "../errors/AppError.js";

export class NotificacionesService {
    constructor({ notificacionesRepository = new NotificacionesRepository() } = {}) {
        this.notificacionesRepository = notificacionesRepository;
    }

    getLeidosNoLeidos (idDestinatario, leido) {
       return this.notificacionesRepository.getLeidos(idDestinatario, leido); //leido es un booleano
    }

    leer (idNotificacion) {
        const notificacion = this.notificacionesRepository.getById(idNotificacion);
        if (!notificacion) throw new BadRequestError("No se encontro el turno con el id " + id)
        notificacion.marcarComoLeida();
        return this.notificacionesRepository.save(notificacion);
    }
}