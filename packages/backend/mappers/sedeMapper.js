import { Sede } from "../domain/sede.js";

export class SedeMapper {
    static toDomain(sedeDoc) {
        const sede = new Sede({
            nombre: sedeDoc.nombre,
            direccion: sedeDoc.direccion
        });
        sede.id = sedeDoc._id?.toString() ?? sedeDoc.id;

        return sede;
    }

    static toDTO(sede) {
        return {
            id: sede.id || sede._id, //validacion de if default de mongo
            nombre: sede.nombre,
            direccion: sede.direccion
        };
    }
}