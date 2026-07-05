import { Usuario } from "../domain/usuarios/usuario.js";
import { UsuarioRepository } from "../repositories/UsuarioRepository.js";
import { PacienteRepository } from "../repositories/PacienteRepository.js";
import { logger } from "../config/logger.js";
import {
  NotFoundError,
  ConflictError,
  UnauthorizedError,
} from "../errors/AppError.js";
import { Rol } from "../domain/usuarios/rolEnum.js";

import argon2 from "argon2";

export class UsuarioService {
  constructor({
    usuarioRepository = new UsuarioRepository(),
    pacienteRepository = new PacienteRepository(),
  } = {}) {
    this.usuarioRepository = usuarioRepository;
    this.pacienteRepository = pacienteRepository;
  }

  async create(usuarioData) {
    //funciona

    const { nombreUsuario } = usuarioData;
    const usuarioExistente =
      await this.usuarioRepository.findByUsername(nombreUsuario); // Verificar que no exista otro usuario con el mismo nombre de usuario
    if (usuarioExistente) {
      throw new ConflictError(
        `Ya existe un usuario con el nombre de usuario ${nombreUsuario}`,
      );
    }

    if (usuarioData.password) {
      try {
        usuarioData.password = await argon2.hash(usuarioData.password, {
          type: argon2.argon2id, // El tipo más seguro (combina Argon2d y Argon2i)
          memoryCost: 2 ** 16, // 64 MB de memoria RAM
          timeCost: 3, // 3 rondas de iteración en la CPU
          parallelism: 4, // Número de hilos de ejecución en paralelo
        });
      } catch (error) {
        logger.error(
          "[USUARIO SERVICE]: Error al hashear la contraseña: ",
          error,
        );
        throw new Error("Error al procesar la contraseña");
      }
    }

    logger.info("[USUARIO SERVICE]: Creando usuario: ", usuarioData);
    const usuario = new Usuario(usuarioData);
    const usuarioGuardado = await this.usuarioRepository.save(usuario);
    logger.info("[USUARIO SERVICE]: Usuario creado: ", usuarioGuardado);

    return this.toDto(usuarioGuardado);
  }

  async findById(id) {
    //funciona
    logger.info("[USUARIO SERVICE]: Obteniendo usuario con id: " + id);
    const usuario = await this.usuarioRepository.findById(id);
    if (!usuario) throw new NotFoundError("Usuario no encontrado");
    logger.info("[USUARIO SERVICE]: Usuario obtenido: ", usuario);
    return this.toDto(usuario);
  }

  /**
   * Devuelve el documento Mongoose completo (sin DTO) para uso interno.
   * Usado por PacienteService para vincular el paciente al usuario.
   */
  async findEntityById(id) {
    logger.info("[USUARIO SERVICE]: Obteniendo entidad usuario con id: " + id);
    const usuario = await this.usuarioRepository.findById(id);
    if (!usuario) throw new NotFoundError("Usuario no encontrado");
    return usuario;
  }

  async login(nombreUsuario, password) {
    const usuario = await this.usuarioRepository.findByUsername(nombreUsuario);
    if (!usuario) {
      throw new UnauthorizedError();
    }

    const passwordValida = await argon2.verify(usuario.password, password);
    if (!passwordValida) {
      throw new UnauthorizedError();
    }

    return this.toDto(usuario);
  }

  /**
   * Crea un Usuario con rol PACIENTE y su perfil de Paciente en un solo flujo.
   * Usado por POST /auth/registro.
   */
  async registrarPaciente({ nombreUsuario, password, nombre, dni, obraSocial, plan }) {
    // 1. Verificar que el nombreUsuario no esté ocupado
    const usuarioExistente = await this.usuarioRepository.findByUsername(nombreUsuario);
    if (usuarioExistente) {
      throw new ConflictError(`Ya existe un usuario con el nombre de usuario ${nombreUsuario}`);
    }

    // 2. Hashear la contraseña
    let passwordHasheada;
    try {
      passwordHasheada = await argon2.hash(password, {
        type: argon2.argon2id,
        memoryCost: 2 ** 16,
        timeCost: 3,
        parallelism: 4,
      });
    } catch (error) {
      logger.error("[USUARIO SERVICE]: Error al hashear la contraseña: ", error);
      throw new Error("Error al procesar la contraseña");
    }

    // 3. Crear el Usuario con rol PACIENTE
    logger.info("[USUARIO SERVICE]: Registrando nuevo paciente: ", nombreUsuario);
    const usuario = new Usuario({ nombreUsuario, password: passwordHasheada, rol: Rol.PACIENTE });
    const usuarioGuardado = await this.usuarioRepository.save(usuario);

    // 4. Crear el Paciente vinculado al usuario recién creado
    const pacienteData = {
      idUsuario: usuarioGuardado._id || usuarioGuardado.id,
      nombre,
      dni,
      ...(obraSocial && { obraSocial }),
      ...(plan && { plan }),
    };
    const pacienteGuardado = await this.pacienteRepository.save(pacienteData);

    logger.info("[USUARIO SERVICE]: Paciente registrado exitosamente: ", pacienteGuardado);

    return this.toDto(usuarioGuardado);
  }

  async findAll() {
    const usuarios = await this.usuarioRepository.findAll();
    return usuarios.map((usuario) => this.toDto(usuario));
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
    usuarioExistente.nombreUsuario =
      usuario.nombreUsuario || usuarioExistente.nombreUsuario;
    
    if (usuario.password) {
      try {
        usuarioExistente.password = await argon2.hash(usuario.password, {
          type: argon2.argon2id,
          memoryCost: 2 ** 16,
          timeCost: 3,
          parallelism: 4,
        });
      } catch (error) {
        logger.error("[USUARIO SERVICE]: Error al hashear la contraseña en update: ", error);
        throw new Error("Error al procesar la contraseña");
      }
    }

    const usuarioActualizado =
      await this.usuarioRepository.update(usuarioExistente);
    return this.toDto(usuarioActualizado);
  }

  toDto(usuario) {
    return {
      id: usuario.id || usuario._id,
      nombreUsuario: usuario.nombreUsuario,
      rol: usuario.rol,
    };
  }
}
