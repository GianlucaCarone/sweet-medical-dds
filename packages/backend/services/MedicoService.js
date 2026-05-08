import { MedicoRepository } from "../repositories/MedicoRepository.js";
import { UsuarioService } from "./UsuarioService.js";
import { DisponibilidadHoraria } from "../domain/disponibilidadHoraria.js";
import { Medico } from "../domain/medico.js";
import { Usuario } from "../domain/usuario.js";

export class MedicoService {
  constructor({ medicoRepository = new MedicoRepository(), usuarioService = new UsuarioService() } = {}) {
    this.medicoRepository = medicoRepository;
    this.usuarioService = usuarioService;
  }

  create(medicoData) {
    const usuario = this.usuarioService.findById(medicoData.idUsuario);

    const medico = new Medico({
      nombre: medicoData.nombre,
      matricula: medicoData.matricula,
      usuario,
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

  findAll() {
    return this.medicoRepository.findAll();
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
