import { randomUUID } from "crypto";

export class Medico {
    id;
    usuario;
    matricula;
    nombre;
    especialidades = [];
    practicas = [];
    sedes = [];
    disponibilidades = [];

    constructor({ usuario, matricula, nombre }) {
        if (!usuario || !matricula || !nombre) {
            throw new Error("Faltan datos obligatorios");
        }
        this.id = randomUUID();
        this.usuario = usuario;
        this.matricula = matricula;
        this.nombre = nombre;
    }

    definirDisponibilidad(disponibilidad) {
        this.disponibilidades.push(disponibilidad);
    }
}