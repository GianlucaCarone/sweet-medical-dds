import express from "express";
import { NotificacionesController } from "../controllers/NotificacionesController"; 

const router = express.Router();
const notificacionesController = new NotificacionesController();

router.route("notificaciones/leidos")
    .get((req, res, next) => notificacionesController.getLeidos(req, res, next));

router.route("notificaciones/no-leidos")
    .get((req, res, next) => notificacionesController.getNoLeidos(req, res, next));

router.route("notificaciones")
    .post((req, res, next) => notificacionesController.crearNotificacion(req, res, next));

router.route("notificaciones/:idNotificacion")
    .patch((req, res, next) => notificacionesController.leer(req, res, next));

export default router;