import express from "express";
import { SedeController } from "../controllers/SedeController.js";

export default function sedeRoutes(getController) {
    const router = express.Router();
    const sedeController = getController(SedeController);

    router.route("/")
        .get((req, res, next) => sedeController.findAll(req, res, next))
        .post((req, res, next) => sedeController.create(req, res, next));

    router.route("/:id")
        .get((req, res, next) => sedeController.findById(req, res, next))
        .put((req, res, next) => sedeController.update(req, res, next))
        .delete((req, res, next) => sedeController.delete(req, res, next));

    router.route("/:nombre")
        .get((req, res, next) => sedeController.findByName(req, res, next));
    
    return router;
}
