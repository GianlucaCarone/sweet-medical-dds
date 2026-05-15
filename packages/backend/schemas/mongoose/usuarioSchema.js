import mongoose from "mongoose";
import { Usuario } from "../../domain/usuario.js";

const UsuarioSchema = new mongoose.Schema(
    {
        nombreUsuario: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 4,
        maxlength: 20,
        },
        password: {
            type: String,
            required: true
        },
    }, { 
    timestamps: true 
    },
);

UsuarioSchema.loadClass(Usuario);

export const UsuarioModel = mongoose.model("Usuario", UsuarioSchema);