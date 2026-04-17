import { Practica } from "../practica";
import { NivelCobertura } from "../nivelCobertura";

export class CoberturaPractica {
    practica;
    nivel;

    constructor({ practica, nivel }) {
        if (!practica || !nivel) {
            throw new Error("Faltan datos obligatorios");
        }
        if (!(practica instanceof Practica)) {
            throw new Error("Practica inválida");
        }
        if (!Object.values(NivelCobertura).includes(nivel)) { //Como NivelCobertura es un objeto plano inmutable, para chequearlo usamos Object.values
            throw new Error("Nivel de cobertura inválido");
        }
        this.practica = practica;
        this.nivel = nivel;
    }
}