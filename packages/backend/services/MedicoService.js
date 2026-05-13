import { MedicoRepository } from "../repositories/MedicoRepository.js";
import { ServiciosService } from "./serviciosService.js";

export class MedicoService {
  constructor({ 
        medicoRepository = new MedicoRepository(),
        serviciosService = new ServiciosService() 
    } = {}) {
    this.medicoRepository = medicoRepository;
    this.serviciosService = serviciosService;
  }

  getById(id) {
    const medico = this.medicoRepository.findById(id);

    if (!medico) {
      throw new Error("Médico no encontrado");
    }

    return medico;
  }

  agregarServicioPara(idMedico, idServicio) {
    const medico = this.getById(idMedico);
    const servicio = this.serviciosService.getById(idServicio);

    medico.agregarServicio(servicio);

    return this.medicoRepository.save(medico);
  }

  eliminarServicioPara(idMedico, idServicio) {
    const medico = this.getById(idMedico);
    const servicio = this.serviciosService.getById(idServicio);

    medico.eliminarDisponibilidad(servicio);

    return this.medicoRepository.save(medico);
  }
}