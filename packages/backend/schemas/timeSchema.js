import { z } from "zod";

const timeRegex_HH_mm = /^([01]\d|2[0-3]):([0-5]\d)$/;

/**
 * Crea un schema Zod para validar una hora en formato HH:mm (24 horas).
 * @param {string} label 
 * @returns {import("zod").ZodType<string>}
 */
export function timeHH_MMSchema(label){
  return z.string().regex(timeRegex_HH_mm, {
    message: `${label} debe tener formato HH:mm`,
  });
}