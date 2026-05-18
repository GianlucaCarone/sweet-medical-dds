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

    static toPersistence(sede) {
        return {
            nombre: sede.nombre,
            direccion: sede.direccion
        };
    }

    static toDTO(sede) {
        return {
            id: sede.id || sede._id?.toString(),
            nombre: sede.nombre,
            direccion: sede.direccion
        };
    }
}