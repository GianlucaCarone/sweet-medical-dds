import { Notificacion } from "../domain/notificacion";
import { EstadoTurno } from "./turno";



class FactoryNotificacion {
  crearSegunEstadoTurno(turno) {
    switch (turno.estado) {
      case EstadoTurno.RESERVADO:
        // TODO consultar el tema de servicio (especialidad o practica)
        return new Notificacion({ destinatario: turno.medico, remitente: turno.paciente, mensaje: "El turno fue reservado por el paciente " + turno.paciente.nombre + " para el servicio " + turno.practica.nombre });
      case EstadoTurno.CANCELADO:
        return new Notificacion({ destinatario: turno.medico, remitente: turno.paciente, mensaje: "El turno fue cancelado por el paciente " + turno.paciente.nombre + " para el servicio " + turno.practica.nombre });
      case EstadoTurno.CONFIRMADO:
        return new Notificacion({ destinatario: turno.paciente, remitente: turno.medico, mensaje: "El turno fue confirmado para el medico " + turno.medico.nombre + " para el servicio " + turno.practica.nombre });
      default:
        throw new Error("Estado de turno desconocido");
    }
  }

}

//El día previo al turno, se envía un recordatorio tanto al paciente como al médico.
// Consideramos que es parte de la capa de service se encargue de filtrar los turnos del dia siguientes y crear y enviar las notificaciones 