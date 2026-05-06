import { MedicoRepository } from "../repositories/MedicoRepository.js";
import { DisponibilidadHoraria } from "../domain/disponibilidadHoraria.js";

export class MedicoService {
  constructor({ medicoRepository = new MedicoRepository() } = {}) {
    this.medicoRepository = medicoRepository;
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
    listaMedicos.forEach(medicoData => {
      const medico = new Medico(medicoData);
      this.validarMedico(medico);
      this.medicoRepository.save(medico);
    });
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
