import { Practica } from "../servicios/practica.js";
import { NivelCobertura } from "../coberturas/nivelCoberturaEnum.js";
import { ErrorDatosObligatorios } from "../errores.js";


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