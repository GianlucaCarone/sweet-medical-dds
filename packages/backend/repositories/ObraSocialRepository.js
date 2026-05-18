import { ObraSocialModel } from "../schemas/dataBase/obraSocialSchema.js";
// eslint-disable-next-line no-unused-vars
import { Model } from "mongoose";

export class ObraSocialRepository {
    /**@type {typeof Model} */
    model;
    constructor() {
        this.model = ObraSocialModel;
    }

    //crud obras sociales
    async crear(obraSocialDto) {
        return await this.model.create(obraSocialDto);
    }

    async findAll() {
        return await this.model.find({eliminado: false}).lean().exec();
    }

    async save(obraSocial) {
        const nuevaObraSocial = new this.model(obraSocial);
        return await nuevaObraSocial.save();
    }

    async findById(id) {
        return await this.model.findById(id).populate("planes").exec();
    }

    async findByNombre(nombre) {
        return await this.model.findOne({nombre}).exec();
    }

    async delete(id) {
        return await this.model.findByIdAndDelete(id).exec();
    }

    async softDelete(id) {
        return await this.model.findByIdAndUpdate(
            id,
            {
                $set: {
                    eliminado: true,
                    "planes.$[].eliminado": true
                }
            },
            { new: true }
        ).exec();
    }
 
    async update(id,obraSocialData){
        return await this.model.findByIdAndUpdate(id, 
            {$set: obraSocialData},
            { new: true })
            .exec();
    }


    //crud plan 
    async findPlan(obraSocialId, planId){
        const obraSocial = await this.model.findOne(
            { _id: obraSocialId, "planes._id": planId },
            { "planes.$": 1 }
        ).exec();

        if (!obraSocial || !obraSocial.planes?.length) return null;
        return obraSocial.planes[0];
    }

    async addPlan(obraSocialId, plan){
        return await this.model.findByIdAndUpdate(
            obraSocialId,
            { $push: { planes: plan } },
            { new: true }
        ).exec();
    }

    async deletePlan(obraSocialId, planId) {
        return await this.model.findByIdAndUpdate(
            obraSocialId,
            { $pull: { planes: { _id: planId } } },
            { new: true }
        ).exec();
    }

    async softDeletePlan(obraSocialId, planId) {
        return await this.model.findOneAndUpdate(
            { _id: obraSocialId, "planes._id": planId },
            { $set: { "planes.$.eliminado": true } },
            { new: true }
        ).exec();
    }

    async updatePlan(obraSocialId, planId, planData){
        const updateData = {};
        for (const key in planData) {
            updateData[`planes.$[plan].${key}`] = planData[key];
        }

        return await this.model.findByIdAndUpdate(
            obraSocialId,
            { $set: updateData },
            {
                arrayFilters: [{ "plan._id": planId }],
                new: true,
                runValidators: true
            }
        ).exec();
    }

    async findAllPlans(obraSocialId){
        const obraSocial = await this.model.findOne({ _id: obraSocialId, eliminado: false },
            {
                planes: {
                    $filter: {
                        input: "$planes",
                        as: "plan",
                        cond: { $eq: ["$$plan.eliminado", false] }
                    }
                }
            }
        ).exec();

        if (!obraSocial) return null;

        return obraSocial.planes;
    }

    async findPlanByNombre(obraSocialId, planNombre) {
        const obraSocial = await this.model.findOne(
            { _id: obraSocialId, "planes.nombre": planNombre },
            { "planes.$": 1 })
            .populate("planes.coberturaEspecialidad.especialidad")
            .populate("planes.coberturaPractica.practica")
            .exec();

        if (!obraSocial || !obraSocial.planes?.length) return null;
        return obraSocial.planes[0];
    }

    async findPlanByIdPopulado(obraSocialId, planId) {
        const obraSocial = await this.model.findOne(
            { _id: obraSocialId, "planes._id": planId },
            { "planes.$": 1 })
            // .populate("planes.coberturaEspecialidad.especialidad")
            // .populate("planes.coberturaPractica.practica")
            .exec();

        if (!obraSocial || !obraSocial.planes || obraSocial.planes.length === 0) return null;

        return obraSocial.planes[0];
    }

}