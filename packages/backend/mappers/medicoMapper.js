import { Medico } from "../domain/medico.js";
import { UsuarioMapper } from "./usuarioMapper.js";

export class MedicoMapper {
  static toDomain(medicoDoc, usuarioDoc) {
    const medico = new Medico({
      nombre: medicoDoc.nombre,
      matricula: medicoDoc.matricula,
      usuario: UsuarioMapper.toDomain(usuarioDoc),
    });

    medico.id = medicoDoc._id?.toString() ?? medicoDoc.id;
    //medico.disponibilidades = (medicoDoc.disponibilidades ?? []).map(DisponibilidadMapper.toDomain);

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

  static toDto(medico) {
    return {
      id: medico._id,
      nombre: medico.nombre,
      matricula: medico.matricula,
      idUsuario: medico.idUsuario,
      //sedes: medico.sedes,
      //disponibilidades: medico.disponibilidades,
    };
  }
}

