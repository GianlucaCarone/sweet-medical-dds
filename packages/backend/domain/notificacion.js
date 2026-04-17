import { randomUUID } from "crypto";
import { ErrorDatosObligatorios } from "./errores";

export class Notificacion {
    id;
    destinatario;
    remitente;
    mensaje;
    fechaHoraCreacion;
    fechaHoraLeida;
    leida = false;

    constructor({ destinatario, remitente = null , mensaje }) { //remitente = null significa que default es null, si lo pasamos en el constructor se aplica
        if (!destinatario || !mensaje) {
            throw new ErrorDatosObligatorios();
        }
        if (!(destinatario instanceof Usuario) || !(remitente instanceof Usuario)) {
            throw new Error("Los destinatarios deben ser usuarios");
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
