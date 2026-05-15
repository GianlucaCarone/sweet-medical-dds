import { Especialidad } from "../domain/servicios/especialidad.js";
import { Practica } from "../domain/servicios/practica.js";
import { logger } from "../config/logger.js";

export class ServicioMapper {

    static toDomain(servicioDoc) {
        if (!servicioDoc) return null;

        if (servicioDoc.tipo === "Especialidad") {
            return new Especialidad({
                nombre: servicioDoc.nombre,
                duracionTurnoEnMins: servicioDoc.duracionTurnoEnMins,
                costoConsulta: servicioDoc.costoConsulta
            });
        }

        if (servicioDoc.tipo === "Practica") {
            return new Practica({
                nombre: servicioDoc.nombre,
                duracionTurnoEnMins: servicioDoc.duracionTurnoEnMins,
                costo: servicioDoc.costo,
                codigo: servicioDoc.codigo
            });
        }

        throw new Error(`Tipo de servicio desconocido: ${servicioDoc.tipo}`);
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