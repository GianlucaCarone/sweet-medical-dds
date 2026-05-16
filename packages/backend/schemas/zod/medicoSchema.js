import { z } from "zod";
import diaSemanaEnum from "../../domain/diaSemanaEnum.js";
import { objectIdSchema } from "./objectIdSchema.js";
import { timeHH_MMSchema } from "./timeSchema.js";

// Definimos una constante para la longitud máxima de la matrícula
const MaxLengthMatricula = 10;

export const medicoSchema = z.object({
    nombre: z.string().min(1, "El nombre es obligatorio"),
    //idUsuario: z.string().uuid("El id del usuario debe ser un UUID válido"),
    idUsuario: objectIdSchema("usuario"),
    matricula: z.string().max(MaxLengthMatricula),
});

export const disponibilidadSchema = z.object({
    diaSemana: z.enum(Object.values(diaSemanaEnum)),
    horaDesde: timeHH_MMSchema("hora de inicio"),
    horaHasta: timeHH_MMSchema("hora de fin"),
})
    .superRefine((data, ctx) => {
        if (data.horaDesde >= data.horaHasta) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "La hora de fin debe ser estrictamente posterior a la hora de inicio",
                path: ["horaHasta"],
            });
        }
    });

export const eliminarDisponibilidadSchema = z.object({
    diaSemana: z.enum(Object.values(diaSemanaEnum)),
});

export const disponibilidadConsultaSchema = z.object({
    practicaId: z.string().uuid("El id de la práctica debe ser un UUID válido"),
});
