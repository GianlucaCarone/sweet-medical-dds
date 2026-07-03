import {
  ErrorDatosObligatorios,
  ErrorContrasenaCorta,
  ErrorUsuarioDemasiadoLargo,
  ErrorUsuarioDemasiadoCorto,
} from "../domain/errores.js";

export class Usuario {
  id;
  nombreUsuario;
  password;

  constructor({nombreUsuario, password }) {
    if (!nombreUsuario || !password) {
      throw new ErrorDatosObligatorios();
    }
    if (password.length < 6) {
      throw new ErrorContrasenaCorta(
        "La contraseña debe tener al menos 6 caracteres",
      );
    }
    if (nombreUsuario.length < 3) {
      throw new ErrorUsuarioDemasiadoCorto("El nombre de usuario debe tener al menos 3 caracteres");
    }

        //this.id = id || randomUUID();
        this.nombreUsuario = nombreUsuario;
        this.password = password;
    }
}
