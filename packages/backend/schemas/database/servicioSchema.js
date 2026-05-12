import mongoose from "mongoose";
import { Especialidad } from "../../domain/servicios/especialidad.js";
import { Practica } from "../../domain/servicios/practica.js";

const servicioSchema = new mongoose.Schema({
    nombre:{
        type: String,
        required: true,
        trim: true
    },
    duracionTurnoEnMins:{
        type: Number,
        required: true,
        trim: true
    }}, {
        discriminatorKey: 'tipo',
        collection: 'servicios'
    })

const Servicio = mongoose.model('Servicio', ServicioSchema)

const Especialidad = Servicio.discriminator(
  'Especialidad',
  new mongoose.Schema({
    costoConsulta: {
        type: Number,
        required: true
    }
  })
)

const Practica = Servicio.discriminator(
  'Practica',
  new mongoose.Schema({
    costo:{
        type: Number,
        required: true
    },
    codigo:{
        type: String,
        required: true,
        trim: true
    }
  })
)