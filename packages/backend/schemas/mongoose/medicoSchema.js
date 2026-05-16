import mongoose from "mongoose";
import { Medico } from "../../domain/medico.js";
import { disponibilidadHorariaSchema } from "./disponibilidadHorariaSchema.js";

const MedicoSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
    },
    idUsuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
      required: true,
    }, // referenciado
    matricula: {
      type: String,
      required: true,
      trim: true,
      maxlength: 10,
      minlength: 1,
    },
    disponibilidades: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "DisponibilidadHoraria", 
        required: true,
      }
    ],
    especialidades: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Especialidad",
        required: true
      }
    ],
    practicas: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Practica",
        required: true
      }
    ]
  },
  { timestamps: true },
);

MedicoSchema.loadClass(Medico);

MedicoSchema.pre(/^find/, function (next) {
  //this.lean();
  next();
});

export const MedicoModel = mongoose.model("Medico", MedicoSchema);import mongoose from "mongoose";
import { Medico } from "../../domain/medico.js";
import { disponibilidadHorariaSchema } from "./disponibilidadHorariaSchema.js";

const MedicoSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true, trim: true, minlength: 1 },
    idUsuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
      required: true,
    }, // referenciado
    matricula: {
      type: String,
      required: true,
      trim: true,
      maxlength: 10,
      minlength: 1,
    },
    disponibilidades: [disponibilidadHorariaSchema], // embebido
    
    /* especialidades: [{ type: mongoose.Schema.Types.ObjectId, ref: "Especialidad" }],
  practicas: [{ type: mongoose.Schema.Types.ObjectId, ref: "Practica" }],
  sedes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Sede" }] */
  },
  { timestamps: true },
);

MedicoSchema.loadClass(Medico);

MedicoSchema.pre(/^find/, function (next) {
  //this.lean();
  next();
});

export const MedicoModel = mongoose.model("Medico", MedicoSchema);
