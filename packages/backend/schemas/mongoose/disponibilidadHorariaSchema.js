import mongoose from "mongoose";
import { DisponibilidadHoraria } from "../../domain/disponibilidadHoraria.js";

const disponibilidadHorariaSchema = new mongoose.Schema({
    diaSemana: { type: mongoose.Schema.Types.Enumerator, required: true, enum: ["LUNES", "MARTES", "MIERCOLES", "JUEVES", "VIERNES", "SABADO", "DOMINGO"] },
    horaDesde: { type: mongoose.Schema.Types.Time, required: true }, // formato HH:mm
    horaHasta: { type: mongoose.Schema.Types.Time, required: true }, // formato HH:mm
},
{ _id: false });

disponibilidadHorariaSchema.loadClass(DisponibilidadHoraria);

export const DisponibilidadHorariaModel = mongoose.model("DisponibilidadHoraria", disponibilidadHorariaSchema);