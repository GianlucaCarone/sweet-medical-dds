import express from "express";
import { ServicioController } from "../controllers/ServicioController.js";

export default function servicioRoutes(getController) {
    const router = express.Router();
    const servicioController = getController(ServicioController);

    router.route("/").post((req, res, next) => servicioController.create(req, res, next));
    router.route("/:id").put((req, res, next) => servicioController.update(req, res, next))
        .delete((req, res, next) => servicioController.delete(req, res, next));

    return router;
}