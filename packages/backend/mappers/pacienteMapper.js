import { Paciente } from "../domain/paciente.js";

export class PacienteMapper {
    static toDomainSimple(pacienteDoc) {
        if (!pacienteDoc) return null;
        const paciente = new Paciente({
            id: pacienteDoc._id?.toString() || pacienteDoc.id,
            nombre: pacienteDoc.nombre,
            usuario: pacienteDoc.usuario,
            obraSocial: pacienteDoc.obraSocial,
            plan: pacienteDoc.plan
        });
        return paciente;
    }     
}