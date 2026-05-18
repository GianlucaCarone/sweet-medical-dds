import { Especialidad } from "../domain/servicios/especialidad.js";
import { Practica } from "../domain/servicios/practica.js";
import { ServicioRepository } from "../repositories/ServicioRepository.js";
import {
    NotFoundError,
    ConflictError,
    BadRequestError,
} from "../errors/AppError.js";
import { logger } from "../config/logger.js";
import { ServicioMapper } from "../mappers/servicioMapper.js";

export class ServicioService {
    constructor({ serviciosRepository = new ServicioRepository() } = {}) {
        this.serviciosRepository = serviciosRepository;
    }

    async getAll() {
        logger.info("[SERVICIO SERVICE]: Obteniendo todos los servicios");
        const servicios = await this.serviciosRepository.findAll();
        logger.info("[SERVICIO SERVICE]:Todos los servicios obtenidos: " + servicios);
        return servicios;
    }

    async getById(idServicio) {
        logger.info("[SERVICIO SERVICE]: Obteniendo servicio: ", idServicio);
        const servicio = await this.serviciosRepository.findById(idServicio);
        if (!servicio)
            throw new NotFoundError(
                "No se encontro el servicio con el id " + idServicio,
            );
        logger.info("[SERVICIO SERVICE]: Servicio encontrado: ", servicio);
        return ServicioMapper.toDTO(servicio);
    }

    async findEntityById(idServicio) {
        logger.info("[SERVICIO SERVICE]: Obteniendo servicio: ", idServicio);
        const servicio = await this.serviciosRepository.findById(idServicio);
        if (!servicio)
            throw new NotFoundError(
                "No se encontro el servicio con el id " + idServicio,
            );
        logger.info("[SERVICIO SERVICE]: Servicio encontrado: ", servicio);
        return servicio;
    }

    async create(datosServicio) {
        //TODO: VER QUE FUNCIONE
        logger.info("[SERVICIO SERVICE]: Creando servicio: " + datosServicio);

        if (await this.serviciosRepository.findByNombre(datosServicio.nombre))
            throw new ConflictError("Ya existe un servicio con ese nombre");

        const servicio = await this.#crearEntidad(datosServicio);
        const servicioGuardado = await this.serviciosRepository.save(servicio);
        logger.info("[SERVICIO SERVICE]: Servicio creado:", servicioGuardado);
        return ServicioMapper.toDTO(servicioGuardado);
    }

    async update(idServicio, datosServicio) {
        //TODO: VER QUE FUNCIONE
        logger.info("[SERVICIO SERVICE]: Actualizando servicio.");
        const servicio = await this.serviciosRepository.findById(idServicio);
        if (!servicio)
            throw new NotFoundError(
                "No se encontro el servicio con el id " + idServicio,
            );

        const servicioActualizado = await this.#crearEntidad(datosServicio);
        servicioActualizado.id = servicio.id;
        logger.info(
            "[SERVICIO SERVICE]: Servicio actualizado: ",
            servicioActualizado,
        );
        const servicioGuardado =
            await this.serviciosRepository.save(servicioActualizado);
        logger.info(
            "[SERVICIO SERVICE]: Servicio guardado luego de actualizarse: ",
            servicioGuardado,
        );
        return ServicioMapper.toDTO(servicioActualizado);
    }

    async delete(id) {
        logger.info("[SERVICIO SERVICE]:Eliminando servicio con el id: ", id);
        this.serviciosRepository.deleteById(id);
        logger.info("[SERVICIO SERVICE]:Servicio eliminado.");
    }

    async #crearEntidad(datosServicio) {
        //TODO: VER QUE FUNCIONE
        if (!datosServicio.codigo && !datosServicio.especialidadPadreId) {
            logger.info("[SERVICIO SERVICE]: Creando especialidad.");
            const especialidadData = {
                nombre: datosServicio.nombre,
                duracionTurnoEnMins: datosServicio.duracionEnMin,
                costo: datosServicio.costo,
            };
            const especialidad = new Especialidad(especialidadData);
            logger.info("[SERVICIO SERVICE]: Especialidad creada: ", especialidad);
            return especialidad;
        } else {
            logger.info(
                "[SERVICIO SERVICE]: Creando practica; obteniendo especialidad padre.",
            );
            const especialidadPadre = await this.serviciosRepository.findById(
                datosServicio.especialidadPadreId,
            );
            if (!(especialidadPadre instanceof Especialidad))
                throw new BadRequestError(
                    "El id de especialidad padre no corresponde a una especialidad",
                );
            logger.info("[SERVICIO SERVICE]: Creando practica.");
            const practicaData = {
                codigo: datosServicio.codigo,
                nombre: datosServicio.nombre,
                duracionTurnoEnMins: datosServicio.duracionEnMin,
                costo: datosServicio.costo,
                especialidadPadre: especialidadPadre,
            };
            const practica = new Practica(practicaData);
            logger.info("[SERVICIO SERVICE]: Practica creada: ", practica);
            return practica;
        }
    }
}
