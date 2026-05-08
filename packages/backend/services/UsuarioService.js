import { Usuario } from "../domain/usuario.js";
import { UsuarioRepository } from "../repositories/UsuarioRepository.js";

export class UsuarioService {
  constructor({ usuarioRepository = new UsuarioRepository() } = {}) {
    this.usuarioRepository = usuarioRepository;
  }

  create(usuarioData) {
    const usuario = new Usuario(usuarioData);
    return this.usuarioRepository.save(usuario);
  }

  findById(id) {
    const usuario = this.usuarioRepository.findById(id);

    if (!usuario) {
      throw new Error("Usuario no encontrado");
    }
    return usuario;
  }

  findAll() {
    return this.usuarioRepository.findAll();
  }

  delete(id) {
    return this.usuarioRepository.delete(id);
  }

  update(id, usuario) {
    const usuarioExistente = this.findById(id);

    if (!usuarioExistente) {
      throw new Error("Usuario no encontrado");
    }
    usuarioExistente.nombreUsuario = usuario.nombreUsuario || usuarioExistente.nombreUsuario;
    usuarioExistente.password = usuario.password || usuarioExistente.password;

    return this.usuarioRepository.update(usuarioExistente);
  }
}
