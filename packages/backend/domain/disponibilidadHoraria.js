import { DiaSemana } from "./diaSemanaEnum";

export class DisponibilidadHoraria {
    diaSemana;
    horaDesde;
    horaHasta;

    constructor({ diaSemana, horaDesde, horaHasta }) {
        if (!diaSemana || !horaDesde || !horaHasta) {
            throw new Error("Datos obligatorios faltantes");
        }
        if (!Object.values(DiaSemana).includes(diaSemana)) {
            throw new Error("El día de semana no es válido");
        }
        this.diaSemana = diaSemana;
        this.horaDesde = horaDesde;
        this.horaHasta = horaHasta;
    }
}