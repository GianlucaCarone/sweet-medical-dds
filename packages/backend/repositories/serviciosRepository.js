import { ServicioSchema } from "../schemas/database/servicioSchema.js";

export class ServiciosRepository {
    constructor () {this.model = ServicioSchema;}

    async save (servicio) {
        const nuevoServicio = new this.model(servicio);
        return await nuevoServicio.save();
    }

    async getById (id) {
        return await this.model.findById(idServicio);
    }

    async deleteById (id) {
        return await this.model.findByIdAndDelete(id);
    }
}