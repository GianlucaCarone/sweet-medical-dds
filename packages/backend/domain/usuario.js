export class Usuario{
    id;
    nombre;
    password;

    constructor({nombre,password}){
        if(!nombre||!password){
            throw new Error("Falta dato obligatorio")
        }
        this.nombre=nombre;
        this.password=password;
    }
}