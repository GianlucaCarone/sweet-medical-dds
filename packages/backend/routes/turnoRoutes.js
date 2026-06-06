import express from "express";
import { TurnoController } from "../controllers/TurnoController.js";

export default function turnoRoutes(getController) {
    const router = express.Router();
    const turnoController = getController(TurnoController);

    router.route("/")
        .get((req, res, next) => turnoController.findAllPaginated(req, res, next))
        .post((req, res, next) => turnoController.create(req, res, next));

    router.route("/:id/asignar")
        .put((req, res, next) => turnoController.asignarTurno(req, res, next));

    router.route("/:id/cambiar-estado")
        .patch((req, res, next) => turnoController.cambiarEstadoTurno(req, res, next));

    router.route("/:id/solicitar-cambio-fecha")
        .patch((req, res, next) => turnoController.solicitarCambioFecha(req, res, next));

    router.route("/:id/responder-cambio-fecha")
        .patch((req, res, next) => turnoController.responderCambioFecha(req, res, next));

    router.route("/estado/:estadoId")
        .get((req, res, next) => turnoController.findByEstado(req, res, next));

    router.route("/:id")
        .get((req, res, next) => turnoController.findById(req, res, next))
        .patch((req, res, next) => turnoController.update(req, res, next));
    
    router.route("/mis-turnos")
        .get((req, res, next) => turnoController.findAllPaginatedByUsuario(req, res, next));

    return router;
}
