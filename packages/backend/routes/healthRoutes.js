import express from "express";

export default function healthRoutes(_getController) {
    const router = express.Router();
    router.get("", (req, res) => {
        res.status(200).json({
            status: "ok",
            message: "El servicio está funcionando correctamente",
        });
    });
    return router;
}