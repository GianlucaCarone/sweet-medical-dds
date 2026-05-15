import { CoberturaEspecialidad } from "./coberturas/coberturaEspecialidad.js";
import { CoberturaPractica } from "./coberturas/coberturaPractica.js";
import { randomUUID } from "crypto";
import { ErrorDatosObligatorios } from "./errores.js";

export class Plan {
  id;
  nombre;
  coberturasEspecialidad = [];
  coberturasPractica = [];

  constructor({ nombre }) {
    if (!nombre) {
      throw new ErrorDatosObligatorios();
    }
    this.id = randomUUID();
    this.nombre = nombre;
  }

  agregarCoberturaEspecialidad(coberturaEspecialidad) {
    if (!(coberturaEspecialidad instanceof CoberturaEspecialidad)) {
      throw new Error("Cobertura de especialidad inválida");
    }
    this.coberturasEspecialidad.push(coberturaEspecialidad);
  }

  agregarCoberturaPractica(coberturaPractica) {
    if (!(coberturaPractica instanceof CoberturaPractica)) {
      throw new Error("Cobertura de práctica inválida");
    }
    this.coberturasPractica.push(coberturaPractica);
  }

  eliminarCoberturaEspecialidad(coberturaEspecialidadAEliminar) {
    if (!coberturaEspecialidadAEliminar) { throw new Error("Cobertura de especialidad invalida"); }
    this.coberturasEspecialidad = this.coberturasEspecialidad.filter(cobertura => cobertura.id !== coberturaEspecialidadAEliminar.id);
  }
  eliminarCoberturaPractica(coberturaPracticaAEliminar) {
    if (!coberturaPracticaAEliminar) { throw new Error("Cobertura de practica invalida"); }
    this.coberturasPractica = this.coberturasPractica.filter(cobertura => cobertura.id !== coberturaPracticaAEliminar.id);
  }

  // TODO se podria usar polimorfismo segun el tipo de cobertura.
  // Ejemplo: obtenerCobertura(servicio) y que internamente sepa si es una especialidad o practica y busque en el array correspondiente.
  // Esto evitaria tener dos metodos distintos para cada tipo de cobertura.
  // Preguntar: se puede usar polimorfismo en este caso? Con un if si el servicio es de un tipo u otro
  obtenerCoberturaEspecialidad(especialidad) {
    const cobertura = this.coberturasEspecialidad.find(
      (ce) => ce.especialidad === especialidad,
    );
    return cobertura ? cobertura.nivel : null;
  }
  obtenerCoberturaPractica(practica) {
    const cobertura = this.coberturasPractica.find(
      (cp) => cp.practica === practica,
    );
    return cobertura ? cobertura.nivel : null;
  }
}