import { Notificacion } from "./notificacion.js";
import { EstadoTurnoEnum } from "./turnos/estadoTurnoEnum.js";

// TODO Investigar I18NN para manejar los mensajes de las notificaciones en diferentes idiomas.

export class FactoryNotificacion {
  crearSegunEstadoTurno(turno, remitente, destinatario) {
    const servicio = turno.servicio?.nombre;
    const sede = turno.sede?.nombre;

    let mensaje = "";
    
    switch (turno.estado) {
      case EstadoTurnoEnum.RESERVADO:
        mensaje = `El turno para el servicio de ${servicio} en la sede ${sede} ha sido reservado.`;
        break;
      case EstadoTurnoEnum.CANCELADO:
        mensaje = `El turno para el servicio de ${servicio} en la sede ${sede} ha sido cancelado.`;
        break;
      case EstadoTurnoEnum.CONFIRMADO:
        mensaje = `El turno para el servicio de ${servicio} en la sede ${sede} ha sido confirmado.`;
        break;
      case EstadoTurnoEnum.PENDIENTECAMBIO:
        mensaje = `El turno para el servicio de ${servicio} en la sede ${sede} tiene un cambio pendiente de confirmación.`;
        break;
      default:
        throw new Error("Estado de turno desconocido");
    }

    return new Notificacion({
      destinatario,
      remitente,
      mensaje
    });
  }
}

//El día previo al turno, se envía un recordatorio tanto al paciente como al médico.
// Consideramos que es parte de la capa de service se encargue de filtrar los turnos del dia siguientes y crear y enviar las notificaciones 