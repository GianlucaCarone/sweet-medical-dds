import { Router } from "express";
import { ObraSocialController } from "../controllers/ObraSocialController";

export default function obraSocialRoutes(getController) {
    const router = new Router();
    /**@type {InstanceType<typeof ObraSocialController>} */
    const obraSocialController = getController(ObraSocialController);

    router.route("/")
        .get((req, res, next) => obraSocialController.buscarTodos(req, res, next))
        .post((req, res, next) => obraSocialController.crear(req, res, next))
        
    router.route("/:obraSocialId")
        .get((req, res, next) => obraSocialController.buscar(req, res, next))
        .put((req, res, next) => obraSocialController.actualizar(req, res, next))
        .delete((req, res, next) => obraSocialController.eliminar(req, res, next))
    
    router.route("/:obraSocialId/plan")
        .get((req, res, next) => obraSocialController.findAllPaginated(req, res, next))
        .post((req, res, next) => obraSocialController.findAllPaginated(req, res, next))

    router.route("/:obraSocialId/plan/:planId")
        .get((req, res, next) => obraSocialController.buscarPlan(req, res, next))
        .put((req, res, next) => obraSocialController.actualizarPlan(req, res, next))
        .delete((req, res, next) => obraSocialController.eliminarPlan(req, res, next))
}