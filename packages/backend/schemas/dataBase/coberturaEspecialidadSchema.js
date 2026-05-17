import { mongoose } from "mongoose";
import { CoberturaEspecialidad } from "../../domain/coberturas/coberturaEspecialidad.js";

export const coberturaEspecialidadSchema = new mongoose.Schema({
    especialidad: {
        type: String,
        ref: "Especialidad",
        required: true
    },
    nivel: {
        type: String,
        required: true
    },
    porcentajeCobertura: {
        type: Number,
        required: true
    },
});

coberturaEspecialidadSchema.loadClass(CoberturaEspecialidad);


