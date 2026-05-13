import { MedicoModel } from "../schemas/mongoose/medicoSchema.js";
import { Medico } from "../domain/medico.js";
export class MedicoRepository {
  constructor() {
    this.model = MedicoModel;
  }

  async findAll() {
    return await this.model.find();
  }

  async findById(id) {
    return await this.model.findById(id);
  }

  async save(medico) {
    return await new this.model(medico).save();
  }

  async findByIdUsuario(idUsuario) {
    return await this.model.findOne({ "idUsuario": idUsuario });
  }
}
