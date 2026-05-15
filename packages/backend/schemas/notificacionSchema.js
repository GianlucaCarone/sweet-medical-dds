import { z } from "zod";

export const notificacionIdSchema = z.object({
    id: z.string().uuid("El id de la notificacion debe ser un UUID válido.")
});

export const notificacionSchema = z.object({
    mensaje: z.string().min(15, "El mensaje debe tener como minimo 5 caracteres."),
    destinatarioId: z.string().uuid("El id del destinatario debe ser un UUID válido."),
    remitente: z.string().uuid("El id del remitente debe ser un UUID válido.")
});

export const filtrosNotificacionSchema = z.object({
    destinatarioId: z.string().uuid("El id del destinatario debe ser un UUID válido.").optional(),
    remitenteId: z.string().uuid("El id del remitente debe ser un UUID válido.").optional(),
    leida: z.boolean("Leida debe ser booleano").optional()
});