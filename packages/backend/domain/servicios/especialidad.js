import { ErrorDatosObligatorios } from "../errores.js";

export class Especialidad {
    id;
    nombre;
    duracionTurnoEnMins;
    costo;

    constructor({ nombre, duracionTurnoEnMins, costo }) {
        if (!nombre || !duracionTurnoEnMins || !costo) {
            throw new ErrorDatosObligatorios();
        }
        //this.id = randomUUID();
        this.nombre = nombre;
        this.duracionTurnoEnMins = duracionTurnoEnMins;
        this.costo = costo;
    }

    getCosto() {
        return this.costo;
    }

    getCodigo() {
        return null;
    }

    getEspecialidadPadre() {
        return null;
    }
}