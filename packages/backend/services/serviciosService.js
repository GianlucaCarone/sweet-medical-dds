import {Especialidad} from "../domain/servicios/especialidad.js";
import {Practica} from "../domain/servicios/practica.js";
import { ServiciosRepository } from "../repositories/serviciosRepository.js";

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
        this.validarDatosServicio(datosServicio);
        const servicio = this.crearEntidad(datosServicio);

        return this.serviciosRepository.save(servicio).toDTO();
    }

    async update (id, datosServicio) {
        this.validarDatosServicio(datosServicio);
        const servicio = this.serviciosRepository.getById(id);

        const servicioActualizado = this.crearEntidad(datosServicio);
        servicioActualizado.setId(servicio.id);

        return this.serviciosRepository.save(servicioActualizado).toDTO();
    }

    async delete (id) {
        this.serviciosRepository.deleteById(id);
    }

    crearEntidad (datosServicio) {
        if (datosServicio.codigo.trim === "") {
            const especialidad = new Especialidad (datosServicio.nombre, datosServicio.duracion, datosServicio.costo);
            return especialidad;
        } else {
            const practica = new Practica (datosServicio.codigo, datosServicio.nombre, datosServicio.duracion, datosServicio.costo);
            return practica;
        }
    }
}