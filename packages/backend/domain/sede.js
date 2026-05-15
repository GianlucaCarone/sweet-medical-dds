import { randomUUID } from "crypto";
import { ErrorDatosObligatorios } from "./errores";

export class Sede {
    id;
    nombre;
    direccion;

    constructor({ nombre, direccion }) {
        if (!nombre || !direccion) {
            throw new ErrorDatosObligatorios();
        }
        this.id = randomUUID();
        this.nombre = nombre;
        this.direccion = direccion;
    }
}