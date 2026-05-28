import { Usuario } from "../domain/usuario.js";
import { UsuarioRepository } from "../repositories/UsuarioRepository.js";
import { logger } from "../config/logger.js";
import { NotFoundError, ConflictError } from "../errors/AppError.js";

import argon2 from "argon2";

export class UsuarioService {
  constructor({ usuarioRepository = new UsuarioRepository() } = {}) {
    this.usuarioRepository = usuarioRepository;
  }

  async create(usuarioData) { //funciona

    const { nombreUsuario } = usuarioData;
    const usuarioExistente = await this.usuarioRepository.findByUsername(nombreUsuario); // Verificar que no exista otro usuario con el mismo nombre de usuario
    if (usuarioExistente) {
      throw new ConflictError(`Ya existe un usuario con el nombre de usuario ${nombreUsuario}`);
    }

    if (usuarioData.password) {
      try {
        usuarioData.password = await argon2.hash(usuarioData.password, {
          type: argon2.argon2id, // El tipo más seguro (combina Argon2d y Argon2i)
          memoryCost: 2 ** 16,   // 64 MB de memoria RAM
          timeCost: 3,           // 3 rondas de iteración en la CPU
          parallelism: 4         // Número de hilos de ejecución en paralelo
        });
      } catch (error) {
        logger.error("[USUARIO SERVICE]: Error al hashear la contraseña: ", error);
        throw new Error("Error al procesar la contraseña");
      }

    }

    logger.info("[USUARIO SERVICE]: Creando usuario: ", usuarioData);
    const usuario = new Usuario(usuarioData);
    const usuarioGuardado = await this.usuarioRepository.save(usuario);
    logger.info("[USUARIO SERVICE]: Usuario creado: ", usuarioGuardado);

    return this.toDto(usuarioGuardado);
  }

  async findById(id) { //funciona
    logger.info("[USUARIO SERVICE]: Obteniendo usuario con id: " + id);
    const usuario = await this.usuarioRepository.findById(id);
    if (!usuario) throw new NotFoundError("Usuario no encontrado");
    logger.info("[USUARIO SERVICE]: Usuario obtenido: ", usuario);
    return this.toDto(usuario);
  }

  async findAll() {
    const usuarios = await this.usuarioRepository.findAll();
    return usuarios.map(usuario => this.toDto(usuario));
  }

  async delete(id) {
    const usuarioExistente = await this.findById(id);

    if (!usuarioExistente) {
      throw new NotFoundError("Usuario no encontrado");
    }
    await this.usuarioRepository.deleteByID(id);
    return this.toDto(usuarioExistente);
  }

  async update(id, usuario) {
    const usuarioExistente = await this.findById(id);

    if (!usuarioExistente) {
      throw new NotFoundError("Usuario no encontrado");
    }
    usuarioExistente.nombreUsuario = usuario.nombreUsuario || usuarioExistente.nombreUsuario;
    usuarioExistente.password = usuario.password || usuarioExistente.password;

    const usuarioActualizado = await this.usuarioRepository.update(usuarioExistente);
    return this.toDto(usuarioActualizado);
  }

  toDto(usuario) {
    return {
      id: usuario.id || usuario._id,
      nombreUsuario: usuario.nombreUsuario,
    };
  }
}
