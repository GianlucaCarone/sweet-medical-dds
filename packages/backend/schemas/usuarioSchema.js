import { z } from "zod";

export const usuarioSchema = z.object({
  id: z.string().uuid("El id debe ser un UUID válido").optional(),
  nombreUsuario: z.string().min(1, "El nombre de usuario es obligatorio"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres")
});

export const usuarioIdSchema = z.object({
    idUsuario: z.string().uuid("El id del usuario debe ser un UUID válido")
});