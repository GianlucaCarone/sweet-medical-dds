import { servicioSchema } from "../schemas/database/servicioSchema.js";
import { logger } from '../config/logger.js'; 

export class ServiciosRepository {
    constructor () {this.model = servicioSchema;}

    async save (servicio) {
        logger.info("[SERVICIO REPOSTIRORY]: Guardado servicio: ", servicio);
        const nuevoServicio = new this.model(servicio);
        const servicioGuardado = await nuevoServicio.save();
        logger.info("[SERVICIO REPOSTIRORY]: Servicio guardado: ", servicioGuardado);
        return servicioGuardado;
    }

    async getById (idServicio) {
        logger.info("[SERVICIO REPOSTIRORY]: Obteniendo servicio: ", idServicio);
        const servicio = await this.model.findById(idServicio);
        logger.info("[SERVICIO REPOSTIRORY]: Servicio obtenido: ", servicio);
        return servicio;
    }

    async deleteById (id) {
        logger.info("[SERVICIO REPOSTIRORY]: Eliminando servicio: ", idServicio);
        await this.model.findByIdAndDelete(id);
        logger.info("[SERVICIO REPOSTIRORY]: Servicio eliminado");
    }
}