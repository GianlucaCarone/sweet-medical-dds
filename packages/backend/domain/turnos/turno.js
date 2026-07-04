import { ErrorDatosObligatorios } from "../errores.js";
import { EstadoTurnoEnum } from "./estadoTurnoEnum.js";
import { CambioEstadoTurno } from "./cambioEstadoTurno.js";

const TRANSICIONES = {
    [EstadoTurnoEnum.DISPONIBLE]: [EstadoTurnoEnum.RESERVADO],
    [EstadoTurnoEnum.RESERVADO]: [EstadoTurnoEnum.CONFIRMADO, EstadoTurnoEnum.CANCELADO, EstadoTurnoEnum.PENDIENTECAMBIO],
    [EstadoTurnoEnum.CONFIRMADO]: [EstadoTurnoEnum.REALIZADO, EstadoTurnoEnum.CANCELADO, EstadoTurnoEnum.PENDIENTECAMBIO],
    [EstadoTurnoEnum.PENDIENTECAMBIO]: [EstadoTurnoEnum.CONFIRMADO, EstadoTurnoEnum.CANCELADO, EstadoTurnoEnum.RESERVADO],
    [EstadoTurnoEnum.CANCELADO]: [],
    [EstadoTurnoEnum.REALIZADO]: [],
};

const ANTICIPACION_MINIMA_MS = 60 * 60 * 1000;

export class Turno {
    id;
    medico;
    servicio;
    paciente;
    fechaHora;
    fechaHoraPropuesta;
    sede;
    estado;
    historialEstado;
    costo;

    constructor({ medico, fechaHora, sede, servicio, costo = 0 }) {
        if (!medico || !sede || !fechaHora) {
            throw new ErrorDatosObligatorios();
        }

        this.medico = medico;
        this.fechaHora = new Date(fechaHora);
        this.sede = sede;
        this.servicio = servicio;
        this.costo = costo;
        this.estado = EstadoTurnoEnum.DISPONIBLE;
        this.historialEstado = [];
    }

    actualizarEstadoTurno({ nuevoEstado, quien, motivo = undefined, ahora = new Date() }) {
        if (!Object.values(EstadoTurnoEnum).includes(nuevoEstado)) {
            throw new Error(`Estado desconocido: '${nuevoEstado}'`);
        }

        const permitidas = TRANSICIONES[this.estado] || [];
        if (!permitidas.includes(nuevoEstado)) {
            throw new Error(`Transición inválida: un turno en estado '${this.estado}' no puede pasar a '${nuevoEstado}'.`);
        }

        if (nuevoEstado === EstadoTurnoEnum.CANCELADO) {
            if (!motivo || typeof motivo !== "string" || motivo.trim().length === 0) {
                throw new Error("Para cancelar el turno se requiere un motivo");
            }
            if (this.fechaHora - ahora < ANTICIPACION_MINIMA_MS) {
                throw new Error("No se puede cancelar un turno con menos de 1 hora de anticipación");
            }
        }

        if (motivo !== undefined && typeof motivo !== "string") {
            throw new Error("Motivo inválido");
        }

        this.estado = nuevoEstado;
        const cambioEstado = new CambioEstadoTurno({
            estado: nuevoEstado,
            usuario: quien,
            turno: this,
            motivo: motivo,
        });
        this.historialEstado.push(cambioEstado);
    }
}
