import {
  ErrorDatosObligatorios,
  ErrorContrasenaCorta,
  ErrorUsuarioDemasiadoLargo,
  ErrorUsuarioDemasiadoCorto,
} from "../errores.js";
import { Rol } from "./rolEnum.js";

export class Usuario {
  id;
  nombreUsuario;
  password;
  rol;

  constructor({nombreUsuario, password, rol }) {
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
    if (rol && Object.values(Rol).includes(rol.toUpperCase())) {
      this.rol = rol;
    } else {
      this.rol = Rol.PACIENTE;
    }

    this.nombreUsuario = nombreUsuario;
    this.password = password;
    }
}
