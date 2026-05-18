import { SedeModel } from "../schemas/dataBase/sedeSchema.js";
// eslint-disable-next-line no-unused-vars
import { Model } from "mongoose";
import { SedeMapper } from "../mappers/sedeMapper.js";

export class SedeRepository {
    /**@type {typeof Model} */
    model;
    constructor() {
        this.model = SedeModel;
    }

    async create(sedeDto) {
        return await this.model.create(sedeDto);
    }

    async findAll() {
        const sedes = await this.model.find({ eliminado: false }).exec();
        return sedes.map(SedeMapper.toDomain);
    }

    async findById(id) {
        const sede = await this.model.findById(id).exec();
        return SedeMapper.toDomain(sede);
    }

    async findByName(nombre) {
        const sede = await this.model.findOne({ nombre }).exec();
        if (!sede) {
            return null;
        }
        return SedeMapper.toDomain(sede);
    }

    async save(sede) {
        if (sede._id) {
            return await this.model.findByIdAndUpdate(sede._id, SedeMapper.toPersistence(sede), { new: true }).exec();
        }
        const nuevoSede = new this.model(SedeMapper.toPersistence(sede));
        const sedeGuardada = await nuevoSede.save();
        return SedeMapper.toDomain(sedeGuardada);
    }

    async update(id, sedeData) {
        return SedeMapper.toDomain(await this.model.findByIdAndUpdate(id, sedeData, { new: true }).exec());
    }

    async delete(id) {
        return SedeMapper.toDomain(await this.model.findByIdAndDelete(id).exec());
    }

    async softDelete(id) {
        return SedeMapper.toDomain(await this.model.findByIdAndUpdate(id, { eliminado: true }, { new: true }).exec());
    }

}
