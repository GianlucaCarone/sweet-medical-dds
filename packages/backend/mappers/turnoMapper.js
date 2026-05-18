<<<<<<< HEAD
export class TurnoMapper {
    static toPersistence(turno) {
        return {
            medico: turno.medico.id,
            fechaHora: turno.fechaHora,
            sede: turno.sede?.id ?? null,
            estado: turno.estado,
            historialEstado: turno.historialEstado,
            practica: turno.practica?.id ?? null,
            especialidad: turno.especialidad?.id ?? null,
            paciente: turno.paciente?.id ?? null,
            costo: turno.costo ?? null
        };
    }
}
=======
import { Turno } from "../domain/turnos/turno.js";

export class TurnoMapper {
  static toDomain(turnoDoc) {
    if (!turnoDoc) return null;
    const turno = new Turno({
      medico: turnoDoc.medico,
      fechaHora: turnoDoc.fechaHora,
      sede: turnoDoc.sede,
      servicio: turnoDoc.servicio
    });
    
    turno.id = turnoDoc._id?.toString() || turnoDoc.id;
    turno.paciente = turnoDoc.paciente;
    turno.estado = turnoDoc.estado;
    turno.historialEstado = turnoDoc.historialEstado || [];
    turno.fechaHoraPropuesta = turnoDoc.fechaHoraPropuesta;
    turno.costo = turnoDoc.costo;
    
    return turno;
  }
    
  static toDTO(turno) {
    if (!turno) return null;
    return {
      id: turno.id || turno._id?.toString(),
      fechaHora: turno.fechaHora,
      fechaHoraPropuesta: turno.fechaHoraPropuesta,
      estado: turno.estado,
      medico: turno.medico?.id ?? turno.medico,
      paciente: turno.paciente?.id ?? turno.paciente,
      practica: turno.practica?.id ?? turno.practica,
      especialidad: turno.especialidad?.id ?? turno.especialidad,
      servicio: turno.servicio?.id ?? turno.servicio,
      sede: turno.sede?.id ?? turno.sede,
      costo: turno.costo,
      historialEstado: turno.historialEstado?.map(h => ({
        fechaHoraIngreso: h.fechaHoraIngreso,
        estado: h.estado,
        usuario: h.usuario?.id ?? h.usuario,
        motivo: h.motivo
      })) ?? []
    };
  }

  static toPersistence(turno) {
    return {
      medico: turno.medico,
      fechaHora: turno.fechaHora,
      sede: turno.sede,
      servicio: turno.servicio,
      paciente: turno.paciente,
      estado: turno.estado,
      historialEstado: turno.historialEstado,
      fechaHoraPropuesta: turno.fechaHoraPropuesta,
      costo: turno.costo
    };
  }
}
>>>>>>> 0870246c7e6075b06923482da68dfa3f8668bab0
