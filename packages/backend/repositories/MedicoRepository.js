import {MedicoModel} from "../schemas/dataBase/medicoSchema.js"



export class MedicoRepository {
    constructor() {
        this.model = MedicoModel;
    }
}