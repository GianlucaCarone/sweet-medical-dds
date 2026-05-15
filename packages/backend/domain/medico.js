import { Usuario } from "../domain/usuario.js";
import { ErrorDatosObligatorios } from "./errores.js";
import { DisponibilidadHoraria } from "./disponibilidadHoraria.js";
import { randomUUID } from "crypto";
import { Especialidad } from "./servicios/especialidad.js";
import { Practica } from "./servicios/practica.js";

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
            throw new Error("No es un Usuario");
        }
        if (matricula.length > 10) {
            throw new Error("Matricula Demasiado larga");
        }
        //this.id = randomUUID();
        this.usuario = usuario;
        this.matricula = matricula;
        this.nombre = nombre;
    }

    definirDisponibilidad(disponibilidad) {
        if (!(disponibilidad instanceof DisponibilidadHoraria)) {
            throw new Error("No es una DisponibilidadHoraria valida");
        }

        this.disponibilidades.forEach(horarioExistente => {
            if (disponibilidad.seSuperponeConOtroHorario(horarioExistente)) {
                throw new Error("Este horario se superpone con otro horario existente");
            }
        });

        this.disponibilidades.push(disponibilidad);
    }

    eliminarDisponibilidad(disponibilidadAEliminar) {
        if (!(disponibilidadAEliminar instanceof DisponibilidadHoraria)) {
            throw new Error("No es una DisponibilidadHoraria valida");
        }
        this.disponibilidades = this.disponibilidades.filter(disponibilidad => disponibilidad.diaSemana !== disponibilidadAEliminar.diaSemana || disponibilidad.horaDesde !== disponibilidadAEliminar.horaDesde || disponibilidad.horaHasta !== disponibilidadAEliminar.horaHasta);
    }

    agregarServicio(servicio) {
        if (!servicio) { throw new Error("Servicio invalido"); }
        if (servicio instanceof Especialidad) {
            this.especialidades.push(servicio);
        }
        else if (servicio instanceof Practica) {
            this.practicas.push(servicio);
        }
        else {
            throw new Error("Tipo de Servicio invalido");
        }
    }

    eliminarServicio(servicioAEliminar) {
        if (!servicioAEliminar) { throw new Error("Servicio invalido"); }
        if (servicioAEliminar instanceof Especialidad) {
            this.especialidades = this.especialidades.filter(especialidad => especialidad.id !== servicioAEliminar.id);
        }
        else if (servicioAEliminar instanceof Practica) {
            this.practicas = this.practicas.filter(practica => practica.id !== servicioAEliminar.id);
        }
        else {
            throw new Error("Tipo de Servicio invalido");
        }
    }

    agregarSede(sede) {
        if (!sede) { throw new Error("Sede invalida"); }
        this.sedes.push(sede);
    }

    eliminarSede(sedeAEliminar) {
        if (!sedeAEliminar) { throw new Error("Sede invalida"); }
        this.sedes = this.sedes.filter(sede => sede.id !== sedeAEliminar.id);
    }

}

