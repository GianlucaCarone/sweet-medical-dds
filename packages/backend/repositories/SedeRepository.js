import { Sede } from "../domain/sede.js";

export class SedeRepository {
  constructor() {
    // TODO cambiar por base de datos
    this.sedes = {};
    this.nextId = 1;
  }

  findAll() {
    return Object.values(this.sedes);
  }

  save(sede) {
    const id = sede.id ?? this.nextId++;
    sede.id = id;
    this.sedes[id] = sede;

    return sede;
  }
}
