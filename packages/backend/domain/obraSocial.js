export class ObraSocial {
    id;
    nombre;
    planes;

    constructor({nombre,planes}){
        if(!(planes instanceof Plan)){
            throw new Error("Plan invalido")
        }
        this.nombre=nombre;
        this.planes.push(planes);
    }
}