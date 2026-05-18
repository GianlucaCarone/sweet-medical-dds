import { PacienteService } from "../services/PacienteService.js";
import { logger } from "../config/logger.js";

export class MedicoController {
    constructor({ pacienteService = new PacienteService() } = {}) {
        this.pcienteService = pacienteService;
    }

    create = async (req, res, next) => {
        try {

        } catch (error) {
            next(error);
        }
    };

    findAll = async (req, res, next) => {
        try {

        } catch (error) {
            next(error);
        }
    };

    findById = async (req, res, next) => {
        try {

        } catch (error) {
            return next(error);
        }
    };

    delete = async (req, res, next) => {
        try {

        } catch (error) {
            return next(error);
        }
    };
}