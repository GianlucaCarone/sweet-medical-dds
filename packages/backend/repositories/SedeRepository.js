import { SedeModel } from "../schemas/dataBase/sedeSchema.js";
// eslint-disable-next-line no-unused-vars
import { Model } from "mongoose";

export class SedeRepository {
    /**@type {typeof Model} */
    model
    constructor() {
        this.model = SedeModel;
    }

    async create(sedeDto) {
        return await this.model.create(sedeDto);
    }

    async findAll() {
        return await this.model.find({ eliminado: false }).exec();
    }

    async findById(id) {
        return await this.model.findById(id).exec();
    }

    async findByName(name) {
        return await this.model.findOne({ name }).exec();
    }

    async save(sede) {
    const nuevaSede = new this.model(sede);
    return await nuevaSede.save();
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
