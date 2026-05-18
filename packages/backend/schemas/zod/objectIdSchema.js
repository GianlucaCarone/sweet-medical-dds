import { z } from "zod";

const objectIdRegex = /^[a-fA-F0-9]{24}$/;

/**
 * Crea un schema Zod para validar un ObjectId de MongoDB.
 *
 * @param {string} [label="entity"] Nombre la entidad para el mensaje de error.
 * @returns {import("zod").ZodType<string>} Schema Zod que valida 24 caracteres hexadecimales.
 */
export function objectIdSchema(label = "entity") {
    return z.string().regex(objectIdRegex, {
        message: `El id de ${label} debe ser un ObjectId válido (24 caracteres hexadecimales)`,
    });
}

export const objectIdParamSchema = z.object({
    id: objectIdSchema("parámetro"),
});
