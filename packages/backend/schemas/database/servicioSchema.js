import mongoose from "mongoose";

const servicioSchema = new mongoose.Schema(
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
  }
);

const Servicio = mongoose.model("Servicio", servicioSchema);

const EspecialidadModel = Servicio.discriminator(
  "Especialidad",
  new mongoose.Schema({
    costoConsulta: {
      type: Number,
      required: true,
    },
  })
);

const PracticaModel = Servicio.discriminator(
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
  })
);

export { Servicio, EspecialidadModel, PracticaModel };