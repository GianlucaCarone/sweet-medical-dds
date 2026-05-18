import { Router } from "express";
import { PacienteController } from "../controllers/PacienteController.js";

export function pacienteRoutes(getController) {
    const router = new Router();
    /**@type {InstanceType<typeof PacienteController>} */
    const pacienteController = getController(PacienteController);
    
    router.route("/")
        .get((req, res, next) => pacienteController.buscarTodos(req, res, next))
        .post((req, res, next) => pacienteController.crear(req, res, next))
        
    router.route("/:id")
        .get((req, res, next) => pacienteController.buscarPorId(req, res, next))
        .put((req, res, next) => pacienteController.modificar(req, res, next))
        .delete((req, res, next) => pacienteController.eliminar(req, res, next))

    return router;
}