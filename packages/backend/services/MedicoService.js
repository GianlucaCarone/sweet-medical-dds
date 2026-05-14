import { MedicoRepository } from "../repositories/MedicoRepository.js";
import { UsuarioService } from "./UsuarioService.js";
import { DisponibilidadHoraria } from "../domain/disponibilidadHoraria.js";
import { Medico } from "../domain/medico.js";
import { Usuario } from "../domain/usuario.js";
import { Sede } from "../domain/sede.js";
import { SedeService } from "./SedeService.js";
import { ConflictError } from "../errors/AppError.js";

export class MedicoService {
  constructor({ medicoRepository = new MedicoRepository(), usuarioService = new UsuarioService(), sedeService = new SedeService() } = {}) {
    this.medicoRepository = medicoRepository;
    this.usuarioService = usuarioService;
    this.sedeService = sedeService;
  }

  async create(medicoData) {
    logger.info("Iniciando creación de médico con los datos: ", medicoData);
    const usuarioDTO = await this.usuarioService.findById(medicoData.idUsuario);

    if(!usuarioDTO) {
      logger.error("Usuario no encontrado para el ID: ", medicoData.idUsuario);
      throw new Error("Usuario no encontrado");
    }

    const medicoExistente = await this.medicoRepository.findByIdUsuario(usuarioDTO.id); // Verificar que no exista otro médico con el mismo nombre de usuario
    if(medicoExistente) {
      logger.error("Ya existe un médico con ese nombre de usuario: ", medicoData.nombre);
      throw new ConflictError("Ya existe un médico con ese nombre de usuario");
    }

    const medico = {
      nombre: medicoData.nombre,
      matricula: medicoData.matricula,
      idUsuario: medicoData.idUsuario,
    }; 
    const nuevoMedico = await this.medicoRepository.save(medico);
    logger.info("Médico creado exitosamente: ", nuevoMedico);
    return this.toDto(nuevoMedico);
  }

  async findById(id) {
    const medico = await this.medicoRepository.findById(id);

    if (!medico) {
      throw new NotFoundError("Médico no encontrado");
    }

    return this.toDto(medico);
  }

  async findAll() {
    logger.info("Consultando todos los médicos");
    return this.medicoRepository.findAll().then(medicos => medicos.map(medico => this.toDto(medico)));
  }

  async delete(id) {
    logger.info(`Eliminando médico con ID: ${id}`);
    const medicoEliminado = await this.medicoRepository.delete(id);

    if (!medicoEliminado) {
      throw new NotFoundError("Médico no encontrado");
    }

    logger.info(`Médico eliminado con ID: ${id}`);
    return  this.toDto(medicoEliminado);
  }

  crearMedicos(listaMedicos) {
    return listaMedicos.map((medicoData) => this.create(medicoData));
  }

  validarMedico(medico) {
    // TODO: Implementar validaciones necesarias para el médico
    this.validarUsuario(medico.idUsuario);
    this.validarMatricula(medico.matricula);
  }

  validarUsuario(idUsuario) {
    // TODO: Implementar validaciones necesarias para el usuario
  }

  agregarSede(medicoId, sedeId) {
    const medico = this.findById(medicoId);

    const sede = this.sedeService.getById(sedeId);

    medico.agregarSede(sede);

    return this.medicoRepository.save(medico);
  }

  eliminarSede(medicoId, sedeId) {
    const medico = this.findById(medicoId);

    //const sede = this.sedeService.getById(sedeId);

    medico.eliminarSede(sedeId);

    return this.medicoRepository.save(medico);
  }

  definirDisponibilidadPara(disponibilidadData, id) {
    const medico = this.findById(id);
    const disponibilidad = new DisponibilidadHoraria(disponibilidadData);
    medico.definirDisponibilidad(disponibilidad);
    return this.medicoRepository.save(medico);
  }

  modificarDisponibilidadPara(disponibilidadData, medicoId) {
    const medico = this.findById(medicoId);
    const disponibilidad = new DisponibilidadHoraria(disponibilidadData);

    medico.modificarDisponibilidad(disponibilidad);

    return this.medicoRepository.save(medico);
  }

  eliminarDisponibilidadPara(medicoId, diaSemana) {
    const medico = this.findById(medicoId);

    medico.eliminarDisponibilidad(diaSemana);

    return this.medicoRepository.save(medico);
  }

  consultarDisponibilidad(medicoId, practicaId) {
    const medico = this.findById(medicoId);

    if (!medico.ofrecePractica(practicaId)) {
      throw new Error("El médico no ofrece esa práctica");
    }

    return medico.disponibilidades;
  }
  
  toDto(medico) {
    return {
      id: medico._id,
      nombre: medico.nombre,
      matricula: medico.matricula,
      idUsuario: medico.idUsuario,
      sedes: medico.sedes,
      disponibilidades: medico.disponibilidades
    };
  }

}
