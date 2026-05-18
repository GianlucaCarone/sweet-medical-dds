import { SedeRepository } from "../repositories/SedeRepository.js";
import { ConflictError, NotFoundError, UnprocessableEntityError } from "../errors/AppError.js";
import { Sede } from "../domain/sede.js";
import { SedeMapper } from "../mappers/sedeMapper.js";

export class SedeService {
  constructor({ sedeRepository = new SedeRepository() } = {}) {
    this.sedeRepository = sedeRepository;
  }

  async findAll() {
    const sedes = await this.sedeRepository.findAll();
    if (sedes.length === 0) {
      throw new NotFoundError("No se encontró ninguna sede");
    }
    return sedes.map(sede => SedeMapper.toDTO(sede));
  }

  async create(data) {
    const { nombre, direccion } = data;

    if (!nombre || !direccion) {
      throw new UnprocessableEntityError("Datos incompletos para crear la sede");
    }

    const sedeExistente = await this.sedeRepository.findByName(nombre);
    if (sedeExistente) {
      throw new ConflictError("Ya existe una sede con ese nombre");
    }
    const sede = new Sede({ nombre, direccion });
    return SedeMapper.toDTO(await this.sedeRepository.save(sede));
  }

  async update(id, sede) {
    const sedeActualizada = await this.sedeRepository.update(id, sede);

    if (!sedeActualizada) {
      throw new NotFoundError(`No se encontró la sede con ID ${id}`);
    }

    return SedeMapper.toDTO(sedeActualizada);
  }
  async delete(id) {
    const sedeEliminada = await this.sedeRepository.delete(id);

    if (!sedeEliminada) {
      throw new NotFoundError(`No se encontró la sede con ID ${id}`);
    }

    return SedeMapper.toDTO(sedeEliminada);
  }

  async findById(id) {
    const sede = await this.sedeRepository.findById(id);

    if (!sede) {
      throw new NotFoundError(`No se encontró la sede con ID ${id}`);
    }

    return SedeMapper.toDTO(sede);
  }

  async findEntityById(id) {
    const sede = await this.sedeRepository.findById(id);
    if (!sede) {
      throw new NotFoundError(`No se encontró la sede con ID ${id}`);
    }

    return sede;
  }

  async findByName(nombre) {
    const sede = await this.sedeRepository.findByName(nombre);

    if (!sede) {
      throw new NotFoundError(`No se encontró la sede con nombre ${nombre}`);
    }

    return SedeMapper.toDTO(sede);
  }


}
