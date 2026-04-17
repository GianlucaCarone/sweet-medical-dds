import { randomUUID } from "crypto";

export class Paciente {
    id;
    usuario;
    dni;
    nombre;
    obraSocial;
    plan;

    constructor({ usuario, dni, nombre, obraSocial, plan }) {
        if (!usuario || !dni || !nombre || !obraSocial || !plan) {
            throw new Error("Faltan datos obligatorios");
        }
        if (!(obraSocial instanceof ObraSocial)) {
            throw new Error("Obra social inválida");
        }
        if (!(plan instanceof Plan)) {
            throw new Error("Plan inválido");
        }
        this.id = randomUUID();
        this.usuario = usuario;
        this.dni = dni;
        this.nombre = nombre;
        this.obraSocial = obraSocial;
        this.plan = plan;
    }
}