import express from 'express';
import { TurnoController } from '../controllers/TurnoController.js';

const turnoController = new TurnoController();
const router = express.Router();


router.route('/')
    .get((req, res, next) => turnoController.findAllPaginated(req, res, next))
    .post((req, res, next) => turnoController.create(req, res, next));

router.route('/:id/asignar')
    .put((req, res, next) => turnoController.asignarTurno(req, res, next))

router.route('/:id/cambiar-estado')
    .patch((req, res, next) => turnoController.cambiarEstadoTurno(req, res, next))

export default router;