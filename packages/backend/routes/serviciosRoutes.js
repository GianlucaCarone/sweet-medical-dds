import express from "express";
import { ServiciosController } from "../controllers/serviciosController.js";

export default function serviciosRoutes(getController) {
    const router = express.Router();
    const serviciosController = getController(ServiciosController);

    router.route("/").post((req, res, next) => serviciosController.create(req, res, next));
    router.route("/:id").put((req, res, next) => serviciosController.update(req, res, next))
            .delete((req, res, next) => serviciosController.delete(req, res, next));

    return router;
}