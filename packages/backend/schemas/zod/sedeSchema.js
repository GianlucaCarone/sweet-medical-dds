import { z } from "zod";

const MIN_NOMBRE_SEDE = 3;
const MAX_NOMBRE_SEDE = 50;

export const nombreSedeSchema = z.string({
  required_error: "El nombre de la sede es obligatorio",
  invalid_type_error: "El nombre de la sede debe ser una cadena de texto"
}).min(MIN_NOMBRE_SEDE, `El nombre debe tener al menos ${MIN_NOMBRE_SEDE} caracteres`)
  .max(MAX_NOMBRE_SEDE, `El nombre debe tener como máximo ${MAX_NOMBRE_SEDE} caracteres`)
  .regex(/^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9 ]+$/, "El nombre solo puede contener letras, números y espacios"); // <-- Agregado el espacio

const MIN_DIRECCION_SEDE = 3;
const MAX_DIRECCION_SEDE = 150; // <-- Aumentado para direcciones reales

export const direccionSedeSchema = z.string({
  required_error: "La dirección de la sede es obligatoria",
  invalid_type_error: "La dirección de la sede debe ser una cadena de texto"
}).min(MIN_DIRECCION_SEDE, `La dirección debe tener al menos ${MIN_DIRECCION_SEDE} caracteres`)
  .max(MAX_DIRECCION_SEDE, `La dirección debe tener como máximo ${MAX_DIRECCION_SEDE} caracteres`)
  .regex(/^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9 .,-]+$/, "La dirección contiene caracteres no permitidos");

export const bodyCrearSedeSchema = z.object({
  nombre: nombreSedeSchema,
  direccion: direccionSedeSchema
});

export const bodyUpdateSedeSchema = bodyCrearSedeSchema.partial();

export const sedeSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio"),
  direccion: z.string().min(1, "La dirección es obligatoria")
});

export const asociarSedeSchema = z.object({
  sedeId: z.string("El id de la sede debe ser un string")
});

export const eliminarSedeParamsSchema = z.object({
  sedeId: z.string("El id de la sede debe ser un string")
});
