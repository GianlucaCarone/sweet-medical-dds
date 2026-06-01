import { ErrorDatosObligatorios } from "../../domain/errores.js";
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
        if (typeof motivo !== "string") {
            throw new Error("Motivo inválido");
        }
        if (!Object.values(EstadoTurnoEnum).includes(estado)) {
            throw new Error("No existe ese estado");
        }
        this.estado = estado;
        this.turno = turno;
        this.usuario = usuario;
        this.motivo = motivo;
        this.fechaHoraIngreso = Date.now();
    }
}