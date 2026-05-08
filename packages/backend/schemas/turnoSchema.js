import { z } from "zod";
import { EstadoTurnoEnum } from "../domain/turnos/estadoTurnoEnum.js";


export const idParamsSchema = z.object({
    id: z.uuid("El id debe ser un UUID válido")
});

export const filtrosTurnoSchema = z.object({
    estado: z.enum(EstadoTurnoEnum, { error: "El estado del turno no es válido" }).optional(),
    medicoId: z.uuid("El ID del medico no es un UUID válido").optional(),
    especialidadId: z.uuid("El ID de la especialidad no es un UUID válido").optional(),
    practicaId: z.uuid("El ID de la practica no es un UUID válido").optional(),
    sedeId: z.uuid("El ID de la sede no es un UUID válido").optional(),
    fechaHora: z.object({
        inicio: z.coerce.date({ invalid_type_error: "Fecha de inicio inválida" }),
        fin: z.coerce.date({ invalid_type_error: "Fecha de fin inválida" })
    }).optional()
}).superRefine((filtros, ctx) => {
    if (filtros.fechaHora && filtros.fechaHora.inicio > filtros.fechaHora.fin) {
        ctx.addIssue({
            code: "custom",
            message: "La fecha de inicio no puede ser mayor a la fecha de fin",
            path: ["fechaHora"]
        });
    }
});