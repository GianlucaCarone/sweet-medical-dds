
export class Practica {
    id;
    codigo;
    nombre;
    duracionTurnoEnMins;
    costo;

    constructor({ codigo, nombre, duracionTurnoEnMins, costo }) {
        if (!codigo || !nombre || !duracionTurnoEnMins || !costo) {
            throw new Error("Faltan datos obligatorios");
        }
        this.codigo = codigo;
        this.nombre = nombre;
        this.duracionTurnoEnMins = duracionTurnoEnMins;
        this.costo = costo;
    }

}