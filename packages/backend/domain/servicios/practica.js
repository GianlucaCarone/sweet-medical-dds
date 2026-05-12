import { randomUUID } from "crypto";

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

    get costo() {
        return this.costo;
    }

    get codigo() {
        return this.codigo;
    }
}