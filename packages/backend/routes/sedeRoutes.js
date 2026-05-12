import express from "express";
import { SedeController } from "../controllers/SedeController.js";

export default function sedeRoutes(getController) {
    const router = express.Router();
    const sedeController = getController(SedeController);

    router.route("/")
        .get((req, res, next) => sedeController.findAll(req, res, next))
        .post((req, res, next) => sedeController.create(req, res, next));
    
    return router;
}
