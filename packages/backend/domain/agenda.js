import { Turno } from "./turnos/turno.js";
import { EstadoTurnoEnum } from "./turnos/estadoTurnoEnum.js";
import { DiaSemana } from "./diaSemanaEnum.js";

export class Agenda {
    generarTurnosSegunDisponibilidadDelMedico(medico) {
        const turnos = [];
        const fechas = this.obtenerProximosDias(30);

        for (const fecha of fechas) {
            const diaSemana = this.obtenerDiaSemana(fecha);

            const disponibilidadesDelDia = medico.disponibilidades.filter(
                disponibilidad => disponibilidad.diaSemana === diaSemana
            );

            for (const disponibilidad of disponibilidadesDelDia) {
                const duracion = disponibilidad.servicio.duracionTurnoEnMins;
                const slots = this.generarSlots(fecha, disponibilidad, duracion);

                for (const fechaHora of slots) {
                    turnos.push(new Turno({
                        medico: medico.id,
                        fechaHora,
                        sede: disponibilidad.sede.id,
                        servicio: disponibilidad.servicio.id,
                        estado: EstadoTurnoEnum.DISPONIBLE,
                        costo: disponibilidad.servicio.costo + medico.honorario,
                    }));
                }
            }
        }

        return turnos;
    }

    obtenerProximosDias(cantidadDias) {
        const fechas = [];

        const hoyArgentina = new Date(
            new Intl.DateTimeFormat("en-CA", {
                timeZone: "America/Argentina/Buenos_Aires",
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
            }).format(new Date()) + "T00:00:00-03:00"
        );

        for (let i = 0; i < cantidadDias; i++) {
            const fecha = new Date(hoyArgentina);
            fecha.setDate(hoyArgentina.getDate() + i);
            fechas.push(fecha);
        }

        return fechas;
    }

    obtenerDiaSemana(fecha) {
        const dias = {
            domingo: DiaSemana.DOMINGO,
            lunes: DiaSemana.LUNES,
            martes: DiaSemana.MARTES,
            miércoles: DiaSemana.MIERCOLES,
            jueves: DiaSemana.JUEVES,
            viernes: DiaSemana.VIERNES,
            sábado: DiaSemana.SABADO,
        };
    
        const dia = new Intl.DateTimeFormat("es-AR", {
            weekday: "long",
            timeZone: "America/Argentina/Buenos_Aires",
        }).format(fecha);
    
        return dias[dia];
    }

    generarSlots(fechaBase, disponibilidad, duracionEnMinutos) {
        const slots = [];

        let actual = this.fechaConHora(fechaBase, disponibilidad.horaDesde);
        const fin = this.fechaConHora(fechaBase, disponibilidad.horaHasta);
        const ahora = new Date();

        while (actual < fin) {
            const posibleFin = new Date(actual.getTime() + duracionEnMinutos * 60 * 1000);

            if (posibleFin > fin) {
                break;
            }

            if (actual > ahora) {
                slots.push(new Date(actual));
            }

            actual = posibleFin;
        }

        return slots;
    }

    fechaConHora(fechaBase, hora) {
        const [horas, minutos] = hora.split(":").map(Number);

        const fechaArgentina = new Intl.DateTimeFormat("en-CA", {
            timeZone: "America/Argentina/Buenos_Aires",
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        }).format(fechaBase);

        return new Date(
            `${fechaArgentina}T${String(horas).padStart(2, "0")}:${String(minutos).padStart(2, "0")}:00-03:00`
        );
    }
}