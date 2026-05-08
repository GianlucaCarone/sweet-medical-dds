// TODO Completar con los routers cuando este hecho el controller
import express from 'express';
import { SedeController } from '../controllers/SedeController.js';
import sedeRouter from './sedeRoutes.js';

const router = express.Router();

router.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "El servicio está funcionando correctamente",
  });
})

router.use('/sede', sedeRouter);

router.use('/turno', turnoRouter);


export default router