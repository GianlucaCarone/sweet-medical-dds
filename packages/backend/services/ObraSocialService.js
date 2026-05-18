import { ObraSocial } from "../domain/obraSocial.js";
import { Plan } from "../domain/plan.js";
import { CoberturaEspecialidad } from "../domain/coberturas/coberturaEspecialidad.js";
import { CoberturaPractica } from "../domain/coberturas/coberturaPractica.js";
import { Especialidad } from "../domain/servicios/especialidad.js";
import { Practica } from "../domain/servicios/practica.js";
import { ObraSocialRepository } from "../repositories/ObraSocialRepository.js";
import { BadRequestError } from "../errors/AppError.js";
import { ServicioService } from "./ServicioService.js";

export class ObraSocialService {
    #obraSocialRepository;
    #servicioService;
    constructor(obraSocialRepository = new ObraSocialRepository(), servicioService = new ServicioService()) {
        this.#obraSocialRepository = obraSocialRepository;
        this.#servicioService = servicioService
    }

    toEspecialidadDomain(especialidadData) {
        const { nombre, duracionTurnoEnMins, costoConsulta } = especialidadData;
        const especialidad = new Especialidad({ nombre, duracionTurnoEnMins, costoConsulta });
        especialidad.id = especialidadData.id ?? especialidadData._id ?? especialidad.id;
        
        return especialidad;
    }

    toPracticaDomain(practicaData) {
        // const especialidadPadre = this.toEspecialidadDomain(practicaData.especialidadPadre);
        const especialidadPadre = practicaData.especialidadPadre;
        const { codigo, nombre, duracionTurnoEnMins, costo } = practicaData;
        const practica = new Practica({ codigo, nombre, duracionTurnoEnMins, costo, especialidadPadre });
        practica.id = practicaData.id ?? practicaData._id ?? practica.id;

        return practica;
    }

    toCoberturaEspecialidadDomain(coberturaData) {
        // const especialidad = this.toEspecialidadDomain(coberturaData.especialidad);
        const especialidadId = typeof coberturaData.especialidad === 'object'
            ? coberturaData.especialidad._id?.toString() ?? coberturaData.especialidad.id
            : coberturaData.especialidad;

        return new CoberturaEspecialidad({
            especialidad: especialidadId,
            nivel: coberturaData.nivel,
            porcentajeCobertura: coberturaData.porcentajeCobertura,
        });
    }

    toCoberturaPracticaDomain(coberturaData) {
        // const practica = this.toPracticaDomain(coberturaData);
        const practicaId = typeof coberturaData.practica === 'object'
            ? coberturaData.practica._id?.toString() ?? coberturaData.practica.id
            : coberturaData.practica;
        
        return new CoberturaPractica({
            practica: practicaId,
            nivel: coberturaData.nivel,
            porcentajeCobertura: coberturaData.porcentajeCobertura,
        });
    }

    toPlanDomain(planData) {
        const { nombre } = planData;
        const plan = new Plan({ nombre });
        plan.id = planData.id ?? planData._id ?? plan.id;
        plan.eliminado = planData.eliminado ?? false;
        plan.coberturasEspecialidad = (planData.coberturaEspecialidad ?? planData.coberturasEspecialidad ?? [])
            .map(cobertura => this.toCoberturaEspecialidadDomain(cobertura))
            .filter(Boolean);
        plan.coberturasPractica = (planData.coberturaPractica ?? planData.coberturasPractica ?? [])
            .map(cobertura => this.toCoberturaPracticaDomain(cobertura))
            .filter(Boolean);
        // plan.coberturasEspecialidad = planData.coberturaEspecialidad ?? planData.coberturasEspecialidad ?? [];
        // plan.coberturasPractica = planData.coberturaPractica ?? planData.coberturasPractica ?? [];
 
        return plan;
    }

    toObraSocialDomain(obraSocialData) {
        const { nombre } = obraSocialData;
        const obraSocial = new ObraSocial({ nombre });
        obraSocial.id = obraSocialData.id ?? obraSocialData._id ?? obraSocial.id;
        obraSocial.eliminado = obraSocialData.eliminado ?? false;
        obraSocial.planes = (obraSocialData.planes ?? [])
            .map(planData => this.toPlanDomain(planData))
            .filter(Boolean);

        return obraSocial;
    }

    async buscarTodos() {
        const obrasSociales = await this.#obraSocialRepository.findAll();
        return Promise.all(obrasSociales.map(obraSocial => this.toObraSocialDomain(obraSocial)));
    }
    async crear(data) {
        const obraSocial = this.toObraSocialDomain(data)
        const nuevaObraSocial = await this.#obraSocialRepository.crear(obraSocial);
        return nuevaObraSocial;
    }
    async buscar(obraSocialId) {
        const obraSocial = await this.#obraSocialRepository.findById(obraSocialId);
        if (!obraSocial) {
            throw new BadRequestError("No se encontro la obra social con el id " + obraSocialId);
        }
        return this.toObraSocialDomain(obraSocial);
    }
    async actualizar(obraSocialId, obraSocialDto = {}) {
        const obraSocialActualizada = await this.#obraSocialRepository.update(obraSocialId, obraSocialDto);
        if (!obraSocialActualizada) {
            throw new BadRequestError("No se encontro la obra social con el id " + obraSocialId);
        }
        return this.toObraSocialDomain(obraSocialActualizada);
    }
    async eliminar(obraSocialId) {
        const obraSocialEliminada = await this.#obraSocialRepository.delete(obraSocialId);
        if (!obraSocialEliminada) {
            throw new BadRequestError(`No se encontró una obra social con el ID: ${obraSocialId}`)
        }
        return this.toObraSocialDomain(obraSocialEliminada);
    }

    async crearPlan(obraSocialId, planDto = {}) {

        const especialidades = planDto.coberturaEspecialidad.map( (especialidad) => especialidad.especialidad );
        const practicas = planDto.coberturaPractica.map( (practica) => practica.practica );
        const servicios = [...especialidades, ...practicas];

        for (const ser of servicios) {
            const existeServicio = await this.#servicioService.getById(ser);
            if (!existeServicio) throw new BadRequestError("Especialidad o Servicio no existe");
        }

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
            planes.map(async (plan) => this.toPlanDomain(plan) )
        );
        return planesDomino
    }
}