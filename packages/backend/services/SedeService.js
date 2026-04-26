import { SedeRepository } from "../repositories/SedeRepository.js";

export class SedeService {
  constructor({ sedeRepository = new SedeRepository() } = {}) {
    this.sedeRepository = sedeRepository;
  }

  findAll() {
    return this.sedeRepository.findAll();
  }

  create(sede) {
    return this.sedeRepository.save(sede);
  }
}
