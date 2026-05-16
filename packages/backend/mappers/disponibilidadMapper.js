import { DisponibilidadHoraria } from "../domain/disponibilidadHoraria.js";

export class DisponibilidadMapper {
  static toDomain(disponibilidadDoc) {
    return new DisponibilidadHoraria({
      diaSemana: disponibilidadDoc.diaSemana,
      horaDesde: disponibilidadDoc.horaDesde,
      horaHasta: disponibilidadDoc.horaHasta,
    });
  }

  static toPersistence(disponibilidad) {
    return {
      diaSemana: disponibilidad.diaSemana,
      horaDesde: disponibilidad.horaDesde,
      horaHasta: disponibilidad.horaHasta,
    };
  }
}