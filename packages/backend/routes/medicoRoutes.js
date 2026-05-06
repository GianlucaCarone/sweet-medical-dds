import express from 'express';
import { MedicoController } from '../controllers/MedicoController.js';

const router = express.Router();
const medicoController = new MedicoController();

router.route('/')
    .get((req, res, next) => medicoController.findAll(req, res, next))
    .post((req, res, next) => medicoController.create(req, res, next));

router.route('/:id/disponibilidad')
    .post((req, res, next) => medicoController.definirDisponibilidad(req, res, next));


router.route('/seed')
    .get((req, res, next) => medicoController.seed(req, res, next));

export default router;