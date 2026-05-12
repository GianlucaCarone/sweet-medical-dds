import { Practica } from "../practica";
import { NivelCobertura } from "../nivelCobertura";
import { ErrorDatosObligatorios } from "../errors/errorDatosObligatorios";

export class CoberturaPractica {
    practica;
    nivel;
    porcentajeCobertura;

    constructor({ practica, nivel, porcentajeCobertura }) {
        if (!practica || !nivel || !porcentajeCobertura) {
            throw new ErrorDatosObligatorios();
        }
        if (!(practica instanceof Practica)) {
            throw new Error("Practica inválida");
        }
        if (!Object.values(NivelCobertura).includes(nivel)) { //Como NivelCobertura es un objeto plano inmutable, para chequearlo usamos Object.values
            throw new Error("Nivel de cobertura inválido");
        }
        this.practica = practica;
        this.nivel = nivel;
        this.porcentajeCobertura = porcentajeCobertura;
    }
}