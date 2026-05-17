import { z } from "zod";

export const servicioSchema = z.object({
    nombre: z.string().min(1, "El nombre es obligatorio."),
    duracionEnMin: z.number().min(1, "La duracion debe ser mayor a un minuto"),
    costo: z.number(),
    codigo: z.string().nullable()
});

export const servicioIdParamsSchema = z.object({
    idServicio: z.string()
});