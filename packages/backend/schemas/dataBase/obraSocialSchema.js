import { mongoose } from 'mongoose';
import { ObraSocial } from '../../domain/obraSocial';
import { planSchema } from './planSchema';

const obraSocialSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true,
    },
    nombre: {
        type: String,
        required: true,
    },
    planes: {
        type: [planSchema],
        default: [],
        required: true,
    },
    eliminado: {
        type: Boolean,
        required: true,
        default: false,
    },
})

obraSocialSchema.loadClass(ObraSocial);

export const ObraSocialModel = mongoose.model("ObraSocial", obraSocialSchema);