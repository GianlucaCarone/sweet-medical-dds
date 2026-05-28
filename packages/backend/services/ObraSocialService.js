import { ObraSocialRepository } from "../repositories/ObraSocialRepository.js";
import { BadRequestError } from "../errors/AppError.js";
import { ObraSocial } from "../domain/obraSocial.js";


export class ObraSocialService {
    #obraSocialRepository;
    constructor(obraSocialRepository = new ObraSocialRepository()) {
        this.#obraSocialRepository = obraSocialRepository;
    }

    toDto(obraSocial) {
        return {
            id: obraSocial.id || obraSocial._id,
            nombre: obraSocial.nombre,
            planes: obraSocial.planes ? obraSocial.planes.map((plan) => this.toDtoPlan(plan)) : []
        }
    };

    toDtoPlan(plan) {
        return {
            id: plan.id || plan._id,
            nombre: plan.nombre,
            coberturaEspecialidad: plan.coberturaEspecialidad.map((cobertura) => ({
                id: cobertura.id || cobertura._id,
                especialidad: cobertura.especialidad
            })),
            coberturaPractica: plan.coberturaPractica.map((cobertura) => ({
                id: cobertura.id || cobertura._id,
                practica: cobertura.practica
            }))
        }
    };


    async buscarTodos() {
        const obrasSociales = await this.#obraSocialRepository.findAll();
        if (obrasSociales.length === 0) {
            throw new BadRequestError("No se encontraron obras sociales");
        }
        return obrasSociales.map(obraSocial => this.toDto(obraSocial));
    }

    async crear(data) {
        const obraSocial = new ObraSocial(data);
        const nuevaObraSocial = await this.#obraSocialRepository.crear(obraSocial);
        return nuevaObraSocial;
    }

    async buscar(obraSocialId) {
        const obraSocial = await this.#obraSocialRepository.findById(obraSocialId);
        if (!obraSocial) {
            throw new BadRequestError("No se encontro la obra social con el id " + obraSocialId);
        }
        return this.toDto(obraSocial);
    }

    async actualizar(obraSocialId, obraSocialDto = {}) {
        const obraSocialActualizada = await this.#obraSocialRepository.update(obraSocialId, obraSocialDto);
        if (!obraSocialActualizada) {
            throw new BadRequestError("No se encontro la obra social con el id " + obraSocialId);
        }
        return this.toDto(obraSocialActualizada);
    }

    async eliminar(obraSocialId) {
        const obraSocialEliminada = await this.#obraSocialRepository.delete(obraSocialId);
        if (!obraSocialEliminada) {
            throw new BadRequestError(`No se encontró una obra social con el ID: ${obraSocialId}`)
        }
        return this.toDto(obraSocialEliminada);
    }

    async crearPlan(obraSocialId, planDto = {}) {

        const especialidades = planDto.coberturaEspecialidad.map((especialidad) => especialidad.especialidad);
        const practicas = planDto.coberturaPractica.map((practica) => practica.practica);
        const servicios = [...especialidades, ...practicas];

        /*for (const ser of servicios) {
            const existeServicio = await this.#servicioService.getById(ser);
            if (!existeServicio) throw new BadRequestError("Especialidad o Servicio no existe");
        }*/

        const obraSocialConPlanCreado = await this.#obraSocialRepository.addPlan(obraSocialId, planDto);
        return this.toObraSocialDomain(obraSocialConPlanCreado);
    }

    async actualizarPlanDeObraSocial(obraSocialId, planId, planDto = {}) {
        const obraSocialConPlanActualizado = await this.#obraSocialRepository.updatePlan(obraSocialId, planId, planDto);
        if (!obraSocialConPlanActualizado) {
            throw new BadRequestError(`No se encontró una obra social con el ID: ${obraSocialId}`)
        }
        return this.toObraSocialDomain(obraSocialConPlanActualizado);
    }

    async eliminarPlanDeObraSocial(obraSocialId, planId) {
        const obraSocialConPlanEliminado = await this.#obraSocialRepository.deletePlan(obraSocialId, planId);
        if (!obraSocialConPlanEliminado) {
            throw new BadRequestError(`No se encontró una obra social con el ID: ${obraSocialId}`)
        }
        return this.toObraSocialDomain(obraSocialConPlanEliminado);
    }

    async buscarPlanDeObraSocial(obraSocialId, planId) {
        const plan = await this.#obraSocialRepository.findPlanByIdPopulado(obraSocialId, planId);
        if (!plan) {
            throw new BadRequestError(`No se encontró un plan con ID ${planId} en la obra social ${obraSocialId}`);
        }
        return this.toPlanDomain(plan);
    }

    async buscarTodosLosPlanesDeObraSocial(obraSocialId) {
        const planes = await this.#obraSocialRepository.findAllPlans(obraSocialId);
        if (!planes) {
            throw new BadRequestError(`No se encontró una obra social con el ID: ${obraSocialId}`)
        }
        const planesDomino = await Promise.all(
            planes.map(async (plan) => this.toPlanDomain(plan))
        );
        return planesDomino
    }
}