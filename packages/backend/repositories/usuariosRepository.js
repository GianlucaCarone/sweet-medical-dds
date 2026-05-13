import { Usuario } from "../domain/usuario.js";
import { BadRequestError } from "../errors/AppError.js";

export class UsuarioRepository {
  constructor() {
        this.usuarios = {};
        this.nextId = 1;
    }

    save (usuario) {
        if (!(usuario instanceof Usuario)) {
            throw new Error("No es un Usuario valido");
        }
        this.usuarios[usuario.id] = usuario;
        return usuario;
    }

    findById(id) {
        const usuario = this.usuarios[id];
        if(!usuario) {
            throw new BadRequestError("Usuario no encontrado");
        }
        return usuario;
    }

    findAll() {
        return Object.values(this.usuarios);
    }

    delete(id) {
        delete this.usuarios[id];
    }

    update(usuario) {
        const usuarioExistente = this.findById(usuario.id); // Verificar que el usuario existe, si no lanza un error
        if (!usuarioExistente) {
            throw new BadRequestError("Usuario no encontrado");
        }
        this.usuarios[usuario.id] = usuario;
        return usuario;
    }
}