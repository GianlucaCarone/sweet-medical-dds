import { SedeModel } from "../schemas/dataBase/sedeSchema.js";

export class SedeRepository {
    constructor() {
        this.model = SedeModel;
    }

    async create(sedeDto) {
        return await this.model.create(sedeDto);
    }

    async findAll() {
        const sedes = await this.model.find({ eliminado: false }).exec();
        return sedes;
    }

    async findById(id) {
        const sede = await this.model.findById(id).exec();
        if (!sede) {
            return null;
        }
        return sede;
    }

    async findByName(nombre) {
        const sede = await this.model.findOne({ nombre }).exec();
        if (!sede) {
            return null;
        }
        return sede;
    }

    async save(sede) {
        if (sede._id) {
            return await this.model.findByIdAndUpdate(sede._id, sede, { new: true }).exec();
        }

        return this.model.create(sede);
    }

    async update(id, sedeData) {
        return await this.model.findByIdAndUpdate(id, sedeData, { new: true }).exec();
    }

    async delete(id) {
        return await this.model.findByIdAndDelete(id).exec();
    }

    async softDelete(id) {
        return await this.model.findByIdAndUpdate(id, { eliminado: true }, { new: true }).exec();
    }

}
