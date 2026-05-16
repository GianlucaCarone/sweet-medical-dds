import express from "express";
import { NotificacionController } from "../controllers/NotificacionController.js";

export default function notificacionRoutes(getController) {
    const router = express.Router({ mergeParams: true });
    const notificacionController = getController(NotificacionController);

    router.route("/leidas").get((req, res, next) => notificacionController.getLeidas(req, res, next));
    //router.route("/leidas-paginadas").get((req, res, next) => notificacionController.getLeidasPaginadas(req, res, next));
    router.route("/no-leidas").get((req, res, next) => notificacionController.getNoLeidas(req, res, next));
    //router.route("/no-leidas-paginadas").get((req, res, next) => notificacionController.getNoLeidasPaginadas(req, res, next));
    router.route("/:idNotificacion/leer").patch((req, res, next) => notificacionController.leer(req, res, next));

    return router;
}