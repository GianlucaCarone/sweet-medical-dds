import { ObraSocialRepository } from "../repositories/ObraSocialRepository";

export class ObraSocialService {
    #obraSocialRepository;
    constructor(obraSocialRepository = new ObraSocialRepository()) {
        this.#obraSocialRepository = obraSocialRepository 
    }

    buscarTodos() {
        return this.#obraSocialRepository.findAll();
    }
    crear(obraSocialDto = {}) {
        const nuevaObraSocial = this.#obraSocialRepository.crear(obraSocialDto);
        return nuevaObraSocial;
    }
    buscar(obraSocialId) {
        this.#obraSocialRepository.findById(obraSocialId);
    }
    actualizar(obraSocialId, obraSocialDto = {}) {
        this.#obraSocialRepository.update(obraSocialId, obraSocialDto);
    }
    eliminar(obraSocialId) {
        this.#obraSocialRepository.delete(obraSocialId);
    }
    
    crearPlan(obraSocialId, planDto = {}) {
        this.#obraSocialRepository.addPlan(planDto);
    }
    actualizarPlanDeObraSocial(obraSocialId, planId, planDto = {}) {
        this.#obraSocialRepository.updatePlan(planDto);
    }
    eliminarPlanDeObraSocial(obraSocialId, planId) {
        this.#obraSocialRepository.deletePlan(obraSocialId, planId);
    }
    buscarPlanDeObraSocial(obraSocialId, nombrePlan) {
        this.#obraSocialRepository.findPlan(obraSocialId, nombrePlan)
    }
    buscarTodosLosPlanesDeObraSocial(obraSocialId) {
        this.#obraSocialRepository.findAllPlans(obraSocialId);

    }
}