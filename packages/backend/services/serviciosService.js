import { Especialidad } from "../domain/servicios/especialidad.js";
import { Practica } from "../domain/servicios/practica.js";
import { ServiciosRepository } from "../repositories/serviciosRepository.js";
import { logger } from '../config/logger.js';

export class ServiciosService {
    constructor ({ serviciosRepository = new ServiciosRepository() } = {}) {
        this.serviciosRepository = serviciosRepository;
    }

    toDTO (servicio) {
        return {
            id: servicio.id,
            nombre: servicio.nombre,
            duracion: servicio.duracionTurnoEnMins,
            costo: servicio.getCosto(),
            codigo: servicio.getCodigo()
        };
    }

    async create (datosServicio) {
        logger.info("[SERVICIO SERVICE]: Creando servicio: ", datosServicio);
        //TODO: ver que no haya otro servicio en la db con ese mismo nombre
        const servicio = this.crearEntidad(datosServicio);
        const servicioGuardado = await this.serviciosRepository.save(servicio);
        logger("[SERVICIO SERVICE]: Servicio creado:", servicioGuardado);

        return this.toDTO(servicioGuardado);
    }

    async update (idServicio, datosServicio) {
        logger.info("[SERVICIO SERVICE]: Actualizando servicio.");
        const servicio = await this.serviciosRepository.getById(idServicio);
        if (!servicio) throw new BadRequestError("No se encontro el servicio con el id " + idServicio);

        const servicioActualizado = this.crearEntidad(datosServicio);
        servicioActualizado.setId(servicio.idServicio);
        logger.info("[SERVICIO SERVICE]: Servicio actualizado: ", servicioActualizado);
        const servicioGuardado = await this.serviciosRepository.save(servicioActualizado);
        logger.info("[SERVICIO SERVICE]: Servicio guardado luego de actualizarse: ", servicioGuardado);
        return this.toDTO(servicioActualizado);
    }

    async delete (id) {
        logger.info("[SERVICIO SERVICE]:Eliminando servicio con el id: ", id);
        this.serviciosRepository.deleteById(id);
        logger.info("[SERVICIO SERVICE]:Servicio eliminado.");
    }

    crearEntidad (datosServicio) {
        if (!datosServicio.codigo) {
            logger.info("[SERVICIO SERVICE]:Creando especialidad.");
            const especialidad = new Especialidad (datosServicio.nombre, datosServicio.duracion, datosServicio.costo);
            logger.info("[SERVICIO SERVICE]: Especialidad creada: ", especialidad);
            return especialidad;
        } else {
            logger.info("[SERVICIO SERVICE]: Creando practica.");
            const practica = new Practica (datosServicio.codigo, datosServicio.nombre, datosServicio.duracion, datosServicio.costo);
            logger.info("[SERVICIO SERVICE]: Practica creada: ", practica);
            return practica;
        }
    }
}