import express from "express";
import { SedeController } from "../controllers/SedeController.js";

const sedePath = "/sede";

export default function sedeRoutes(getController) {
    const router = express.Router();
    const sedeController = getController(SedeController);

    router.route(sedePath)
        .get((req, res, next) => sedeController.findAll(req, res, next))
        .post((req, res, next) => sedeController.create(req, res, next));
    
    return router;
}
