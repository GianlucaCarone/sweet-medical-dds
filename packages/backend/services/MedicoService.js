import { MedicoRepository } from "../repositories/MedicoRepository.js";
import { UsuarioService } from "./UsuarioService.js";
import { DisponibilidadHoraria } from "../domain/disponibilidadHoraria.js";
import { Medico } from "../domain/medico.js";
import { Usuario } from "../domain/usuario.js";
import { Sede } from "../domain/sede.js";
import { SedeService } from "./SedeService.js";

export class MedicoService {
  constructor({ medicoRepository = new MedicoRepository(), usuarioService = new UsuarioService(), sedeService = new SedeService() } = {}) {
    this.medicoRepository = medicoRepository;
    this.usuarioService = usuarioService;
    this.sedeService = sedeService;
  }

  create(medicoData) {
    const usuario = this.usuarioService.findById(medicoData.usuario);

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

  agregarSede(medicoId, sedeId) {
    const medico = this.getById(medicoId);

    const sede = this.sedeService.getById(sedeId);

    medico.agregarSede(sede);

    return this.medicoRepository.save(medico);
  }

  eliminarSede(medicoId, sedeId) {
    const medico = this.getById(medicoId);

    //const sede = this.sedeService.getById(sedeId);

    medico.eliminarSede(sedeId);

    return this.medicoRepository.save(medico);
  }

  consultarDisponibilidad(medicoId, practicaId) {
    const medico = this.getById(medicoId);

    if (!medico.ofrecePractica(practicaId)) {
      throw new Error("El médico no ofrece esa práctica");
    }

    // TODO: Falta relacionarlo bien con turnos, por ahora solo valida que el medico tenga la practica. (Capaz haya que cambiarlo)
    return medico.disponibilidades;
  }

}
