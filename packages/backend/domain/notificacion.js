import { randomUUID } from "crypto";

export class Notificacion {
    id;
    destinatario;
    remitente;
    mensaje;
    fechaHoraCreacion;
    fechaHoraLeida;
    leida = false;

    constructor({ destinatario, remitente, mensaje }) {
        if (!destinatario || !remitente || !mensaje) {
            throw new Error("Faltan datos obligatorios");
        }
        if (!(destinatario instanceof Usuario) || !(remitente instanceof Usuario)) {
            throw new Error("Los destinatarios y remitentes deben ser usuarios");
        }
        this.id = randomUUID();
        this.destinatario = destinatario;
        this.remitente = remitente;
        this.mensaje = mensaje;
        this.fechaHoraCreacion = new Date();
        this.leida = false;
    }

    marcarComoLeida() {
        this.leida = true;
        this.fechaHoraLeida = new Date();
    }
}
