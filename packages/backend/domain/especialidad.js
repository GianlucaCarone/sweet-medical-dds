import { randomUUID } from "crypto";

export class Especialidad {
    id;
    nombre;
    duracionTurnoEnMins;
    costoConsulta;

    constructor({ nombre, duracionTurnoEnMins, costoConsulta }) {
        if (!nombre || !duracionTurnoEnMins || !costoConsulta) {
            throw new Error("Faltan datos obligatorios");
        }
        this.id = randomUUID();
        this.nombre = nombre;
        this.duracionTurnoEnMins = duracionTurnoEnMins;
        this.costoConsulta = costoConsulta;
    }
}