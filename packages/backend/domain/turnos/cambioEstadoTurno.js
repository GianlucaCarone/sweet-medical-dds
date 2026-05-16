import { ErrorDatosObligatorios } from "../../domain/errores.js";
import { Usuario } from "../usuario.js";
import { Turno } from "./turno.js";
import { EstadoTurnoEnum } from "./estadoTurnoEnum.js";

//@ts-check
export class CambioEstadoTurno{
    fechaHoraIngreso; 
    estado;
    turno;
    usuario;   
    motivo;

    constructor({estado,usuario,turno,motivo}){
        if(!estado || !usuario || !turno || !motivo){
            throw new ErrorDatosObligatorios();
        }
        if(!(usuario instanceof Usuario)) {
            throw new Error("Usuario inválido");
        }
        if(!(motivo instanceof String)) {
            throw new Error("Motivo inválido");
        }
        if (!Object.values(EstadoTurnoEnum).includes(estado)) {
            throw new Error("No existe ese estado");
        }
        if (!(turno instanceof Turno)){
            throw new Error("Turno inválido");
        }
        this.estado=estado;
        this.turno=turno;
        this.usuario=usuario;
        this.motivo=motivo;
        this.fechaHoraIngreso=Date.now();
    }
}