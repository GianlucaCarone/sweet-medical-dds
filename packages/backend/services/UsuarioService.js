import { Usuario } from "../domain/usuario.js";
import { UsuarioRepository } from "../repositories/usuariosRepository.js";
import { logger } from '../config/logger.js';
import { UsuarioMapper } from "../mappers/usuarioMapper.js";

export class UsuarioService {
  constructor({ usuarioRepository = new UsuarioRepository() } = {}) {
    this.usuarioRepository = usuarioRepository;
  }
  
  toDto(usuario) {
    return {
      id: usuario.id || usuario._id,
      nombreUsuario: usuario.nombreUsuario,
      password: usuario.password
    };
  }
  
  async create(usuarioData) { //funciona
    logger.info("[USUARIO SERVICE]: Creando usuario: ", usuarioData);
    const usuario = new Usuario(usuarioData);
    const usuarioGuardado = await this.usuarioRepository.save(usuario);
    logger.info("[USUARIO SERVICE]: Usuario creado: ", usuarioGuardado);
    return this.toDto(usuarioGuardado);
  }

  async findById(id) { //funciona
    logger.info("[USUARIO SERVICE]: Obteniendo usuario con id: " + id);
    const usuario = await this.usuarioRepository.findById(id);
    if (!usuario) throw new Error("Usuario no encontrado");
    logger.info("[USUARIO SERVICE]: Usuario obtenido: ", usuario);
    return this.toDto(usuario);
  }

  async findEntityById(id) { //funciona
    logger.info("[USUARIO SERVICE]: Obteniendo usuario con id: " + id);
    const usuario = await this.usuarioRepository.findById(id);
    if (!usuario) throw new Error("Usuario no encontrado");
    logger.info("[USUARIO SERVICE]: Usuario obtenido: ", usuario);
    return usuario;
  }

  async findAll() {
    return await this.usuarioRepository.findAll();
  }

  async delete(id) {
    return await this.usuarioRepository.delete(id);
  }

  async update(id, usuario) {
    logger.info("[USUARIO SERVICE]: Obteniendo usuario: ", usuario);
    const usuarioExistente = await this.findById(id);

    if (!usuarioExistente) throw new NotFoundError("Usuario no encontrado");
    logger.info("[USUARIO SERVICE]: Usuario obtenido: ", usuario);
    usuarioExistente.nombreUsuario = usuario.nombreUsuario || usuarioExistente.nombreUsuario;
    usuarioExistente.password = usuario.password || usuarioExistente.password;

  
    const usuarioActualizado = await this.usuarioRepository.update(usuarioExistente);
    return this.toDto(usuarioActualizado);
  }
}