import { z } from "zod";
import diaSemanaEnum from "../domain/diaSemanaEnum.js";

const MaxLengthMatricula = 10;
// Regex para formato 24h estricto (ej: 09:00, 23:59)
const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
const objectIdRegex = /^[a-fA-F0-9]{24}$/; // Para validar ObjectId de MongoDB

export const medicoSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio"),
  //idUsuario: z.string().uuid("El id del usuario debe ser un UUID válido"),
  idUsuario: z.string().regex(objectIdRegex, {
    message:
      "El id del usuario debe ser un ObjectId válido (24 caracteres hexadecimales)",
  }),
  matricula: z.string().max(MaxLengthMatricula),
});

export const medicoIdParamsSchema = z.object({
  id: z.string().uuid("El id del médico debe ser un UUID válido"),
});

export const disponibilidadSchema = z
  .object({
    diaSemana: z.enum(Object.values(diaSemanaEnum)), // Excelente esto
    horaDesde: z
      .string()
      .regex(timeRegex, { message: "Formato inválido. Use HH:mm (ej: 09:00)" }),
    horaHasta: z
      .string()
      .regex(timeRegex, { message: "Formato inválido. Use HH:mm (ej: 18:30)" }),
  })
  .refine((data) => data.horaDesde < data.horaHasta, {
    // Validamos el objeto completo para comparar campos
    message:
      "La hora de fin debe ser estrictamente posterior a la hora de inicio",
    path: ["horaHasta"], // Zod mapea este error al campo 'horaHasta' en el response
  });

export const eliminarDisponibilidadSchema = z.object({
  diaSemana: z.enum(Object.values(diaSemanaEnum)),
});

export const disponibilidadConsultaSchema = z.object({
  practicaId: z.string().uuid("El id de la práctica debe ser un UUID válido"),
});
