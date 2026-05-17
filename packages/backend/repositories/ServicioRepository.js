import { ServicioModel, EspecialidadModel, PracticaModel } from "../schemas/database/servicioSchema.js";
import { ServicioMapper } from "../mappers/servicioMapper.js";
import { Especialidad } from "../domain/servicios/especialidad.js";
import { Practica } from "../domain/servicios/practica.js";
import { logger } from "../config/logger.js";

export class ServicioRepository {
    constructor() {
        this.model = ServicioModel;
    }

    #resolverModelo(servicio) {
        if (servicio instanceof Especialidad) return EspecialidadModel;
        if (servicio instanceof Practica) return PracticaModel;
        throw new Error(`Tipo de servicio desconocido: ${servicio?.constructor?.name}`);
    }

    async save(servicio) {
        logger.info("[SERVICIO REPOSTIRORY]: Guardando servicio: ", servicio);
        const modelo = this.#resolverModelo(servicio);
        let servicioGuardado;
        if (servicio.id) {
            servicioGuardado = await modelo.findByIdAndUpdate(servicio.id, ServicioMapper.toPersistence(servicio), { new: true, runValidators: true });
        } else {
            const nuevoServicio = new modelo(ServicioMapper.toPersistence(servicio));
            servicioGuardado = await nuevoServicio.save();
        }
        logger.info("[SERVICIO REPOSTIRORY]: Servicio guardado: ", servicioGuardado);

        return ServicioMapper.toDomain(servicioGuardado);
    }

    async findById(idServicio) {
        logger.info("[SERVICIO REPOSTIRORY]: Obteniendo servicio: ", idServicio);
        const servicio = await this.model.findById(idServicio);
        const mensaje = (servicio) ? ("Servicio obtenido: " + servicio) : ("No se encontro el servicio con id: " + idServicio);
        logger.info("[SERVICIO REPOSTIRORY]: " + mensaje);

        return ServicioMapper.toDomain(servicio);
    }

    async findByNombre(nombreServicio) {
        logger.info("[SERVICIO REPOSTIRORY]: Obteniendo servicio: ", nombreServicio);
        const servicio = await this.model.findOne({ nombre: nombreServicio });
        const mensaje = (servicio) ? ("Servicio obtenido: " + servicio) : ("No se encontro el servicio con nombre: " + nombreServicio);
        logger.info("[SERVICIO REPOSTIRORY]: " + mensaje);

        return ServicioMapper.toDomain(servicio);
    }

    async deleteById(idServicio) {
        logger.info("[SERVICIO REPOSTIRORY]: Eliminando servicio: ", idServicio);
        await this.model.findByIdAndDelete(idServicio);
        logger.info("[SERVICIO REPOSTIRORY]: Servicio eliminado");
    }
}