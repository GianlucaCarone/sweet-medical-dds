import express from "express";
import { MedicoController } from "../controllers/MedicoController.js";


export default function medicoRoutes(getController) {
  const router = express.Router();
  const medicoController = getController(MedicoController);

  router.route("/")
      .get((req, res, next) => medicoController.findAll(req, res, next))
      .post((req, res, next) => medicoController.create(req, res, next));
      
  router.route("/seed")
      .get((req, res, next) => medicoController.seed(req, res, next));

  router.route("/:id/disponibilidades")
      .get((req, res, next) => medicoController.consultarDisponibilidad(req, res, next)) // Puede ser que no vaya asi esto.
      .post((req, res, next) => medicoController.definirDisponibilidad(req, res, next)) // agrego una disponibilidad al medico
      .put((req, res, next) => medicoController.modificarDisponibilidad(req, res, next)) // Reemplazar disponibilidad existente del medico
      .delete((req, res, next) =>medicoController.eliminarDisponibilidad(req, res, next)); // Eliminar disponibilidad existente del medico

  router.route("/:id")
    .get((req, res, next) => medicoController.findById(req, res, next))
    .delete((req, res, next) => medicoController.delete(req, res, next))
    .put((req, res, next) => medicoController.update(req, res, next));

  router.route("/:id/sedes")
    .post((req, res, next) => medicoController.agregarSede(req, res, next));

  router.route("/:id/sedes/:sedeId")
    .delete((req, res, next) => medicoController.eliminarSede(req, res, next));

  router.route("/:id/servicios")
    .get((req, res, next) => medicoController.getServicios(req, res, next))
    .post((req, res, next) => medicoController.agregarServicio(req, res, next)) // agrego un servicio al medico
    .delete((req, res, next) => medicoController.eliminarServicio(req, res, next)); // Eliminar servicio existente del medico
      

  return router;
}