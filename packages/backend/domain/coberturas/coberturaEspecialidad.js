import { Especialidad } from "../especialidad";
import { NivelCobertura } from "../nivelCobertura";
import { ErrorDatosObligatorios } from "../errors/errorDatosObligatorios";

export class CoberturaEspecialidad {
    especialidad;
    nivel;
    porcentajeCobertura;

    constructor({ especialidad, nivel, porcentajeCobertura }) {
        if (!especialidad || !nivel || !porcentajeCobertura) {
            throw new ErrorDatosObligatorios();
        }
        if (!(especialidad instanceof Especialidad)) {
            throw new Error("Especialidad inválida");
        }
        if (!Object.values(NivelCobertura).includes(nivel)) {
            throw new Error("Nivel de cobertura inválido");
        }
        this.especialidad = especialidad;
        this.nivel = nivel;
        this.porcentajeCobertura = porcentajeCobertura;
    }
}