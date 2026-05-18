import { ObraSocial } from "../domain/obraSocial.js";
import { ObraSocialRepository } from "../repositories/ObraSocialRepository.js";

export class ObraSocialService {
    #obraSocialRepository;
    constructor(obraSocialRepository = new ObraSocialRepository()) {
        this.#obraSocialRepository = obraSocialRepository;
    }

    buscarTodos() {
        return this.#obraSocialRepository.findAll();
    }
    crear(data) {
        const { nombre } = data;
        const obraSocial = new ObraSocial({ nombre });
        const nuevaObraSocial = this.#obraSocialRepository.crear(obraSocial);
        return nuevaObraSocial;
    }
    buscar(obraSocialId) {
        return this.#obraSocialRepository.findById(obraSocialId);
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
        this.#obraSocialRepository.findPlan(obraSocialId, nombrePlan);
    }
    buscarTodosLosPlanesDeObraSocial(obraSocialId) {
        this.#obraSocialRepository.findAllPlans(obraSocialId);

    }
}