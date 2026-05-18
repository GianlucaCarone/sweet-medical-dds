import { DisponibilidadHoraria } from "../domain/disponibilidadHoraria.js";
import { SedeMapper } from "./sedeMapper.js";
import { ServicioMapper } from "./servicioMapper.js";

export class DisponibilidadMapper {
  static toDomain(disponibilidadDoc) {
    return new DisponibilidadHoraria({
      diaSemana: disponibilidadDoc.diaSemana,
      horaDesde: disponibilidadDoc.horaDesde,
      horaHasta: disponibilidadDoc.horaHasta,
      sede: SedeMapper.toDomain(disponibilidadDoc.sede),
      servicio: ServicioMapper.toDomain(disponibilidadDoc.servicio)
    });
  }

  static toPersistence(disponibilidad) {
    return {
      diaSemana: disponibilidad.diaSemana,
      horaDesde: disponibilidad.horaDesde,
      horaHasta: disponibilidad.horaHasta,
      sede: disponibilidad.sede.id,
      servicio: disponibilidad.servicio.id
    };
  }

  static toDTO(disponibilidad) {
    return {
      diaSemana: disponibilidad.diaSemana,
      horaDesde: disponibilidad.horaDesde,
      horaHasta: disponibilidad.horaHasta,
      sede: SedeMapper.toDTO(disponibilidad.sede),
      servicio: ServicioMapper.toDTO(disponibilidad.servicio)
    };
  }
}