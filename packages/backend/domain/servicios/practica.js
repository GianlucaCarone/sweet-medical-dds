import { ErrorDatosObligatorios } from "../errores.js";
import { Especialidad } from "./especialidad.js";

export class Practica {
    id;
    codigo;
    nombre;
    duracionTurnoEnMins;
    costo;
    especialidadPadre;

    constructor({ codigo, nombre, duracionTurnoEnMins, costo, especialidadPadre }) {
        if (!codigo || !nombre || !duracionTurnoEnMins || !costo || !especialidadPadre) {
            throw new ErrorDatosObligatorios();
        }
        if (!(especialidadPadre instanceof Especialidad)) {
            throw new Error("La especialidad padre no es una especialidad")
        }
        //this.id = randomUUID();
        this.codigo = codigo;
        this.nombre = nombre;
        this.duracionTurnoEnMins = duracionTurnoEnMins;
        this.costo = costo;
        this.especialidadPadre = especialidadPadre;
    }

    getCosto() {
        return this.costo;
    }

    getCodigo() {
        return this.codigo;
    }

    getEspecialidadPadre() {
        return this.especialidadPadre;
    }
}