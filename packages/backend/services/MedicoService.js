import { MedicoRepository } from "../repositories/MedicoRepository.js";
import { ServiciosService } from "./serviciosService.js";
import { UsuarioService } from "./UsuarioService.js";
import { NotFoundError, ConflictError} from "../errors/AppError.js";
import { MedicoMapper } from "../mappers/medicoMapper.js";
import { Medico } from "../domain/medico.js";
import { logger } from '../config/logger.js'; 

export class MedicoService {
  constructor({ 
        medicoRepository = new MedicoRepository(),
        serviciosService = new ServiciosService() ,
        usuarioService = new UsuarioService()
    } = {}) {
    this.medicoRepository = medicoRepository;
    this.serviciosService = serviciosService;
    this.usuarioService = usuarioService;
  }

  async crearMedicos(listaMedicos) { //funciona
    return listaMedicos.map((medicoData) => this.create(medicoData));
  }

  async create(medicoData) { //funciona
    logger.info("[MEDICO SERVICE]: Obteniendo los datos necesarios para crear medico");
    const usuario = await this.usuarioService.findEntityById(medicoData.usuarioId);
    if (!usuario) throw new NotFoundError("Usuario no encontrado");
    const medicoExistente = await this.medicoRepository.findByIdUsuario(usuario.id);
    if (medicoExistente) throw new ConflictError("Ya existe un médico con ese usuario");

    logger.info("[MEDICO SERVICE]: Creando medico: ", medicoData);
    const medicoEntityData = {
      usuario: usuario,
      matricula: medicoData.matricula, 
      nombre: medicoData.nombre
    };
    const medico = new Medico(medicoEntityData);

    const nuevoMedico = await this.medicoRepository.save(medico);
    logger.info("[MEDICO SERVICE]: Médico creado: ", nuevoMedico);

    return MedicoMapper.toDto(nuevoMedico);
  }

  async getById(idMedico) { //TODO: VER QUE FUNCIONE
    logger.info("[MEDICO SERVICE]: Obteniendo medico con id: ", idMedico);
    const medico = await this.medicoRepository.findById(idMedico);
    if (!medico) throw new NotFoundError("Médico no encontrado");
    logger.info("[MEDICO SERVICE]: Medico obtenido: ", medico);

    return MedicoMapper.toDTOmedico;
  }


  async agregarServicioPara(idMedico, idServicio) { //TODO: VER QUE FUNCIONE
    logger.info("[MEDICO SERVICE]: Obteniendo datos necesarios para agendar un servicio para el medico ", idMedico)
    const medico = await this.medicoRepository.findById(idMedico);
    const servicio = await this.serviciosService.getById(idServicio);
    if(!medico || !servicio) throw new NotFoundError("Datos no encontrados");

    logger.info("[MEDICO SERVICE]: Guardando servicio con id: ", idServicio);
    medico.agregarServicio(servicio);
    
    const guardado = await this.medicoRepository.save(medico);
    logger.info("[MEDICO SERVICE]: Servicio guardado: ", guardado);

    return MedicoMapper.toDTO(guardado);
  }


  async eliminarServicioPara(idMedico, idServicio) { //TODO: VER QUE FUNCIONE
    logger.info("[MEDICO SERVICE]: Obteniendo datos necesarios para eliminar un servicio para el medico ", idMedico)
    const medico = await this.medicoRepository.findById(idMedico);
    const servicio = await this.serviciosService.getById(idServicio);
    if(!medico || !servicio) throw new NotFoundError("Datos no encontrados");

    logger.info("[MEDICO SERVICE]: Eliminando servicio con id: ", idServicio);
    medico.eliminarServicio(servicio);

    const guardadoGuardado = await this.medicoRepository.save(medico);
    logger.info("[MEDICO SERVICE]: Servicio eliminado con id: ", idServicio);

    return MedicoMapper.toDTO(guardadoGuardado);
  }
}