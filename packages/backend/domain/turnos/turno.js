export class Turno{
    id;
    medico;
    paciente;
    fechaHora;
    sede;
    practica;
    estado;
    historialEstado;
    costo;

    constructor({medico,paciente,fechaHora,sede,practica}){

        if(!medico||!paciente||!sede||!practica){
            throw new Error("Faltan datos obligatorios")
        }

        this.medico=medico;
        this.paciente=paciente;
        this.fechaHora=fechaHora;
        this.sede=sede;
        this.practica=practica;

        this.estado = EstadoTurno.DISPONIBLE;
        this.historialEstado = [EstadoTurno.DISPONIBLE];
    }

    cambiarEstado(estadoTurno){
        if(!(estadoTurno instanceof EstadoTurno)){
            throw new Error("No existe ese estado")
        }
        this.estado=estadoTurno;
        this.historialEstado.push(estadoTurno);
    }
    
}