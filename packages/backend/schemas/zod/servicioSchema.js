import { z } from "zod";

export const servicioSchema = z.object({
    nombre: z.string().min(1, "El nombre es obligatorio."),
    duracionEnMins: z.number().min(1, "La duracion debe ser mayor a un minuto"),
    costo: z.number(),
    codigo: z.string().nullable().optional(),
    especialidadPadreId: z.string().nullable().optional()
});

export const servicioIdParamsSchema = z.object({
    idServicio: z.string()
});