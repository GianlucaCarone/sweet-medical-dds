import { z } from "zod";

export const urlSchema = z.object({
  url: z.string().url(),
});

// Esquema para validar un ID numérico en los parámetros de la URL
export const idParamNumberSchema = z.object({
  id: z.string().regex(/^\d+$/).transform(Number).refine(n => n > 0, {
    message: "El id debe ser un número positivo"
  })
});