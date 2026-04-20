import { CoberturaEspecialidad } from "./coberturas/coberturaEspecialidad";
import { CoberturaPractica } from "./coberturas/coberturaPractica";

export class Plan {
  id;
  nombre;
  coberturasEspecialidad = [];
  coberturasPractica = [];

  constructor({
    nombre,
    coberturasEspecialidad = [],
    coberturasPractica = [],
  }) {
    if (!nombre) {
      throw new ErrorDatosObligatorios();
    }
    if (
      !Array.isArray(coberturasEspecialidad) ||
      !coberturasEspecialidad.every((c) => c instanceof CoberturaEspecialidad)
    ) {
      //Se verifica que sea array y que ademas todos los elemenos sean instancia de la clase CoberturaEspecialidad
      throw new Error("Cobertura de especialidad inválida");
    }
    if (
      !Array.isArray(coberturasPractica) ||
      !coberturasPractica.every((c) => c instanceof CoberturaPractica)
    ) {
      //Se verifica que sea array y que ademas todos los elemenos sean instancia de la clase CoberturaPractica
      throw new Error("Cobertura de práctica inválida");
    }
    this.nombre = nombre;
    this.coberturasEspecialidad = coberturasEspecialidad;
    this.coberturasPractica = coberturasPractica;
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