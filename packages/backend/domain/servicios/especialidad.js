import { BadRequestError } from "../../errors/AppError.js";
export class Especialidad {
    id;
    nombre;
    duracionTurnoEnMins;
    costoConsulta;

    constructor({ nombre, duracionTurnoEnMins, costoConsulta }) {
        if (!nombre || !duracionTurnoEnMins || !costoConsulta) {
            throw new BadRequestError();
        }
        this.nombre = nombre;
        this.duracionTurnoEnMins = duracionTurnoEnMins;
        this.costoConsulta = costoConsulta;
    }

    get costo() {
        return this.costoConsulta;
    }
}