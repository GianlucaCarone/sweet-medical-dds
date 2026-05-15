import express from "express";
import { NotificacionesController } from "../controllers/notificacionesController.js";

export default function notificacionesRoutes(getController) {
    const router = express.Router();
    const notificacionesController = getController(NotificacionesController);

    router.route("/leidas").get((req, res, next) => notificacionesController.getLeidas(req, res, next));
    router.route("/leidas-paginadas").get((req, res, next) => notificacionesController.getLeidasPaginadas(req, res, next));
    router.route("/no-leidas").get((req, res, next) => notificacionesController.getNoLeidas(req, res, next));
    router.route("/no-leidas-paginadas").get((req, res, next) => notificacionesController.getNoLeidasPaginadas(req, res, next));
    router.route("/").post((req, res, next) => notificacionesController.crearNotificacion(req, res, next));
    router.route("/:idNotificacion").patch((req, res, next) => notificacionesController.leer(req, res, next));

    return router;
}