import {MedicoModel} from "../schemas/dataBase/medicoSchema"



export class MedicoRepository {
    constructor() {
        this.model = MedicoModel;
    }
}