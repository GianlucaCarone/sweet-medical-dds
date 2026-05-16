import mongoose from "mongoose";
import { Usuario } from "../../domain/usuario.js";

const UsuarioSchema = new mongoose.Schema(
  {
    nombreUsuario: {
      type: String,
      //alias: "username", // TODO @matuaponte: y si le ponemos este alias?
      required: true,
      unique: true, // asegura a nivel DB que no haya duplicados
      trim: true, // Limpia espacios en blanco al principio y al final
      minlength: 4,
      maxlength: 20,
    },
    password: {
    type: String,
    required: true
    // NO ponemos el minlength de 8 ni las regex, ya que se hashea antes de guardar
  },
  },
  { timestamps: true },
);

UsuarioSchema.loadClass(Usuario);

export const UsuarioModel = mongoose.model("Usuario", UsuarioSchema);
