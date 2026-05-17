import mongoose from "mongoose";

export const servicioSchema = new mongoose.Schema(
    {
        nombre: {
            type: String,
            required: true,
            trim: true,
        },
        duracionTurnoEnMins: {
            type: Number,
            required: true,
        },
    },
    {
        discriminatorKey: "tipo",
        collection: "servicios",
    },
);

const ServicioModel = mongoose.model("Servicio", servicioSchema);

const EspecialidadModel = ServicioModel.discriminator(
    "Especialidad",
    new mongoose.Schema({
        costoConsulta: {
            type: Number,
            required: true,
        },
    }),
);

const PracticaModel = ServicioModel.discriminator(
    "Practica",
    new mongoose.Schema({
        costo: {
            type: Number,
            required: true,
        },
        codigo: {
            type: String,
            required: true,
            trim: true,
        },
    }),
);

export { ServicioModel, EspecialidadModel, PracticaModel };
