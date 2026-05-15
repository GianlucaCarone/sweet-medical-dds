import { MedicoRepository } from "../repositories/MedicoRepository.js";
import { ServiciosService } from "./serviciosService.js";
import { logger } from '../config/logger.js'; 

export class MedicoService {
  constructor({ 
        medicoRepository = new MedicoRepository(),
        serviciosService = new ServiciosService() 
    } = {}) {
    this.medicoRepository = medicoRepository;
    this.serviciosService = serviciosService;
  }

  async crearMedicos(listaMedicos) {} //TODO

  async getById(idMedico) {
    logger.info("[MEDICO SERVICE]: Obteniendo medico con id: ", idMedico);
    const medico = await this.medicoRepository.findById(idMedico);
    logger.info("[MEDICO SERVICE]: Medico obtenido: ", medico);

    if (!medico) {
      throw new NotFoundError("Médico no encontrado");
    }

    return medico;
  }


  async agregarServicioPara(idMedico, idServicio) {
    logger.info("[MEDICO SERVICE]: Obteniendo datos necesarios para agendar un servicio para el medico ", idMedico)
    const medico = await this.getById(idMedico);
    const servicio = await this.serviciosService.getById(idServicio);

    logger.info("[MEDICO SERVICE]: Guardando servicio con id: ", idServicio);
    medico.agregarServicio(servicio);
    
    const guardado = await this.medicoRepository.save(medico);
    logger.info("[MEDICO SERVICE]: Servicio guardado: ", guardado);

    return(guardado);
  }


  async eliminarServicioPara(idMedico, idServicio) {
    logger.info("[MEDICO SERVICE]: Obteniendo datos necesarios para eliminar un servicio para el medico ", idMedico)
    const medico = await this.getById(idMedico);
    const servicio = await this.serviciosService.getById(idServicio);

    logger.info("[MEDICO SERVICE]: Eliminando servicio con id: ", idServicio);
    medico.eliminarServicio(servicio);

    const guardado = await this.medicoRepository.save(medico);
    logger.info("[MEDICO SERVICE]: Servicio eliminado con id: ", idServicio);

    return guardado;
  }
}