import {SedeService} from "../services/sedeService.js";

export class SedeController {
    constructor({ sedeService = new SedeService() } = {}) {
        this.sedeService = sedeService;
    }

    findAll = async (req, res, next) => {
        try {
            const sedes = await this.sedeService.findAll();
            res.status(200).json( {
                status: "success",
                data: sedes
            });
        } catch (error) {
            next(error);
        }
    };

    create = async (req, res, next) => {
        try {
            const sede = await this.sedeService.create(req.body);
            res.status(201).json( {
                status: "success",
                data: sede
            });
        } catch (error) {
            next(error);
        }
    };
}
