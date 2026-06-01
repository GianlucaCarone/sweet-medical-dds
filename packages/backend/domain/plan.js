import { CoberturaEspecialidad } from "./coberturas/coberturaEspecialidad.js";
import { CoberturaPractica } from "./coberturas/coberturaPractica.js";
import { ErrorDatosObligatorios } from "../domain/errores.js";

export class Plan {
  id;
  nombre;
  coberturasEspecialidad = [];
  coberturasPractica = [];

  constructor({ nombre }) {
    if (!nombre) {
      throw new ErrorDatosObligatorios();
    }
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

  /*obtenerCoberturaServicio(servicio) {
    if (servicio instanceof Especialidad) {
      return this.obtenerCoberturaEspecialidad(servicio);
    }
    if (servicio instanceof Practica) {
      return this.obtenerCoberturaPractica(servicio);
    }
    throw new Error("Servicio inválido");
  }
  obtenerCoberturaEspecialidad(especialidadId) {
    const cobertura = this.coberturasEspecialidad.find(
      (ce) => (ce.especialidad.id ?? ce.especialidad) === especialidadId,
    );
    return cobertura ? { nivel: cobertura.nivel, porcentaje: cobertura.porcentajeCobertura } : null;
  }
  obtenerCoberturaPractica(practica) {
    const cobertura = this.coberturasPractica.find(
      (cp) => cp.practica === practica,
    );
    return cobertura ? { nivel: cobertura.nivel, porcentaje: cobertura.porcentajeCobertura } : null;
  }*/

    obtenerCoberturaServicio(servicio) {
    const servicioId = (servicio?._id || servicio?.id || servicio).toString();

    const listaEspecialidades = this.coberturaEspecialidad || this.coberturasEspecialidad || [];
    const listaPracticas = this.coberturaPractica || this.coberturasPractica || [];

    //Buscamos primero en especialidades.
    const coberturaEsp = listaEspecialidades.find((ce) => {
      const idRef = (ce.especialidad?._id || ce.especialidad?.id || ce.especialidad).toString();
      return idRef === servicioId;
    });

    if (coberturaEsp) return { nivel: coberturaEsp.nivel, porcentaje: coberturaEsp.porcentajeCobertura };

    //no estaba en especialidades, buscamos en prácticas
    const coberturaPrac = listaPracticas.find((cp) => {
      const idRef = (cp.practica?._id || cp.practica?.id || cp.practica).toString();
      return idRef === servicioId;
    });

    if (coberturaPrac) return { nivel: coberturaPrac.nivel, porcentaje: coberturaPrac.porcentajeCobertura };

    // 4. Si no se encontró
    return { nivel: "NO_CUBIERTA", porcentaje: 0 };
  }
}