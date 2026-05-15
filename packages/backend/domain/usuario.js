import { ErrorDatosObligatorios, ErrorContrasenaCorta, ErrorUsuarioDemasiadoLargo, ErrorUsuarioDemasiadoCorto } from "../domain/errores.js";
import { randomUUID } from "crypto";

export class Usuario {
    id;
    nombreUsuario;
    password;

    constructor({ nombreUsuario, password }) {
        if (!nombreUsuario || !password) {
            throw new ErrorDatosObligatorios();
        }
        if (password.length < 6) {
            throw new ErrorContrasenaCorta("La contraseña debe tener al menos 6 caracteres");
        }
        if (nombreUsuario.length > 25) {
            throw new ErrorUsuarioDemasiadoLargo("El nombre de usuario no puede ser mayor a 25 caracteres");
        }
        if (nombreUsuario.length < 3) {
            throw new ErrorUsuarioDemasiadoCorto("El nombre de usuario debe tener al menos 3 caracteres");
        }

        this.id = randomUUID();
        this.nombreUsuario = nombreUsuario;
        this.password = password;
    }
}