import { Especialidad } from "../domain/servicios/especialidad.js";
import { Practica } from "../domain/servicios/practica.js";

export class ServicioMapper {

    static toDomain(servicioDoc) {
        if (!servicioDoc) return null;
        if (servicioDoc.tipo === "Especialidad") return this.#especialidadToDomain(servicioDoc);
        if (servicioDoc.tipo === "Practica") return this.#practicaToDomain(servicioDoc);
        throw new Error(`Tipo de servicio desconocido: ${servicioDoc.tipo}`);
    }

    static toPersistence(servicio) {
        if (servicio instanceof Especialidad) return this.#especialidadToPersistance(servicio);
        if (servicio instanceof Practica) return this.#practicaToPersistance(servicio);
        throw new Error(`Tipo de servicio desconocido: ${servicio?.constructor?.name}`);
    }

    static toDTO(servicio) {
        return {
            id: servicio.id,
            nombre: servicio.nombre,
            duracion: servicio.duracionTurnoEnMins,
            costo: servicio.getCosto(),
            codigo: servicio.getCodigo(),
            especialidadPadre: servicio.getEspecialidadPadre()
        };
    }

    static #especialidadToDomain(especialidadDoc) {
        const especialidad = new Especialidad({
            nombre: especialidadDoc.nombre,
            duracionTurnoEnMins: especialidadDoc.duracionTurnoEnMins,
            costoConsulta: especialidadDoc.costoConsulta
        });
        especialidad.id = especialidadDoc._id?.toString() ?? especialidadDoc.id;
        return especialidad;
    }

    static #practicaToDomain(practicaDoc) {
        const practica = new Practica({
            nombre: practicaDoc.nombre,
            duracionTurnoEnMins: practicaDoc.duracionTurnoEnMins,
            costo: practicaDoc.costo,
            codigo: practicaDoc.codigo,
            especialidadPadre: this.#especialidadToDomain(practicaDoc.especialidadPadreId)
        });
        practica.id = practicaDoc._id?.toString() ?? practicaDoc.id;
        return practica;
    }

    static #especialidadToPersistance(especialidad) {
        return {
            nombre: especialidad.nombre,
            duracionTurnoEnMins: especialidad.duracionTurnoEnMins,
            costoConsulta: especialidad.costoConsulta
        };
    }

    static #practicaToPersistance(practica) {
        return {
            nombre: practica.nombre,
            duracionTurnoEnMins: practica.duracionTurnoEnMins,
            costo: practica.costo,
            codigo: practica.codigo,
            especialidadPadreId: practica.especialidadPadre.id
        };
    }
}