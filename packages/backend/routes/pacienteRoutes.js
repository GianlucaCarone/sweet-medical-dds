import express from "express";
import { PacienteController } from "../controllers/PacienteController.js";

export default function medicoRoutes(getController) {
    const router = express.Router();
    const pacienteController = getController(PacienteController);

    router.route("/")
        .get((req, res, next) => pacienteController.findAll(req, res, next))
        .post((req, res, next) => pacienteController.create(req, res, next));

    return router;
}