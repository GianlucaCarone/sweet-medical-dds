import { Turno } from "./turnos/turno.js";

export class Agenda {
    generarTurnosDel({ medico }) {
        return new Turno();
    }

    refresacarTurnosSegunDisponibilidad({ medico }) {
        return []
    }
}