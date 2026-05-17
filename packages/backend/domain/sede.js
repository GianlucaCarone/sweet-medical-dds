import { randomUUID } from "crypto";
import { ErrorDatosObligatorios } from "./errores.js";

export class Sede {
    id;
    nombre;
    direccion;

    constructor({ nombre, direccion }) {
        if (!nombre || !direccion) {
            throw new ErrorDatosObligatorios("Datos obligatorios de la sede incompletos");
        }
        this.id = randomUUID();
        this.nombre = nombre;
        this.direccion = direccion;
    }
}   