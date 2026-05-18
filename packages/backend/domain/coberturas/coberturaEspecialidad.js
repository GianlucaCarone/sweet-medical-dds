import { Especialidad } from "../servicios/especialidad.js";
import { NivelCobertura } from "../coberturas/nivelCoberturaEnum.js";
import { ErrorDatosObligatorios } from "../errores.js";

export class CoberturaEspecialidad {
    especialidad;
    nivel;
    porcentajeCobertura;

    constructor({ especialidad, nivel, porcentajeCobertura }) {
        if (!especialidad || !nivel || !porcentajeCobertura) {
            throw new ErrorDatosObligatorios();
        }
        if (!(especialidad instanceof Especialidad) && typeof especialidad !== "string") {
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