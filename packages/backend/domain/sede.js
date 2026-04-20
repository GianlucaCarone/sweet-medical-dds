
export class Sede {
    id;
    nombre;
    direccion;

    constructor({ nombre, direccion }) {
        if (!nombre || !direccion) {
            throw new ErrorDatosObligatorios();
        }
        this.nombre = nombre;
        this.direccion = direccion;
    }
}