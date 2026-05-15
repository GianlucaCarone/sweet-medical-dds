import { DiaSemana } from "./diaSemanaEnum.js";

export class DisponibilidadHoraria {
    diaSemana;
    horaDesde;
    horaHasta;

    constructor({ diaSemana, horaDesde, horaHasta }) {
        if (!diaSemana || !horaDesde || !horaHasta) {
            throw new ErrorDatosObligatorios();
        }
        if (!Object.values(DiaSemana).includes(diaSemana)) {
            throw new Error("El día de semana no es válido");
        }
        if (horaDesde >= horaHasta) {
            throw new Error("La hora desde debe ser menor a la hora hasta");
        }
        this.diaSemana = diaSemana;
        this.horaDesde = horaDesde;
        this.horaHasta = horaHasta;
    }

    seSuperponeCon(otroHorario) {
        if (!(otroHorario instanceof DisponibilidadHoraria)) {
            throw new Error("Se debe comparar con otra DisponibilidadHoraria");
        }
        if (this.diaSemana !== otroHorario.diaSemana) {
            return false;
        }
        //Si se superponen en el dia, se fija si se superponen en la hora
        //Entonces si la hora de inicio del horario es menor a la hora de fin del otro horario
        //Y la hora de fin del horario es mayor a la hora de inicio del otro horario
        //Entonces se superponen
        return this.horaDesde < otroHorario.horaHasta && this.horaHasta > otroHorario.horaDesde;
    }
}