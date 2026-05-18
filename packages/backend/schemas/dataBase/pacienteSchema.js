import { Schema } from "mongoose";
import { Paciente } from "../../domain/paciente.js";
import mongoose from "mongoose";

export const pacienteSchema = new Schema({
    idUsuario: {
        type: Schema.Types.ObjectId,
        ref: "Usuario",
        required: true,
    }, // referenciado
    dni: {
        type: Number,
        required: true,
        trim: true,
        minlength: 1,
    },
    nombre: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
    },
    obraSocial: {
        type: Schema.Types.ObjectId,
        ref: "ObraSocial",
        required: false, // puede ser opcional si el paciente puede no tener obra social
    },
    plan: {
        type: String,
        required: false,
    },
})

pacienteSchema.loadClass(Paciente);
export const PacienteModel = mongoose.model("Paciente", pacienteSchema);