import { randomUUID } from "crypto";
import { ErrorDatosObligatorios } from "../errores";

export class Practica {
    id;
    codigo;
    nombre;
    duracionTurnoEnMins;
    costo;

    constructor({ codigo, nombre, duracionTurnoEnMins, costo }) {
        if (!codigo || !nombre || !duracionTurnoEnMins || !costo) {
            throw new ErrorDatosObligatorios();
        }
        this.id = randomUUID();
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