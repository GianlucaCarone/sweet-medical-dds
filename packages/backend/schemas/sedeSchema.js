import { z } from "zod";

export const sedeSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio"),
  direccion: z.string().min(1, "La dirección es obligatoria")
});

export const asociarSedeSchema = z.object({
  sedeId: z.string().uuid("El id de la sede debe ser un UUID válido")
});

export const eliminarSedeParamsSchema = z.object({
  sedeId: z.string().uuid("El id de la sede debe ser un UUID válido")
});