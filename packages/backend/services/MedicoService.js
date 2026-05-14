import { NotFoundError, ConflictError } from "../errors/AppError.js";
import { MedicoRepository } from "../repositories/MedicoRepository.js";
import { UsuarioService } from "./UsuarioService.js";
import { DisponibilidadHoraria } from "../domain/disponibilidadHoraria.js";
import { SedeService } from "./SedeService.js";
import { MedicoMapper } from "../mappers/MedicoMapper.js";
import { logger } from "../config/logger.js";

export class MedicoService {
  constructor({
    medicoRepository = new MedicoRepository(),
    usuarioService = new UsuarioService(),
    sedeService = new SedeService(),
  } = {}) {
    this.medicoRepository = medicoRepository;
    this.usuarioService = usuarioService;
    this.sedeService = sedeService;
  }

  async create(medicoData) {
    logger.info("Iniciando creación de médico con los datos: ", medicoData);
    const usuarioDTO = await this.usuarioService.findById(medicoData.idUsuario);

    if (!usuarioDTO) {
      logger.error("Usuario no encontrado para el ID: ", medicoData.idUsuario);
      throw new Error("Usuario no encontrado");
    }

    const medicoExistente = await this.medicoRepository.findByIdUsuario(
      usuarioDTO.id,
    ); // Verificar que no exista otro médico con el mismo nombre de usuario
    if (medicoExistente) {
      logger.error(
        "Ya existe un médico con ese nombre de usuario: ",
        medicoData.nombre,
      );
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
    return this.toDto(medicoEliminado);
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

  async agregarSede(medicoId, sedeId) {
    logger.info(`Agregando sede ${sedeId} al médico ${medicoId}`);
    const medico = await this.medicoRepository.findById(medicoId);
    if (!medico) {
      throw new NotFoundError("Médico no encontrado");
    }

    const sede = await this.sedeService.getById(sedeId);

    const medicoDomain = MedicoMapper.toDomain(medico);
    medicoDomain.agregarSede(sede);

    const medicoActualizado = await this.medicoRepository.save(medicoDomain);
    return this.toDto(medicoActualizado);
  }

  async eliminarSede(medicoId, sedeId) {
    logger.info(`Eliminando sede ${sedeId} del médico ${medicoId}`);
    const medico = await this.medicoRepository.findById(medicoId);

    if (!medico) {
      throw new NotFoundError("Médico no encontrado");
    }

    //const sede = this.sedeService.getById(sedeId);

    medico.eliminarSede(sedeId);

    const medicoActualizado = await this.medicoRepository.save(medico);
    return this.toDto(medicoActualizado);
  }

  async definirDisponibilidadPara(disponibilidadData, id) {
    logger.info(`Definiendo disponibilidad para el médico ${id}`);
    const medico = await this.medicoRepository.findById(id);
    const disponibilidad = new DisponibilidadHoraria(disponibilidadData);

    // Normalizar disponibilidades antes de procesarlas
    if (!medico.disponibilidades) {
      medico.disponibilidades = [];
    }
    medico.disponibilidades = medico.disponibilidades.map(d => 
      d instanceof DisponibilidadHoraria ? d : new DisponibilidadHoraria(d)
    );

    // TODO arreglar: se compara la dispo entrante con disponibilidades embebidas
    medico.definirDisponibilidad(disponibilidad);
    logger.info(`Disponibilidad definida para el médico ${id}: `, disponibilidad);

    // TODO avisar al turno service que genere los turnos.
    //await this.turnoService.regenerarTurnosDisponiblesDelMedico(medico.id);

    return this.medicoRepository.save(medico);
  }

  async modificarDisponibilidadPara(disponibilidadData, medicoId) {
    const medico= await this.medicoRepository.findById(medicoId);
    if (!medico) {
      throw new NotFoundError("Médico no encontrado");
    }

/*     // Normalizar disponibilidades antes de procesarlas
    if (!medicoRaw.disponibilidades) {
      medicoRaw.disponibilidades = [];
    }
    medicoRaw.disponibilidades = medicoRaw.disponibilidades.map(d => 
      d instanceof DisponibilidadHoraria ? d : new DisponibilidadHoraria(d)
    ); */

    const disponibilidad = new DisponibilidadHoraria(disponibilidadData);

    medico.modificarDisponibilidad(disponibilidad);

    // TODO avisar al turno service que genere los turnos.
    //await this.turnoService.regenerarTurnosDisponiblesDelMedico(medico.id);

    return this.medicoRepository.save(medico);
  }

  async eliminarDisponibilidadPara(medicoId, diaSemana) {
    const medico = await this.findById(medicoId);

    medico.eliminarDisponibilidad(diaSemana);

    // TODO avisar al turno service que genere los turnos.
    //await this.turnoService.regenerarTurnosDisponiblesDelMedico(medico.id);

    return this.medicoRepository.save(medico);
  }

  async consultarDisponibilidad(medicoId, practicaId) {
    const medico = await this.findById(medicoId);

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
      disponibilidades: medico.disponibilidades,
    };
  }
}
