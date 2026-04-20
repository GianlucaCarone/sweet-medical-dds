export class Agenda {
    generarTurnosParaEspecialidad({ especialidad, medico }) {
        return new Turno();
    }

    generarTurnosParaPractica({ practica, medico }) {
        return new Turno();
    }

    refresacarTurnosSegunDisponibilidad({ medico }) {
        return []
    }
}