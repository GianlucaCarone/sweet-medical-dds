import { MedicoModel } from "../schemas/mongoose/medicoSchema.js";
export class MedicoRepository {
  constructor() {
    this.model = MedicoModel;
  }

  async findAll() {
    return await this.model.find();
  }

  async findById(id) {
    return await this.model.findById(id).populate("idUsuario");
  }

  async save(medico) {
    if (medico.id) {
      return await this.model.findByIdAndUpdate(medico.id, medico, { new: true, runValidators: true });
    }
    return await new this.model(medico).save();
  }

  async findByIdUsuario(idUsuario) {
    return await this.model.findOne({ "idUsuario": idUsuario });
  }

  async delete(id) {
    return await this.model.findByIdAndDelete(id);
  }
}
