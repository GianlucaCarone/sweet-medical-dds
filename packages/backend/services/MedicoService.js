import { ServicioService } from "./ServicioService.js";
import { NotFoundError, ConflictError } from "../errors/AppError.js";
import { MedicoRepository } from "../repositories/MedicoRepository.js";
import { UsuarioService } from "./UsuarioService.js";
import { DisponibilidadHoraria } from "../domain/disponibilidadHoraria.js";
import { Medico } from "../domain/medico.js";
import { SedeService } from "./SedeService.js";
import { logger } from "../config/logger.js";
import { MedicoMapper } from "../mappers/medicoMapper.js";
import { TurnoService } from "./TurnoService.js";

export class MedicoService {
  constructor({
    medicoRepository = new MedicoRepository(),
    usuarioService = new UsuarioService(),
    servicioService = new ServicioService(),
    sedeService = new SedeService()
  } = {}) {
    this.medicoRepository = medicoRepository;
    this.usuarioService = usuarioService;
    this.servicioService = servicioService;
    this.sedeService = sedeService;
  }

  async crearMedicos(listaMedicos) {
    //funciona
    return listaMedicos.map((medicoData) => this.create(medicoData));
  }

  async create(medicoData) {
    //funciona
    logger.info(
      "[MEDICO SERVICE]: Obteniendo los datos necesarios para crear medico",
    );
    const usuario = await this.usuarioService.findEntityById(
      medicoData.usuarioId,
    );
    if (!usuario) throw new NotFoundError("Usuario no encontrado");
    const medicoExistente = await this.medicoRepository.findByIdUsuario(
      usuario.id,
    );
    if (medicoExistente)
      throw new ConflictError("Ya existe un médico con ese usuario");

    logger.info("[MEDICO SERVICE]: Creando medico: ", medicoData);
    const medicoEntityData = {
      usuario: usuario,
      matricula: medicoData.matricula,
      nombre: medicoData.nombre,
      honorario: medicoData.honorario,
    };
    const medico = new Medico(medicoEntityData);

    const nuevoMedico = await this.medicoRepository.save(medico);
    logger.info("[MEDICO SERVICE]: Médico creado: ", nuevoMedico);

    return MedicoMapper.toDTO(nuevoMedico);
  }

  /* TODO: VER SI FUNCIONA
  async create2(medicoData) {
      logger.info("Iniciando creación de médico con los datos: ", medicoData);
      const usuarioDTO = await this.usuarioService.findById(medicoData.idUsuario);

      if (!usuarioDTO) {
          logger.error("Usuario no encontrado para el ID: ", medicoData.idUsuario);
          throw new NotFoundError("Usuario no encontrado");
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

      const medicoEntityData = {
          nombre: medicoData.nombre,
          matricula: medicoData.matricula,
          idUsuario: medicoData.idUsuario,
      };
      const medico = new Medico(medicoEntityData); //TODO: VER SI FUNCIONA, PORQUE EL CONSTRUCTOR DE MEDICO NECESITA UNA INSTANCIA DE USUARIO, NO SU ID

      const nuevoMedico = await this.medicoRepository.save(medico);
      logger.info("Médico creado exitosamente: ", nuevoMedico);
      return MedicoMapper.toDTO(nuevoMedico);
  }*/

  async findById(idMedico) {
    logger.info("[MEDICO SERVICE]: Obteniendo medico con id: ", idMedico);
    const medico = await this.medicoRepository.findById(idMedico);
    if (!medico) throw new NotFoundError("Médico no encontrado");
    logger.info("[MEDICO SERVICE]: Medico obtenido: ", medico);

    return MedicoMapper.toDTO(medico);
  }

  async findAll() {
    logger.info("Consultando todos los médicos");
    return (await this.medicoRepository.findAll()).map(MedicoMapper.toDTO);
  }

  async findAllEntities() {
    logger.info("Consultando todos los médicos como entidades de dominio");

    const medicosDocs = await this.medicoRepository.findAll();

    return medicosDocs.map(medicoDoc => MedicoMapper.toDomain(medicoDoc));
  }

  async delete(id) {
    logger.info(`Eliminando médico con ID: ${id}`);
    const medicoEliminado = await this.medicoRepository.delete(id);

    if (!medicoEliminado) {
      throw new NotFoundError("Médico no encontrado");
    }

    logger.info(`Médico eliminado con ID: ${id}`);
    return MedicoMapper.toDTO(medicoEliminado);
  }

  async agregarSede(medicoId, sedeId) {
    logger.info(`Agregando sede ${sedeId} al médico ${medicoId}`);
    const medico = await this.medicoRepository.findById(medicoId);
    if (!medico) {
      throw new NotFoundError("Médico no encontrado");
    }

    const sede = await this.sedeService.findEntityById(sedeId);

    medico.agregarSede(sede);

    const medicoActualizado = await this.medicoRepository.save(medico);
    return MedicoMapper.toDTO(medicoActualizado);
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
    return MedicoMapper.toDTO(medicoActualizado);
  }

