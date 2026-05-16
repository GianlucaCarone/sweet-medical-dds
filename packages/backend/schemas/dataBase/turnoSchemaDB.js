import { mongoose } from 'mongoose';
import { Turno } from '../../domain/turnos/turno.js';
import { historialEstadoTurnoSchema } from './historialEstadoTurnoSchema.js';



const turnoSchema = new mongoose.Schema({
    fechaHora: {
        type: Date,
        required: true,
    },
    estado: {
        type: String,
        required: true,
    },
    historialEstado: [historialEstadoTurnoSchema],
    medico: {
        type: String, //referenciamos el uuid del medico 
        ref: 'Medico',
        required: true,
    },
    paciente: {
        type: String,  //referenciamos el uuid del paciente 
        ref: 'Paciente',
        required: false,
    },
    practica: {
        type: String, // referenciamos el uuid de la practica si eligió una practica
        ref: 'Practica',
        required: false,
    },
    especialidad: {
        type: String, // referenciamos el uuid de la especialidad si eligió una especialidad
        ref: 'Especialidad',
        required: false,
    },
    sede: {
        type: String, //referenciamos el uuid de la sede 
        ref: 'Sede',
        required: false,
    },
    costo: {
        type: Number,
        required: false,
    },
    eliminado: {
        type: Boolean,
        required: true,
        default: false,
    },
});


turnoSchema.loadClass(Turno);

//indices para la busqueda de los turnos mas eficiente
turnoSchema.index({ medico: 1, fechaHora: 1 });
turnoSchema.index({ estado: 1 });
turnoSchema.index({ paciente: 1 });
turnoSchema.index({ sede: 1 });

export const TurnoModel = mongoose.model('Turno', turnoSchema)