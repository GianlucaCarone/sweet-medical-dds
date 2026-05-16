import { BadRequestError } from "../../errors/AppError.js";import { randomUUID } from "crypto";
import { ErrorDatosObligatorios } from "../errores.js";

export class Especialidad {
    id;
    nombre;
    duracionTurnoEnMins;
    costoConsulta;

    constructor({ nombre, duracionTurnoEnMins, costoConsulta }) {
        if (!nombre || !duracionTurnoEnMins || !costoConsulta) {
            throw new BadRequestError();
        }
        //this.id = randomUUID();
        this.nombre = nombre;
        this.duracionTurnoEnMins = duracionTurnoEnMins;
        this.costoConsulta = costoConsulta;
    }

    getCosto() {
        return this.costoConsulta;
    }
    
    getCodigo() {
        return null;
    }
}