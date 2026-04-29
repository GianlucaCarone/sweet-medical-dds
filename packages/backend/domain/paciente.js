import { Plan } from "./plan";
import { ObraSocial } from "./obraSocial"
import { randomUUID } from "crypto";

export class Paciente {
    id;
    usuario;
    dni;
    nombre;
    obraSocial;
    plan;

    constructor({ usuario, dni, nombre }) {
        if (!usuario || !dni || !nombre) {
            throw new ErrorDatosObligatorios();
        }
        if (!(obraSocial instanceof ObraSocial)) {
            throw new Error("Obra social inválida");
        }
        if (!(plan instanceof Plan)) {
            throw new Error("Plan inválido");
        }
        this.id = randomUUID();
        this.usuario = usuario;
        this.dni = dni;
        this.nombre = nombre;
    }


    asignarObraSocial(obraSocial) {
        if (!obraSocial instanceof ObraSocial) { throw new Error("Obra social inválida"); }
        this.obraSocial = obraSocial;
    }

    asignarPlan(plan) {
        if (!plan instanceof Plan) { throw new Error("Plan inválido"); }
        this.plan = plan;
    }

}