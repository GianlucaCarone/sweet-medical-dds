import { Usuario } from "../domain/usuario.js";
import { BadRequestError } from "../errors/AppError.js";
import { UsuarioModel } from "../schemas/mongoose/usuarioSchema.js";
import { logger } from '../config/logger.js';
import { UsuarioMapper } from "../mappers/usuarioMapper.js";

export class UsuarioRepository {
  constructor() {
        this.model = UsuarioModel;
    }

    async save (usuario) {
        logger.info("[USUARIO REPOSITORY]: Guardando usuario: ", usuario);
        if (!(usuario instanceof Usuario)) {
            throw new Error("No es un Usuario valido");
        }
        const nuevoUsuario = new this.model(usuario);
        logger.info("[USUARIO REPOSITORY]: Usuario guardado: ", nuevoUsuario);
        const usuarioGuardado = await nuevoUsuario.save();
        return UsuarioMapper.toDomain(usuarioGuardado);
    }

    async findById(id) {
        logger.info("[USUARIO REPOSITORY]: Obteniendo usuario: " + id);
        const usuario = await this.model.findById(id);
        if(!usuario) throw new BadRequestError("Usuario no encontrado");
        logger.info("[USUARIO REPOSITORY]: Usuario obtenido: ", usuario);
        return UsuarioMapper.toDomain(usuario);
    }
}