  async definirDisponibilidadPara(disponibilidadData, id) {
    logger.info(`Definiendo disponibilidad para el médico ${id}`);

    // Docs de mongoose
    const medico = await this.medicoRepository.findById(id);

    if (!medico) {
      logger.error(`Médico con ID ${id} no encontrado`);
      throw new NotFoundError("Médico no encontrado");
    }

    //Chequeo que el medico tenga la sede de la disponibilidad
    if (!medico.sedes.some((s) => s.id === disponibilidadData.sedeId)) {
      logger.error(
        `El médico no tiene asignada la sede con ID ${disponibilidadData.sedeId}`,
      );
      throw new ConflictError("El médico no tiene asignada esa sede");
    }

    const sede = await this.sedeService.findEntityById(
      disponibilidadData.sedeId,
    );
    if (!sede) {
      logger.error(`Sede con ID ${disponibilidadData.sedeId} no encontrada`);
      throw new NotFoundError("Sede no encontrada");
    }
    const servicio = await this.servicioService.getEntityById(
      disponibilidadData.servicioId,
    );
    if (!servicio) {
      logger.error(
        `Servicio con ID ${disponibilidadData.servicioId} no encontrado`,
      );
      throw new NotFoundError("Servicio no encontrado");
    }

    const disponibilidadEntityData = {
      diaSemana: disponibilidadData.diaSemana,
      horaDesde: disponibilidadData.horaDesde,
      horaHasta: disponibilidadData.horaHasta,
      servicio: servicio,
      sede: sede,
    };
    const disponibilidad = new DisponibilidadHoraria(disponibilidadEntityData);

    medico.definirDisponibilidad(disponibilidad);

    logger.info(
      `Disponibilidad definida para el médico ${id}: `,
      disponibilidad,
    );

    return MedicoMapper.toDTO(await this.medicoRepository.save(medico));
  }

  async modificarDisponibilidadPara(disponibilidadData, medicoId) {
    const medico = await this.medicoRepository.findById(medicoId);
    if (!medico) {
      throw new NotFoundError("Médico no encontrado");
    }

    const sede = await this.sedeService.findEntityById(
      disponibilidadData.sedeId,
    );

    const servicio = await this.servicioService.getEntityById(
      disponibilidadData.servicioId,
    );

    const disponibilidad = new DisponibilidadHoraria({
      diaSemana: disponibilidadData.diaSemana,
      horaDesde: disponibilidadData.horaDesde,
      horaHasta: disponibilidadData.horaHasta,
      sede,
      servicio
    });

    medico.modificarDisponibilidad(disponibilidad);
    /*Si un médico modifica su disponibilidad: 
○ Los turnos existentes con fecha previa a la actual no se modifican. 
○ Los turnos existentes RESERVADOS con fecha posterior a la actual, 
no se modifican. 
○ El cambio impacta únicamente en la generación de turnos futuros y 
para turnos existentes futuros pero en estado DISPONIBLE. */
    // TODO avisar al turno service que genere los turnos.
    //await this.turnoService.refrescarTurnosDisponiblesDelMedico(medico);

    return MedicoMapper.toDTO(await this.medicoRepository.save(medico));
  }

  async eliminarDisponibilidadPara(medicoId, diaSemana) {
    const medico = await this.medicoRepository.findById(medicoId);
    if (!medico) {
      throw new NotFoundError("Médico no encontrado");
    }

    medico.eliminarDisponibilidad(diaSemana);

    // TODO avisar al turno service que genere los turnos.
    //await this.turnoService.regenerarTurnosDisponiblesDelMedico(medico.id);

    return MedicoMapper.toDTO(await this.medicoRepository.save(medico));
  }

  async consultarDisponibilidad(medicoId) {
    const medico = await this.findById(medicoId);

    /* if (!medico.ofrecePractica(practicaId)) {
      throw new Error("El médico no ofrece esa práctica");
    } */

    return medico.disponibilidades;
  }

  async agregarServicioPara(idMedico, idServicio) {
    logger.info(
      "[MEDICO SERVICE]: Obteniendo datos necesarios para agendar un servicio para el medico ",
      idMedico,
    );
    const medico = await this.medicoRepository.findById(idMedico);
    const servicio = await this.servicioService.getEntityById(idServicio);
    if (!medico || !servicio) throw new NotFoundError("Datos no encontrados");

    logger.info("[MEDICO SERVICE]: Guardando servicio con id: ", idServicio);
    medico.agregarServicio(servicio);

    const guardado = await this.medicoRepository.save(medico);
    logger.info("[MEDICO SERVICE]: Servicio guardado: ", guardado);

    return MedicoMapper.toDTO(guardado);
  }

  async eliminarServicioPara(idMedico, idServicio) {
    logger.info(
      "[MEDICO SERVICE]: Obteniendo datos necesarios para eliminar un servicio para el medico ",
      idMedico,
    );
    const medico = await this.medicoRepository.findById(idMedico);
    const servicio = await this.servicioService.getEntityById(idServicio);
    if (!medico || !servicio) throw new NotFoundError("Datos no encontrados");

    logger.info("[MEDICO SERVICE]: Eliminando servicio con id: ", idServicio);
    medico.eliminarServicio(servicio);

    const guardadoGuardado = await this.medicoRepository.save(medico);
    logger.info("[MEDICO SERVICE]: Servicio eliminado con id: ", idServicio);

    return MedicoMapper.toDTO(guardadoGuardado);
  }
}
