import { Especialidad } from "../especialidad";
import { NivelCobertura } from "../nivelCobertura";

export class CoberturaEspecialidad {
    especialidad;
    nivel;

    constructor({ especialidad, nivel }) {
        if (!especialidad || !nivel) {
            throw new Error("Faltan datos obligatorios");
        }
        if (!(especialidad instanceof Especialidad)) {
            throw new Error("Especialidad inválida");
        }
        if (!Object.values(NivelCobertura).includes(nivel)) {
            throw new Error("Nivel de cobertura inválido");
        }
        this.especialidad = especialidad;
        this.nivel = nivel;
    }
}