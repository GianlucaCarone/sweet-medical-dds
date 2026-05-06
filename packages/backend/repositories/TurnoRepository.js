import { Turno } from "../domain/Turno.js";
import { EstadoTurnoEnum } from "../domain/turnos/estadoTurnoEnum.js";

export class TurnoRepository {
    constructor() {
        // TODO cambiar por base de datos
        this.turnos = {};
    }

    findAll() {
        return Object.values(this.turnos);
    }

    findByEstado(estado) {
        this.validarEstado(estado);
        return Object.values(this.turnos).filter(turno => turno.estado === estado);
    }

    save(turno) {
        const id = turno.id ?? this.nextId++;
        turno.id = id;
        this.turnos[id] = turno;

        return turno;
    }

    /*
    La plataforma deberá permitir a los pacientes realizar la búsqueda de turnos 
disponibles, teniendo en cuenta tanto criterios médicos como las condiciones de 
cobertura del paciente. 
La búsqueda de turnos deberá soportar, como mínimo, los siguientes filtros: 
● Profesional (médico específico). 
● Especialidad. 
● Práctica. 
● Sede de atención. 
● Rango de fechas. 
Al momento de realizar la búsqueda, el Sistema deberá considerar la obra social y 
el plan del paciente, de modo de poder calcular y mostrar, para cada turno 
disponible: 
● Si la prestación se encuentra cubierta, parcialmente cubierta o no cubierta. 
● El monto que el paciente deberá abonar en caso de reservar dicho turno.
    */

    obtenerPaginados(numeroPagina, limitePorPagina, filtros = {}) {
        let turnos = this.findAll();

        if (filtros.estado !== undefined) {
            turnos = this.findByEstado(filtros.estado)
        }
        if (filtros.profesional?.id !== undefined) {
            turnos = turnos.filter((t) => t.medico.id === filtros.profesional.id)
        }
        if (filtros.especialidad?.id !== undefined) {
            turnos = turnos.filter((t) => t.medico.especialidad.id === filtros.especialidad.id)
        }
        if (filtros.practica?.id !== undefined) {
            turnos = turnos.filter((t) => t.servicio.practica.id === filtros.practica.id)
        }
        if (filtros.sede?.id !== undefined) {
            turnos = turnos.filter((t) => t.sede.id === filtros.sede.id)
        }
        if (filtros.fechaHora?.inicio !== undefined) {
            turnos = turnos.filter((t) => t.fechaHora >= filtros.fechaHora.inicio)
        }
        if (filtros.fechaHora?.fin !== undefined) {
            turnos = turnos.filter((t) => t.fechaHora <= filtros.fechaHora.fin)
        }
        // TODO se puede mejorar esto?

        const inicio = (numeroPagina - 1) * limitePorPagina
        const fin = inicio + limitePorPagina

        return {
            turnos: turnos.slice(inicio, fin),
            totalTurnos: turnos.length
        }
    }


    validarEstado(estado) {
        if (!Object.values(EstadoTurnoEnum).includes(estado)) {
            throw new Error("Estado de turno inválido");
        }
    }


}