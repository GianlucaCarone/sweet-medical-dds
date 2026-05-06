import express from 'express';
import { TurnoController } from '../controllers/TurnoController.js';

const turnoController = new TurnoController();
const router = express.Router();


router.route('/')
    .get((req, res, next) => turnoController.findAll(req, res, next))
    .post((req, res, next) => turnoController.create(req, res, next));

export default router;