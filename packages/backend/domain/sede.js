import { randomUUID } from "crypto";
import { BadRequestError } from "../errors/AppError.js";
export class Sede {
    id;
    nombre;
    direccion;

    constructor({ nombre, direccion }) {
        if (!nombre || !direccion) {
            throw new BadRequestError("Datos obligatorios de la sede incompletos");
        }
        this.id = randomUUID();
        this.nombre = nombre;
        this.direccion = direccion;
    }
}   