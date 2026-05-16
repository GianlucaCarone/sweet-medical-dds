import { Usuario } from "../domain/usuario.js";

export class UsuarioMapper {
  static toDomain(usuarioDoc) {
    const usuario = new Usuario({
      nombreUsuario: usuarioDoc.nombreUsuario,
      password: usuarioDoc.password,
    });

    usuario.id = usuarioDoc._id?.toString() ?? usuarioDoc.id;

    return usuario;
  }

  static toPersistence(usuario) {
    return {
      nombreUsuario: usuario.nombreUsuario,
      password: usuario.password,
    }
  }

  static toDTO(usuario) {
    return {
      id: usuario.id || usuario._id,
      nombreUsuario: usuario.nombreUsuario,
      password: usuario.password
    };
  }
}