import express from "express";
import { NotificacionesController } from "../controllers/NotificacionesController"; 

const router = express.Router();
const notificacionesController = new NotificacionesController();

router.route("/users/:idUsuario/notificaciones/:idNotificacion")
    .patch((req, res, next) => notificacionesController.leer(req, res, next));

router.route("/users/:idUsuario/notificaciones/leidos")
    .get((req, res, next) => notificacionesController.getLeidos(req, res, next));

router.route("/users/:idUsuario/notificaciones/no-leidos")
    .get((req, res, next) => notificacionesController.getNoLeidos(req, res, next));

export default router;


//export default function notificacionesRoutes (getController) {
//    const router = express.Router()
//    const controller = getController(NotificacionesController)
//
//    router.get("/users/:id-usuario/notificaciones/leidos", (req, res, next) => {
//        controller.getLeidos(req, res, next)
//    })
//
//    router.get("/users/:id-usuario/notificaciones/no-leidos", (req, res, next) => {
//        controller.getNoLeidos(req, res, next)
//    })
//
//    router.patch("/users/:id-usuario/notificaciones/:id-notificacion", (req, res, next) => {
//        controller.leer(req, res, next)
//    })
//
//    return router
//}