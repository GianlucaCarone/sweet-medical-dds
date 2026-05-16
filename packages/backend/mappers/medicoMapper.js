import { Medico } from "../domain/medico.js";
import { UsuarioMapper } from "./usuarioMapper.js";
import { DisponibilidadMapper } from "./disponibilidadMapper.js";
import { SedeMapper } from "./sedeMapper.js";
import { ServicioMapper } from "./servicioMapper.js";

export class MedicoMapper {
  static toDomain(medicoDoc) {
    const medico = new Medico({
      nombre: medicoDoc.nombre,
      matricula: medicoDoc.matricula,
      usuario: UsuarioMapper.toDomain(medicoDoc.idUsuario)
    });

    medico.id = medicoDoc._id?.toString() ?? medicoDoc.id;
    medico.disponibilidades = (medicoDoc.disponibilidades ?? []).map(DisponibilidadMapper.toDomain);
    medico.especialidades = (medicoDoc.especialidades ?? []).map(ServicioMapper.toDomain);
    medico.practicas = (medicoDoc.practicas ?? []).map(ServicioMapper.toDomain);
    medico.sedes = (medicoDoc.sedes ?? []).map(SedeMapper.toDomain);

    return medico;
  }

  static toPersistence(medico) {
    return {
      nombre: medico.nombre,
      matricula: medico.matricula,
      idUsuario: medico.usuario.id,
      disponibilidades: medico.disponibilidades.map(d => d.id),
      especialidades: medico.especialidades.map(e => e.id),
      practicas: medico.practicas.map(p => p.id)
    };
  }

  static toDTO(medico) {
    return {
      id: medico.id,
      nombre: medico.nombre,
      matricula: medico.matricula,
      usuario: UsuarioMapper.toDTO(medico.usuario),
      especialidades: medico.especialidades.map(ServicioMapper.toDTO),
      practicas: medico.practicas.map(ServicioMapper.toDTO),
      //disponibilidades: medico.disponibilidades.map(DisponibilidadMapper.toDTO),
      sedes: medico.sedes.map(SedeMapper.toDTO)
    };
  }
}