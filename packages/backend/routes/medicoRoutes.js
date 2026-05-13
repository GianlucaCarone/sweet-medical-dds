import express from 'express';
import { MedicoController } from '../controllers/MedicoController.js';

const router = express.Router();
const medicoController = new MedicoController();

router.route('/')
    .get((req, res, next) => medicoController.findAll(req, res, next))
    .post((req, res, next) => medicoController.create(req, res, next));

router.route('/:id/disponibilidad')
    .get((req, res, next) => medicoController.consultarDisponibilidad(req, res, next)) // Puede ser que no vaya asi esto.
    .post((req, res, next) => medicoController.definirDisponibilidad(req, res, next)) // agrego una disponibilidad al medico
    .put((req, res, next) => medicoController.modificarDisponibilidad(req, res, next)) // Reemplazar disponibilidad existente del medico
    .delete((req, res, next) =>medicoController.eliminarDisponibilidad(req, res, next)); // Eliminar disponibilidad existente del medico
  
router.route("/:id/sedes")
  .post((req, res, next) => medicoController.agregarSede(req, res, next));

router.route("/:id/sedes/:sedeId")
  .delete((req, res, next) => medicoController.eliminarSede(req, res, next));

router.route('/seed')
    .get((req, res, next) => medicoController.seed(req, res, next));

export default router;