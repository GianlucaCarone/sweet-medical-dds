import mongoose from 'mongoose';
import { Notificacion } from '../../domain/notificacion.js';

const notificacionSchema = new mongoose.Schema({
    destinatiario:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true,
        index: true
    },
    remitente:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    mensaje:{
        type: String,
        required: true,
        trim: true
    },
    fechaHoraCreacion:{
        type: Date,
        required: true
    },
    fechaHoraLeida:{
        type: Date,
        required: false
    },
    leida:{
        type: Boolean,
        required: true,
        default: false
    }
    /* ver si lo usamos o no
    eliminado: {
        type: Boolean,
        required: true,
        default: false
    },*/
},{
    timestamps: true,
    //versionKey: false,
    collection: 'alojamientos'
});

//CARGAMOS EL ESQUEMA NOTIFICACION (MONGOOSE) A LA ENTIDAD NOTIFICACION (NUESTRO DOMINIO)
notificacionSchema.loadClass(Notificacion);

//EXPORTAMOS EL MODELO MONGOOSE QUE SE USARA CORRESPONDIENTE AL ESQUEMA
export const NotificacionModel = mongoose.model('Notificacion', notificacionSchema);