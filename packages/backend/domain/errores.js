export class ErrorDatosObligatorios extends Error {
    constructor() {
        super("Faltan datos obligatorios");
        this.name = "ErrorDatosObligatorios";
    }
}

//Errores específicos de Usuario
export class ErrorContrasenaCorta extends Error {
    constructor(message) {
        super(message);
        this.name = "ErrorContrasenaCorta";
    }
}

export class ErrorUsuarioDemasiadoLargo extends Error {
    constructor(message) {
        super(message);
        this.name = "ErrorUsuarioDemasiadoLargo";
    }
}

export class ErrorUsuarioDemasiadoCorto extends Error {
    constructor(message) {
        super(message);
        this.name = "ErrorUsuarioDemasiadoCorto";
    }
}
