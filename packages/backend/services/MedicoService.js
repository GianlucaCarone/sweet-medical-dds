import { MedicoRepository } from "../repositories/MedicoRepository.js";
import { DisponibilidadHoraria } from "../domain/disponibilidadHoraria.js";
import { Medico } from "../domain/medico.js";
import { Usuario } from "../domain/usuario.js";

export class MedicoService {
  constructor({ medicoRepository = new MedicoRepository() } = {}) {
    this.medicoRepository = medicoRepository;
  }

  create(medicoData) {
    const usuario = new Usuario(medicoData.usuario);

    const medico = new Medico({
      nombre: medicoData.nombre,
      matricula: medicoData.matricula,
      usuario
    });

    return this.medicoRepository.save(medico);
  }

  getById(id) {
    const medico = this.medicoRepository.findById(id);

    if (!medico) {
      throw new Error("Médico no encontrado");
    }

    return medico;
  }

  definirDisponibilidadPara(disponibilidadData, id) {
    const medico = this.getById(id);
    const disponibilidad = new DisponibilidadHoraria(disponibilidadData);
    medico.definirDisponibilidad(disponibilidad);
    return this.medicoRepository.save(medico);
  }

  crearMedicos(listaMedicos) {
    return listaMedicos.map((medicoData) => this.create(medicoData));
  }

  validarMedico(medico) {
    // TODO: Implementar validaciones necesarias para el médico
    this.validarUsuario(medico.usuario);
    this.validarMatricula(medico.matricula);
    
  }

  validarUsuario(usuario) {
    // TODO: Implementar validaciones necesarias para el usuario
  }
}
