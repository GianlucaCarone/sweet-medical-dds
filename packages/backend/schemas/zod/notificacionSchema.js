import { z } from "zod";
import { objectIdSchema } from "./objectIdSchema.js";

export const notificacionIdParamsSchema = z.object({
    idNotificacion: objectIdSchema("notificación")
});

export const notificacionSchema = z.object({
    mensaje: z.string().min(15, "El mensaje debe tener como minimo 15 caracteres."),
    destinatarioId: objectIdSchema("destinatario"),
    remitente: objectIdSchema("remitente")
});

export const filtrosNotificacionSchema = z.object({
    destinatarioId: objectIdSchema("destinatario").optional(),
    remitenteId: objectIdSchema("remitente").optional(),
    leida: z.boolean({ error: () => "Leida debe ser booleano" }).optional()
});