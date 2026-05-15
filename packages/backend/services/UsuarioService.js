import { Usuario } from "../domain/usuario.js";
import { UsuarioRepository } from "../repositories/usuariosRepository.js";

export class UsuarioService {
  constructor({ usuarioRepository = new UsuarioRepository() } = {}) {
    this.usuarioRepository = usuarioRepository;
  }

  async create(usuarioData) {
    const usuario = new Usuario(usuarioData);
    return await this.usuarioRepository.save(usuario);
  }

  async findById(id) {
    const usuario = await this.usuarioRepository.findById(id);

    if (!usuario) {
      throw new Error("Usuario no encontrado");
    }
    return usuario;
  }

  async findAll() {
    return await this.usuarioRepository.findAll();
  }

  async delete(id) {
    return await this.usuarioRepository.delete(id);
  }

  async update(id, usuario) {
    const usuarioExistente = await this.findById(id);

    if (!usuarioExistente) {
      //CAMBIÉ ERROR
      throw new NotFoundError("Usuario no encontrado");
    }
    usuarioExistente.nombreUsuario = usuario.nombreUsuario || usuarioExistente.nombreUsuario;
    usuarioExistente.password = usuario.password || usuarioExistente.password;
    
    //return await this.usuarioRepository.update(usuarioExistente);
    const usuarioActualizado = await this.usuarioRepository.update(usuarioExistente);
    return this.toDto(usuarioActualizado);
  }
}