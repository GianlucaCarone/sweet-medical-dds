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
    medico.especialidades = (medicoDoc.especialidades ?? []).map((e) => ServicioMapper.toDomain(e)); //usa metodos privados asi que hay que envolverlos, sin usarlos como referencia directa
    medico.practicas = (medicoDoc.practicas ?? []).map((p) => ServicioMapper.toDomain(p));
    medico.sedes = (medicoDoc.sedes ?? []).map(SedeMapper.toDomain);

    return medico;
  }

  static toPersistence(medico) {
    return {
      nombre: medico.nombre,
      matricula: medico.matricula,
      idUsuario: medico.usuario.id,
      disponibilidades: medico.disponibilidades.map(DisponibilidadMapper.toPersistence),
      especialidades: medico.especialidades.map(e => e.id),
      practicas: medico.practicas.map(p => p.id),
      sedes: medico.sedes.map(s => s.id)
    };
  }

  static toDTO(medico) {
    if (medico instanceof Medico) {
      return {
        id: medico._id,
        nombre: medico.nombre,
        matricula: medico.matricula,
        usuario: UsuarioMapper.toDTO(medico.usuario),
        especialidades: medico.especialidades.map(ServicioMapper.toDTO),
        practicas: medico.practicas.map(ServicioMapper.toDTO),
        disponibilidades: medico.disponibilidades.map(DisponibilidadMapper.toDTO),
        sedes: medico.sedes.map(SedeMapper.toDTO)
      };
    } else {
      return {
        id: medico._id,
        nombre: medico.nombre,
        matricula: medico.matricula,
        usuario: UsuarioMapper.toDTO(medico.idUsuario),
        especialidades: medico.especialidades.map(ServicioMapper.toDTO),
        practicas: medico.practicas.map(ServicioMapper.toDTO),
        disponibilidades: medico.disponibilidades.map(DisponibilidadMapper.toDTO),
        sedes: medico.sedes.map(SedeMapper.toDTO)
      };
    }

  }
}