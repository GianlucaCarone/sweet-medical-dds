// import { randomUUID } from "crypto";
import { Plan } from "./plan.js";
import { ErrorDatosObligatorios } from "../domain/errores.js";

export class ObraSocial {
  id;
  nombre;
  planes = [];

  constructor({ nombre }) {
    if (!nombre) {
      throw new ErrorDatosObligatorios("Faltan datos obligatorios");
    }
    // this.id = randomUUID();
    this.nombre = nombre;
  }

  obtenerPlanPorId(planId) {
    if (!planId) {
      throw new Error("Id invalido");
    }
    const plan = this.planes.find((plan) => plan._id.toString() === planId);

    return plan ?? null;
  }

  agregarPlan(plan) {
    if (!(plan instanceof Plan)) {
      throw new Error("Plan inválido");
    }
    this.planes.push(plan);
  }

  eliminarPlan(planAEliminar) {
    if (!planAEliminar) {
      throw new Error("Plan invalido");
    }
    this.planes = this.planes.filter((plan) => plan._id.toString() !== planAEliminar._id.toString());
  }
}
