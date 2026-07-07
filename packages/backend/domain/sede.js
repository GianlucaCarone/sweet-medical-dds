import { ErrorDatosObligatorios } from "./errores.js";

export class Sede {
    id;
    nombre;
    direccion;

    constructor({ nombre, direccion }) {
        if (!nombre || !direccion) {
            throw new ErrorDatosObligatorios("Datos obligatorios de la sede incompletos");
        }
        this.nombre = nombre;
        this.direccion = direccion ;
    }
}   