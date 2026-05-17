import { Notificacion } from "../domain/notificacion.js";
import { EstadoTurnoEnum } from "./turnos/estadoTurnoEnum.js";
import { Especialidad } from "./servicios/especialidad.js";


// TODO Investigar I18NN para manejar los mensajes de las notificaciones en diferentes idiomas.

export class FactoryNotificacion {
  crearSegunEstadoTurno(turno) {
    switch (turno.estado) {
      case EstadoTurnoEnum.RESERVADO:
        return new Notificacion({
          destinatario: turno.medico,
          remitente: turno.paciente,
          mensaje:
            `El turno fue reservado por el paciente ${turno.paciente.nombre} 
            ${turno.servicio instanceof Especialidad ? "para la especialidad" : "con la practica"} ${turno.servicio.nombre} 
            en la sede ${turno.sede.nombre}`
        });
      case EstadoTurnoEnum.CANCELADO:
        return new Notificacion({
          destinatario: turno.medico,
          remitente: turno.paciente,
          mensaje:
            `El turno fue cancelado por el paciente ${turno.paciente.nombre} 
            ${turno.servicio instanceof Especialidad ? "para la especialidad" : "con la practica"} ${turno.servicio.nombre} 
            en la sede ${turno.sede.nombre}`
        });
      case EstadoTurnoEnum.CONFIRMADO:
        return new Notificacion({
          destinatario: turno.paciente,
          remitente: turno.medico,
          mensaje:
            `El turno fue confirmado por el medico ${turno.medico.nombre}
            ${turno.servicio instanceof Especialidad ? "para la especialidad" : "con la practica"} ${turno.servicio.nombre} 
            en la sede ${turno.sede.nombre}`
        });
      default:
        throw new Error("Estado de turno desconocido");
    }
  }
}

//El día previo al turno, se envía un recordatorio tanto al paciente como al médico.
// Consideramos que es parte de la capa de service se encargue de filtrar los turnos del dia siguientes y crear y enviar las notificaciones 