
export class MedicoRepository {
  constructor() {
    this.medicos = {};
    this.nextId = 1;
  }

  findById(id) {
    return this.medicos[id] ?? null;
  }

  save(medico) {
    const id = medico.id ?? this.nextId++
    medico.id = id;
    this.medicos[id] = medico;
    return medico;
  }
}