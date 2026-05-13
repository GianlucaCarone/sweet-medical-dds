import { NotificacionModel } from "../schemas/database/notificacionSchema.js";

export class NotificacionesRepository {
    //Este es el modelo que creamos en el esquema, es el modelo de mongoose que nos ayudara con todas las consultas a la base
    constructor () {this.model = NotificacionModel;}

    async getByDestinatarioIdAndLeido(idDestinatario, leido) {
        return await this.model.find({ 
            destinatario: idDestinatario, 
            leido: leido }).populate("remitente");
    }

//    async getByDestinatarioAndLeido(destinatario, leido) {
//        return await this.model.find({ 
//            destinatario: destinatario._id, 
//            leido: leido }).populate('remitente')
//        
//    }

    async save (notificacion) {
        const nuevaNotificacion = new this.model(notificacion);
        return await nuevaNotificacion.save();
    }

    async getById (idNotificacion) {
        return await this.model.findById(idNotificacion).populate("remitente");
    }
}