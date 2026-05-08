// TODO Completar con los routers cuando este hecho el controller
import express from 'express';
import sedeRouter from './sedeRoutes.js';
import medicoRouter from './medicoRoutes.js';
import usuarioRouter from './usuarioRoutes.js';

const router = express.Router();

router.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "El servicio está funcionando correctamente",
  });
})

router.use('/sedes', sedeRouter);
router.use('/medicos', medicoRouter);
router.use('/usuarios', usuarioRouter);


export default router