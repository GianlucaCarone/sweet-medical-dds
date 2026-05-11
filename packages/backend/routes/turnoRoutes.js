import express from "express";
import { TurnoController } from "../controllers/TurnoController.js";

const turnoPath = "/turno";

export default function turnoRoutes(getController) {
    const router = express.Router();
    const turnoController = getController(TurnoController);
    
    router.route(turnoPath)
        .get((req, res, next) => turnoController.findAll(req, res, next))
        .post((req, res, next) => turnoController.create(req, res, next));
    
    router.route(turnoPath + "/:id/asignar")
        .put((req, res, next) => turnoController.asignarTurno(req, res, next));

    router.route(turnoPath + "/:id/cambiar-estado")
        .patch((req, res, next) => turnoController.cambiarEstadoTurno(req, res, next));
    
    return router;
}
