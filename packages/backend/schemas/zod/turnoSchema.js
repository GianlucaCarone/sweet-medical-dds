import { z } from "zod";
import { EstadoTurnoEnum } from "../../domain/turnos/estadoTurnoEnum.js";
import { objectIdSchema } from "./objectIdSchema.js";


export const idParamsSchema = z.object({
    id: objectIdSchema("turno")
});

export const bodyCambioEstadoTurnoSchema = z.object({
    nuevoEstado: z.enum(Object.values(EstadoTurnoEnum), { error: () => "El estado del turno no es válido" }),
    quien: objectIdSchema("usuario").optional(),
    motivo: z.string({ error: () => "El motivo debe ser una cadena de texto" }).optional()
});

export const bodyAsignarTurnoSchema = z.object({
    idsTurnos: z.array(objectIdSchema("turno")).min(1, "Debe indicar al menos un turno")
});

export const filtrosTurnoSchema = z.object({
    pacienteId: objectIdSchema("paciente").optional(),
    estado: z.enum(Object.values(EstadoTurnoEnum), { error: () => "El estado del turno no es válido" }).optional(),
    estados: z.array(z.enum(Object.values(EstadoTurnoEnum), { error: () => "El estado del turno no es válido" })).optional(),
    medicoId: objectIdSchema("medico").optional(),
    servicioId: objectIdSchema("servicio").optional(),
    sedeId: objectIdSchema("sede").optional(),
    fechaHoraInicio: z.coerce.date({ error: () => "Fecha de inicio inválida" }).optional(),
    fechaHoraFin: z.coerce.date({ error: () => "Fecha de fin inválida" }).optional(),
    ordenPorCosto: z.enum(["asc", "desc"]).optional(),
    ordenPorFecha: z.enum(["asc", "desc"]).optional()
});

export const turnoBaseSchema = z.object({
    pacienteId: objectIdSchema("paciente").optional(),
    medicoId: objectIdSchema("medico"),
    sedeId: objectIdSchema("sede"),
    servicioId: objectIdSchema("servicio"),
    estado: z.enum(Object.values(EstadoTurnoEnum), { error: () => "El estado del turno no es válido" }),
    fechaHora: z.coerce.date({ error: () => "Fecha inválida" }),
    costo: z.number({ error: () => "El costo del turno debe ser un número" }).nonnegative("El costo del turno no puede ser negativo").optional()
});

export const bodySolicitarCambioFechaSchema = z.object({
    nuevaFechaHora: z.coerce.date({ error: () => "La nueva fecha debe ser una fecha válida" }),
    usuarioId: objectIdSchema("usuario").optional()
});

export const bodyResponderCambioFechaSchema = z.object({
    aceptado: z.boolean({ error: () => "Debe indicar si el cambio es aceptado o no" }),
    usuarioId: objectIdSchema("usuario").optional()
});

export const bodyUpdateTurnoSchema = turnoBaseSchema.partial();