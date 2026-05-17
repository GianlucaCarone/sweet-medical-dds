import { ErrorDatosObligatorios } from "./errores.js";
import { Usuario } from "./usuario.js";

export class Notificacion {
    id;
    destinatario;
    remitente;
    mensaje;
    fechaHoraCreacion;
    fechaHoraLeida;
    leida = false;

    constructor({ destinatario, remitente, mensaje }) {
        if (!destinatario || !mensaje) {
            throw new ErrorDatosObligatorios();
        }
        if (!(destinatario instanceof Usuario) || !(remitente instanceof Usuario)) {
            throw new Error("Los destinatarios deben ser usuarios");
        }
        //this.id = randomUUID();
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
