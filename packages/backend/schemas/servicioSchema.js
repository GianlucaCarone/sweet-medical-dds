import { z } from "zod";

export const servicioSchema = z.object ({
    nombre: z.string().min(1, "El nombre es obligatorio."),
    duracionEnMin: z.number().min(1, "La duracion debe ser mayor a un minuto"),
    costo: z.number(),
    codigo: z.string()
});

export const servicioIdParamsSchema = z.object ({
    id: z.string().uuid("El id del servicio debe ser un UUID válido.")
});