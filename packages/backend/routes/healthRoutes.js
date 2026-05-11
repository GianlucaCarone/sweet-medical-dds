import express from "express";

const healthPath = "/health";

export default function healthRoutes(_getController) {
    const router = express.Router();
    router.get(healthPath, (req, res) => {
        res.status(200).json({
            status: "ok",
            message: "El servicio está funcionando correctamente",
        });
    });
    return router;
}