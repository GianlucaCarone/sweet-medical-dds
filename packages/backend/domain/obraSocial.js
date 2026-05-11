import { randomUUID } from "crypto";
import { Plan } from "./plan";

export class ObraSocial {
    id;
    nombre;
    planes = [];

    constructor({ nombre, planes = [] }) {
        if (!nombre) {
            throw new ErrorDatosObligatorios("Faltan datos obligatorios");
        }
        if (!Array.isArray(planes) || !planes.every(p => p instanceof Plan)) {
            throw new Error("Planes inválidos");
        }
        this.id = randomUUID();
        this.nombre = nombre;
        this.planes = planes;
    }

    obtenerPlanPorId(planId) {
        if (!planId) {
            throw new Error("Id invalido");
        }
        const plan = this.planes.find(plan => plan.id === planId);
        if (!plan) {
            throw new Error("No se encontro el plan con el id " + planId)
        }
        return plan;
    }

    agregarPlan(plan) {
        if (!(plan instanceof Plan)) {
            throw new Error("Plan inválido");
        }
        this.planes.push(plan);
    }

    eliminarPlan(planAEliminar) {
        if (!planAEliminar) { throw new Error("Plan invalido"); }
        this.planes = this.planes.filter(plan => plan.id !== planAEliminar.id);
    }
}