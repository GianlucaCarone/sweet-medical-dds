import { Medico } from "../medico.js";
import { ObraSocial } from "../obraSocial.js";
import { Paciente } from "../paciente.js";
import { Plan } from "../plan.js";
import { EstadoTurno } from "../turno.js";
import { CambioEstadoTurno } from "./cambioEstadoTurno.js";
export class Turno {
    id;
    medico;
    servicio;
    paciente;
    fechaHora;
    sede;
    estado;
    historialEstado;
    costo;

    constructor({ medico, servicio, fechaHora, sede }) {

        if (!medico || !servicio || !sede) {
            throw new ErrorDatosObligatorios()
        }
        if (!(medico instanceof Medico)) {
            throw new Error("Medico inválido");
        }

        this.id = randomUUID();
        this.medico = medico;
        this.servicio = servicio;
        this.fechaHora = fechaHora;
        this.sede = sede;

        this.estado = EstadoTurno.DISPONIBLE;
        this.historialEstado = [];
    }

    actualizarEstadoTurno({ nuevoEstado, quien, motivo }) {
        if (!Object.values(EstadoTurno).includes(nuevoEstado)) {
            throw new Error("No existe ese estado");
        }

        /* TODO: Tambien se puede implementar la logica de transiciones de estados con una maquina de estados donde se validen transacciones validas. Ademas hacer la logica de cambios de estados con los metodos de mas abajo para que sean usados en el service
        const transicionesValidas = {
            [EstadoTurno.DISPONIBLE]: [EstadoTurno.RESERVADO, EstadoTurno.CANCELADO],
            [EstadoTurno.RESERVADO]: [EstadoTurno.CONFIRMADO, EstadoTurno.CANCELADO, EstadoTurno.DISPONIBLE],
            [EstadoTurno.CONFIRMADO]: [EstadoTurno.REALIZADO, EstadoTurno.CANCELADO],
            [EstadoTurno.CANCELADO]: [], // Estado final 
            [EstadoTurno.REALIZADO]: []  // Estado final 
        };
        const transicionesPermitidas = transicionesValidas[this.estado] || [];
        if (!transicionesPermitidas.includes(nuevoEstado)) {
            throw new Error(`Transición inválida: un turno en estado '${this.estado}' no puede pasar a '${nuevoEstado}'.`);
        }
        */

        if (!(quien instanceof Usuario)) {
            throw new Error("Usuario inválido");
        }
        if (!(motivo instanceof String)) {
            throw new Error("Motivo inválido");
        }
        this.estado = nuevoEstado;
        cambioEstado = new CambioEstadoTurno({ estado: nuevoEstado, usuario: quien, turno: this, motivo: motivo });
        this.historialEstado.push(cambioEstado);
    }

    /* TODO: consultar que hacemos si aplicamos la logica de cambios de estados CON FUNCIONESA   
        AsignarTurno(paciente, motivo) {
            if (!(paciente instanceof Paciente)) {
                throw new Error("Paciente inválido");
            }
            if (!(motivo instanceof String)) {
                throw new Error("Motivo inválido");
            }
            this.paciente = paciente;
            this.actualizarEstadoTurno({nuevoEstado: EstadoTurno.RESERVADO, quien: paciente, motivo: motivo});
        }
    
        cancelarTurno(quien, motivo) {
            if (!(quien instanceof Usuario)) {
                throw new Error("Usuario inválido");
            }
            if (!(motivo instanceof String)) {
                throw new Error("Motivo inválido");
            }
            this.actualizarEstadoTurno({nuevoEstado: EstadoTurno.CANCELADO, quien: quien, motivo: motivo});
        }
    
        confirmarTurno(quien, motivo) {
            if (!(quien instanceof Usuario)) {
                throw new Error("Usuario inválido");
            }
            if (!(motivo instanceof String)) {
                throw new Error("Motivo inválido");
            }
            this.actualizarEstadoTurno({nuevoEstado: EstadoTurno.CONFIRMADO, quien: quien, motivo:motivo});
        }
        finalizarTurno(quien, motivo) {
            if (!(quien instanceof Usuario)) {
                throw new Error("Usuario inválido");
            }
            if (!(motivo instanceof String)) {
                throw new Error("Motivo inválido");
            }
            this.actualizarEstadoTurno({nuevoEstado: EstadoTurno.FINALIZADO, quien: quien, motivo:motivo});
        }
        
        */

    //TODO: hacer logica costo de turnos
    calcularCosto() {
        return 0;
    }

}