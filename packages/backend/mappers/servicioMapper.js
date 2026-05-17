import { Especialidad } from "../domain/servicios/especialidad.js";
import { Practica } from "../domain/servicios/practica.js";

export class ServicioMapper {

    static toDomain(servicioDoc) {
        if (!servicioDoc) return null;

        if (servicioDoc.tipo === "Especialidad") {
            const especialidad = new Especialidad({
                nombre: servicioDoc.nombre,
                duracionTurnoEnMins: servicioDoc.duracionTurnoEnMins,
                costoConsulta: servicioDoc.costoConsulta
            });
            especialidad.id = servicioDoc._id?.toString() ?? servicioDoc.id;
            return especialidad;
        }

        if (servicioDoc.tipo === "Practica") {
            const practica = new Practica({
                nombre: servicioDoc.nombre,
                duracionTurnoEnMins: servicioDoc.duracionTurnoEnMins,
                costo: servicioDoc.costo,
                codigo: servicioDoc.codigo
            });
            practica.id = servicioDoc._id?.toString() ?? servicioDoc.id;
            return practica;
        }

        throw new Error(`Tipo de servicio desconocido: ${servicioDoc.tipo}`);
    }

    static toPersistence(servicio) {
        if (servicio instanceof Especialidad) {
            return {
                nombre: servicio.nombre,
                duracionTurnoEnMins: servicio.duracionTurnoEnMins,
                costoConsulta: servicio.costoConsulta
            };
        }
        if (servicio instanceof Practica) {
            return {
                nombre: servicio.nombre,
                duracionTurnoEnMins: servicio.duracionTurnoEnMins,
                costo: servicio.costo,
                codigo: servicio.codigo
            };
        }
        throw new Error(`Tipo de servicio desconocido: ${servicio?.constructor?.name}`);
    }

    static toDTO(servicio) {
        return {
            id: servicio.id,
            nombre: servicio.nombre,
            duracion: servicio.duracionTurnoEnMins,
            costo: servicio.getCosto(),
            codigo: servicio.getCodigo()
        };
    }
}