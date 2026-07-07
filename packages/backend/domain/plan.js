import { CoberturaEspecialidad } from "./coberturas/coberturaEspecialidad.js";
import { CoberturaPractica } from "./coberturas/coberturaPractica.js";
import { ErrorDatosObligatorios } from "../domain/errores.js";

export class Plan {
  id;
  nombre;
  coberturaEspecialidad = [];
  coberturaPractica = [];

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
    this.coberturaEspecialidad.push(coberturaEspecialidad);
  }

  agregarCoberturaPractica(coberturaPractica) {
    if (!(coberturaPractica instanceof CoberturaPractica)) {
      throw new Error("Cobertura de práctica inválida");
    }
    this.coberturaPractica.push(coberturaPractica);
  }

  eliminarCoberturaEspecialidad(coberturaEspecialidadAEliminar) {
    if (!coberturaEspecialidadAEliminar) { throw new Error("Cobertura de especialidad invalida"); }
    this.coberturaEspecialidad = this.coberturaEspecialidad.filter(cobertura => cobertura.id !== coberturaEspecialidadAEliminar.id);
  }
  eliminarCoberturaPractica(coberturaPracticaAEliminar) {
    if (!coberturaPracticaAEliminar) { throw new Error("Cobertura de practica invalida"); }
    this.coberturaPractica = this.coberturaPractica.filter(cobertura => cobertura.id !== coberturaPracticaAEliminar.id);
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
    const cobertura = this.coberturaEspecialidad.find(
      (ce) => (ce.especialidad.id ?? ce.especialidad) === especialidadId,
    );
    return cobertura ? { nivel: cobertura.nivel, porcentaje: cobertura.porcentajeCobertura } : null;
  }
  obtenerCoberturaPractica(practica) {
    const cobertura = this.coberturaPractica.find(
      (cp) => cp.practica === practica,
    );
    return cobertura ? { nivel: cobertura.nivel, porcentaje: cobertura.porcentajeCobertura } : null;
  }*/

    obtenerCoberturaServicio(servicio) {
    const servicioId = (servicio?._id || servicio?.id || servicio).toString();
    const especialidadPadreId = servicio?.especialidadPadreId?.toString();

    const listaEspecialidades = this.coberturaEspecialidad || [];
    const listaPracticas = this.coberturaPractica || [];

    // Buscamos primero en prácticas (es más específico)
    const coberturaPrac = listaPracticas.find((cp) => {
      const idRef = (cp.practica?._id || cp.practica?.id || cp.practica).toString();
      return idRef === servicioId;
    });

    if (coberturaPrac) return { nivel: coberturaPrac.nivel, porcentaje: coberturaPrac.porcentajeCobertura };

    // Si no está en prácticas, buscamos en especialidades.
    // La especialidad a chequear puede ser el mismo servicioId (si el servicio es una Especialidad)
    // o el especialidadPadreId (si el servicio es una Práctica).
    const idEspecialidadABuscar = especialidadPadreId || servicioId;

    const coberturaEsp = listaEspecialidades.find((ce) => {
      const idRef = (ce.especialidad?._id || ce.especialidad?.id || ce.especialidad).toString();
      return idRef === idEspecialidadABuscar;
    });

    if (coberturaEsp) return { nivel: coberturaEsp.nivel, porcentaje: coberturaEsp.porcentajeCobertura };

    // Si no se encontró
    return { nivel: "NO_CUBIERTA", porcentaje: 0 };
  }
}