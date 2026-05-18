import express from "express";
import { UsuarioController } from "../controllers/UsuarioController.js";
import notificacionRoutes from "./notificacionRoutes.js";

export default function usuarioRoutes(getController) {
  const router = express.Router();
  const usuarioController = getController(UsuarioController);

  router
    .route("/")
    .get((req, res, next) => usuarioController.findAll(req, res, next))
    .post((req, res, next) => usuarioController.create(req, res, next));

  router
    .route("/:id")
    .get((req, res, next) => usuarioController.findById(req, res, next))
    .delete((req, res, next) => usuarioController.delete(req, res, next))
    .put((req, res, next) => usuarioController.update(req, res, next));

  router.use("/:idUsuario/notificaciones", notificacionRoutes(getController));

  return router;
}
