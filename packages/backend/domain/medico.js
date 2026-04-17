import { randomUUID } from "crypto";
import { Usuario } from "../domain/usuario"
import { ErrorDatosObligatorios } from "./errores";

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
            throw new ErrorDatosObligatorios();
        }
        if(!(usuario instanceof Usuario)) {
            throw new Error("No es un Usuario")
        }
        if(matricula > 10){
            throw new ErrorMatriculaCorta("Matricula Demasiado larga")
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