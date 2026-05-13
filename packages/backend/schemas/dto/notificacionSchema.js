import { z } from "zod";

export const notificacionIdSchema = z.object({
    id: z.string().uuid("El id de la notificacion debe ser un UUID válido.")
});

export const notificacionSchema = z.object({
    mensaje: z.string.min(15, "El mensaje debe tener como minimo 5 caracteres."),
    destinatario: z.string().uuid("El id del destinatario debe ser un UUID válido."),
    remitente: z.string().uuid("El id del remitente debe ser un UUID válido.")
});

export const usuarioIdSchema = z.object({
    idUsuario: z.string().uuid("El id del usuario debe ser un UUID válido")
});