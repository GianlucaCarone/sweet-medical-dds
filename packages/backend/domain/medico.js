import { Usuario } from "../domain/usuario"
import { ErrorDatosObligatorios } from "./errores";
import { DisponibilidadHoraria } from "./disponibilidadHoraria";

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
        if (!(usuario instanceof Usuario)) {
            throw new Error("No es un Usuario")
        }
        if (matricula.length > 10) {
            throw new Error("Matricula Demasiado larga")
        }
        this.usuario = usuario;
        this.matricula = matricula;
        this.nombre = nombre;
    }

    definirDisponibilidad(disponibilidad) {
        if (!(disponibilidad instanceof DisponibilidadHoraria)) {
            throw new Error("No es una DisponibilidadHoraria valida");
        }
        this.disponibilidades.push(disponibilidad);
    }
}