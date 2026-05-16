import { SedeRepository } from "../repositories/SedeRepository.js";
import { ConflictError, NotFoundError, UnprocessableEntityError } from "../errors/AppError.js";
import { Sede } from "../domain/sede.js";

export class SedeService {
  constructor({ sedeRepository = new SedeRepository() } = {}) {
    this.sedeRepository = sedeRepository;
  }

  toDTO(sede) {
    return {
      id: sede.id || sede._id, //validacion de if default de mongo
      nombre: sede.nombre,
      direccion: sede.direccion
    }
  }

  async findAll() {
    const sedes = await this.sedeRepository.findAll();
    if(sedes.length === 0) {
      throw new NotFoundError("No se encontró ninguna sede");
    }
    return sedes.map(sede => this.toDTO(sede));
  }

  async create(data) {
    const { nombre, direccion } = data

    if (!nombre || !direccion) {
      throw new UnprocessableEntityError("Datos incompletos para crear la sede")
    }

    const sedeExistente = await this.sedeRepository.findByName(nombre);
    if (sedeExistente) {
      throw new ConflictError("Ya existe una sede con ese nombre");
    }
    const sede = new Sede({ nombre, direccion });
    return this.toDTO(await this.sedeRepository.save(sede));
  }

  async update(id, sede) {
    const sedeActualizada = await this.sedeRepository.update(id, sede);

    if (!sedeActualizada) {
      throw new NotFoundError(`No se encontró la sede con ID ${id}`);
    }

      return this.toDTO(sedeActualizada);
  }
  async delete(id) {
    const sedeEliminada = await this.sedeRepository.delete(id);

    if (!sedeEliminada) {
      throw new NotFoundError(`No se encontró la sede con ID ${id}`);
    }

    return this.toDTO(sedeEliminada);
  }

  async findById(id) {
    const sede = await this.sedeRepository.findById(id);
    
    if (!sede) {
      throw new NotFoundError(`No se encontró la sede con ID ${id}`);
    }

    return this.toDTO(sede);
  }

  async findByName(nombre) {
    const sede = await this.sedeRepository.findByName(nombre);

    if (!sede) {
      throw new NotFoundError(`No se encontró la sede con nombre ${nombre}`);
    }

    return this.toDTO(sede);
  }


}
