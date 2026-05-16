import { MedicoModel } from "../schemas/mongoose/medicoSchema.js";
import { MedicoMapper } from "../mappers/medicoMapper.js";
import { Medico } from "../domain/medico.js";
import { logger } from '../config/logger.js';

export class MedicoRepository {
  constructor() { this.model = MedicoModel; }

  async findById(idMedico) {
    logger.info("[MEDICO REPOSTIRORY]: Buscando medico: por id", idMedico);
    const medico = await this.model.findById(idMedico).populate(["idUsuario", "especialidades", "practicas"]); //TODO: faltan las disponibilidades y las sedes
    const mensaje = (medico) ? ("Medico obtenido: " + medico) : ("No se encontro el medico con id: " + idMedico);
    logger.info("[MEDICO REPOSTIRORY]: " + mensaje);

    if (!medico) return;
    return MedicoMapper.toDomain(medico, medico.idUsuario);
  }

  async save(medico) {
    logger.info("[MEDICO REPOSTIRORY]: Guardando medico: ", medico);
    var medicoGuardado = null;
    if (medico.id) {
      medicoGuardado = await this.model.findByIdAndUpdate(medico.id, MedicoMapper.toPersistence(medico), { new: true, runValidators: true });
    } else {
      const nuevoMedico = new this.model(MedicoMapper.toPersistence(medico));//
      medicoGuardado = await nuevoMedico.save();
    }
    await medicoGuardado.populate(["idUsuario", "especialidades", "practicas"]); //TODO: faltan las disponibilidades y las sedes
    logger.info("[MEDICO REPOSTIRORY]: Medico guardado: ", medicoGuardado);

    return MedicoMapper.toDomain(medicoGuardado, medicoGuardado.idUsuario);
  }

  async findByIdUsuario(idUsuario) {
    logger.info("[MEDICO REPOSTIRORY]: Buscando medico: por id de usuario", idUsuario);
    const medico = await this.model.findOne({ "idUsuario": idUsuario }).populate(["idUsuario", "especialidades", "practicas"]); //TODO: faltan las disponibilidades y las sedes

    const mensaje = (medico) ? ("Medico obtenido: " + medico) : ("No se encontro el medico con id de usuario: " + idUsuario);
    logger.info("[MEDICO REPOSTIRORY]: " + mensaje);

    if (!medico) return;
    return MedicoMapper.toDomain(medico, medico.idUsuario);
  }
}

export class MedicoRepository2 {
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
