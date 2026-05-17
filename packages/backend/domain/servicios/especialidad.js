import { ErrorDatosObligatorios } from "../errores.js";

export class Especialidad {
    id;
    nombre;
    duracionTurnoEnMins;
    costoConsulta;

    constructor({ nombre, duracionTurnoEnMins, costoConsulta }) {
        if (!nombre || !duracionTurnoEnMins || !costoConsulta) {
            throw new ErrorDatosObligatorios();
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