import { Usuario } from "../domain/usuario.js";
import { UsuarioRepository } from "../repositories/UsuarioRepository.js";
import { NotFoundError } from "../errors/AppError.js";

export class UsuarioService {
  constructor({ usuarioRepository = new UsuarioRepository() } = {}) {
    this.usuarioRepository = usuarioRepository;
  }

  async create(usuarioData) {
    //const usuarioExistente = await this.findByUsername(usuarioData.nombreUsuario); // Verificar que no exista otro usuario con el mismo nombre de usuario
    //
    //if (usuarioExistente) {
    //  throw new ConflictError(`Ya existe un usuario con el nombre de usuario ${usuarioData.nombreUsuario}`);
    //}

    const usuario = new Usuario(usuarioData);
    const nuevoUsuario = await this.usuarioRepository.save(usuario);
    return this.toDto(nuevoUsuario);
  }

  async findById(id) {
    const usuario = await this.usuarioRepository.findById(id);

    if (!usuario) {
      throw new NotFoundError("Usuario no encontrado");
    }
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
    await this.usuarioRepository.delete(id);
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
      password: usuario.password
    };
  }
}
