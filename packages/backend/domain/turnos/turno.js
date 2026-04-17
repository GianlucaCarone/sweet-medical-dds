import { EstadoTurno } from "../turno.js";
import {CambioEstadoTurno} from "./cambioEstadoTurno.js";
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
        if (!(medico instanceof Medico)) {
            throw new Error("Medico inválido");
        }
        if (!(paciente instanceof Paciente)) {
            throw new Error("Paciente inválido");
        }
        this.id = randomUUID();
        this.medico = medico;
        this.paciente = paciente;
        this.fechaHora = fechaHora;
        this.sede = sede;
        this.practica = practica;

        this.estado = EstadoTurno.DISPONIBLE;
        this.historialEstado = [];
    }

    actualizarEstadoTurno({nuevoEstado, quien, motivo}) {
        if (!Object.values(EstadoTurno).includes(nuevoEstado)) {
            throw new Error("No existe ese estado");
        }
        if(!(quien instanceof Usuario)) {
            throw new Error("Usuario inválido");
        }
        if(!(motivo instanceof String)) {
            throw new Error("Motivo inválido");
        }
        this.estado = nuevoEstado;
        cambioEstado = new CambioEstadoTurno({estado: estadoTurno, usuario: quien, turno: this ,motivo: motivo});
        this.historialEstado.push(cambioEstado);    
        
    }
}