import express from 'express';
import { ServiciosController } from '../controllers/serviciosController';

const router = express.Router();
const servicioController = new serviciosController();

router.route('/servicios')
    .post((req, res, next) => serviciosController.create(req, res, next));

router.route('/servicios/:id')
    .put((req, res, next) => serviciosController.update(req, res, next))
    .delete((req, res, next) => serviciosController.delete(req, res, next))

export default router;