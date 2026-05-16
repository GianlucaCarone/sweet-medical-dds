import { BadRequestError } from "../../errors/AppError.js";
import { randomUUID } from "crypto";
import { ErrorDatosObligatorios } from "../errores.js";

export class Practica {
    id;
    codigo;
    nombre;
    duracionTurnoEnMins;
    costo;

    constructor({ codigo, nombre, duracionTurnoEnMins, costo }) {
        if (!codigo || !nombre || !duracionTurnoEnMins || !costo) {
            throw new BadRequestError();
        }
        //this.id = randomUUID();
        this.codigo = codigo;
        this.nombre = nombre;
        this.duracionTurnoEnMins = duracionTurnoEnMins;
        this.costo = costo;
    }

    getCosto() {
        return this.costo;
    }

    getCodigo() {
        return this.codigo;
    }
}