import { z } from "zod";

export const medicoIdParamsSchema = z.object({
  id: z.string().uuid("El id del médico debe ser un UUID válido")
});

export const servicioIdSchema = z.object({
  idServicio: z.string().uuid("El id de la práctica debe ser un UUID válido")
});