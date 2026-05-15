import { z } from "zod";

export const idParamsSchema = z.object({
    id: z.uuid("El id debe ser un UUID válido")
});

export const filtrosTurnoSchema = z.object({
    estado: z.string().optional(),
    profesional: z.object({ id: z.uuid("El ID del profesional no es un UUID válido") }).optional(),
    especialidad: z.object({ id: z.uuid("El ID de la especialidad no es válido") }).optional(),
    practica: z.object({ id: z.uuid("El ID de la práctica no es válido") }).optional(),
    sede: z.object({ id: z.uuid("El ID de la sede no es válido") }).optional(),
    fechaHora: z.object({
        inicio: z.coerce.date({ invalid_type_error: "Fecha de inicio inválida" }),
        fin: z.coerce.date({ invalid_type_error: "Fecha de fin inválida" })
    }).optional()
}).superRefine((filtros, ctx) => {
    if (filtros.fechaHora && filtros.fechaHora.inicio > filtros.fechaHora.fin) {
        ctx.addIssue({
            code: "custom",
            message: "La fecha de inicio no puede ser mayor a la fecha de fin",
            path: ["fechaHora"]
        });
    }
});