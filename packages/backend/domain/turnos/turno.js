import { Medico } from "../medico.js";
import { BadRequestError } from "../../errors/AppError.js";
import { EstadoTurnoEnum } from "./estadoTurnoEnum.js";
import { CambioEstadoTurno } from "./cambioEstadoTurno.js";
import { Practica } from "../servicios/practica.js";
import { Especialidad } from "../servicios/especialidad.js";
import { Usuario } from "../usuario.js";
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

    constructor({ medico, fechaHora, sede, servicio }) {

        if (!medico || !sede || !fechaHora) {
            throw new BadRequestError()
        }
        if (!(medico instanceof Medico)) {
            throw new Error("Medico inválido");
        }
        if (!(servicio instanceof Practica || !(servicio instanceof Especialidad)))

            this.medico = medico;
        this.fechaHora = fechaHora;
        this.sede = sede;
        this.servicio = servicio;

        this.estado = EstadoTurnoEnum.DISPONIBLE;
        this.historialEstado = [];
    }

    //motivo opcional
    actualizarEstadoTurno({ nuevoEstado, quien, motivo = undefined }) {
        if (!Object.values(EstadoTurnoEnum).includes(nuevoEstado)) {
            throw new Error("No existe ese estado");
        }

        /* TODO: Tambien se puede implementar la logica de transiciones de estados con una maquina de estados donde se validen transacciones validas. Ademas hacer la logica de cambios de estados con los metodos de mas abajo para que sean usados en el service
        const transicionesValidas = {
            [EstadoTurno.DISPONIBLE]: [EstadoTurno.RESERVADO, EstadoTurno.CANCELADO],
            [EstadoTurno.RESERVADO]: [EstadoTurno.CONFIRMADO, EstadoTurno.CANCELADO, EstadoTurno.DISPONIBLE],
            [EstadoTurno.CONFIRMADO]: [EstadoTurno.REALIZADO, EstadoTurno.CANCELADO],
            [EstadoTurno.CANCELADO]: [EstadoTurno.DISPONIBLE], //Solo con mucha anticipacion
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
        const cambioEstado = new CambioEstadoTurno({ estado: nuevoEstado, usuario: quien, turno: this, motivo: motivo });
        this.historialEstado.push(cambioEstado);
    }



}