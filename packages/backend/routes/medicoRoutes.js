import express from "express";
import { MedicoController } from "../controllers/MedicoController.js";

export default function medicoRoutes(getController) {
  const router = express.Router();
  const medicoController = getController(MedicoController);

  router.route("/:id/servicios")
    .get((req, res, next) => medicoController.getServicios(req, res, next))
    .post((req, res, next) => medicoController.agregarServicio(req, res, next)) // agrego un servicio al medico
    .delete((req, res, next) => medicoController.eliminarServicio(req, res, next)); // Eliminar servicio existente del medico
      
  return router;
}