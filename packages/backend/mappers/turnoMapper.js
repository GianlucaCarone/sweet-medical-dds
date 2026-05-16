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