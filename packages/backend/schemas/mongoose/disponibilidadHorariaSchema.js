import mongoose from "mongoose";
import { DisponibilidadHoraria } from "../../domain/disponibilidadHoraria.js";
import {DiaSemana} from "../../domain/diaSemanaEnum.js";

export const disponibilidadHorariaSchema = new mongoose.Schema({
    diaSemana: { type: String, required: true, enum: Object.values(DiaSemana) },
    horaDesde: {
      type: String,
      required: true,
      match: /^([01]\d|2[0-3]):([0-5]\d)$/,
    }, // formato HH:mm
    horaHasta: {
      type: String,
      required: true,
      match: /^([01]\d|2[0-3]):([0-5]\d)$/,
    }, // formato HH:mm
},
{ _id: false }); // No necesitamos un _id para cada disponibilidad horaria, ya que estarán embebidas en el médico

disponibilidadHorariaSchema.loadClass(DisponibilidadHoraria);