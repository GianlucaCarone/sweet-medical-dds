import { randomUUID } from "crypto";

export const EstadoTurno = Object.freeze({
    DISPONIBLE: "DISPONIBLE",
    RESERVADO: "RESERVADO",
    CONFIRMADO: "CONFIRMADO",
    CANCELADO: "CANCELADO",
    REALIZADO: "REALIZADO",
});

export class Turno {
    id;
    medico;
    paciente;
    fechaHora;
    sede;
    practica;
    estado;
    historialEstado;
    costo;

    constructor({ medico, paciente, fechaHora, sede, practica }) {

        if (!medico || !paciente || !sede || !practica) {
            throw new Error("Faltan datos obligatorios")
        }
        this.id = randomUUID();
        this.medico = medico;
        this.paciente = paciente;
        this.fechaHora = fechaHora;
        this.sede = sede;
        this.practica = practica;
        this.estado = EstadoTurno.DISPONIBLE;
        this.historialEstado = [EstadoTurno.DISPONIBLE];
        this.costo = 0;
    }

    cambiarEstado(estadoTurno) {
        if (!Object.values(EstadoTurno).includes(estadoTurno)) {
            throw new Error("No existe ese estado");
        }
        this.estado = estadoTurno;
        this.historialEstado.push(estadoTurno);
    }

}