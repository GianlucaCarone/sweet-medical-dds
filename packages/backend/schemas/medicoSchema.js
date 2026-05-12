import { z } from "zod";
import diaSemanaEnum from "../domain/diaSemanaEnum.js";{}
import { usuarioSchema } from "./usuarioSchema.js";

const MaxLengthMatricula = 10;


export const medicoSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio"),
  idUsuario: z.string().uuid("El id del usuario debe ser un UUID válido"),
  matricula: z.string().max(MaxLengthMatricula),
});

export const medicoIdParamsSchema = z.object({
  id: z.string().uuid("El id del médico debe ser un UUID válido")
});

export const disponibilidadSchema = z.object({
    diaSemana: z.enum(Object.values(diaSemanaEnum)),
    horaDesde: z.string().refine((hora) => {
        const [horas, minutos] = hora.split(":").map(Number);
        return (horas >= 0 && horas < 24) && (minutos >= 0 && minutos < 60);
    }, {
        message: "La hora debe estar en formato HH:mm y ser una hora válida"
    }),
    horaHasta: z.string().refine((hora) => {
        const [horas, minutos] = hora.split(":").map(Number);
        return (horas >= 0 && horas < 24) && (minutos >= 0 && minutos < 60);
    }, {
        message: "La hora debe estar en formato HH:mm y ser una hora válida"
    }),
});

export const disponibilidadConsultaSchema = z.object({
  practicaId: z.string().uuid(
    "El id de la práctica debe ser un UUID válido"
  )
});