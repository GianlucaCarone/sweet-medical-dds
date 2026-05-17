import { ObraSocialService } from "../services/ObraSocialService.js";

export class ObraSocialController {
    #obraSocialService;
    constructor(obraSocialService = new ObraSocialService()) {
        this.#obraSocialService = obraSocialService;
    }

    crear(req, res, next) {
        const { crearObraSocialDto } = req.body;
        try {
            const nuevaObraSocial = this.#obraSocialService.crear(crearObraSocialDto);
            res.status(200).json({ status: "success", data: nuevaObraSocial });
        } catch (error) {
            return next(error);
        }
    }
    buscarTodos(req, res, next) {
        try {
            const obrasSociales = this.#obraSocialService.buscarTodos();
            res.status(200).json({ status: "success", data: obrasSociales });
        } catch (error) {
            next(error);
        }
    }

    buscar(req, res, next) {
        const { obraSocialId } = req.params;
        try {
            const obraSocial = this.#obraSocialService.buscar(obraSocialId);
            res.status(200).json({ status: "success", data: obraSocial });
        } catch (error) {
            next(error);
        }
    }
    eliminar(req, res, next) {
        const { obraSocialId } = req.params;
        try {
            const obraSocialEliminada = this.#obraSocialService.eliminar(obraSocialId);
            res.status(200).json({ status: "success", data: obraSocialEliminada });
        } catch (error) {
            next(error);
        }
    }
    actualizar(req, res, next) {
        const { obraSocialId } = req.query;
        const { actualizarObraSocialDto } = req.body;
        try {
            const obraSocialActualizada = this.#obraSocialService.actualizar(obraSocialId, actualizarObraSocialDto);
            res.status(200).json({ status: "success", data: obraSocialActualizada });
        } catch (error) {
            next(error);
        }
    }

    crearPlan(req, res, next) {
        const { obraSocialId } = req.params;
        const { crearPlanDto } = req.body;
        try {
            const planObraSocialCreado = this.#obraSocialService.crearPlan(obraSocialId, crearPlanDto);
            res.status(200).json({ status: "success", data: planObraSocialCreado });
        } catch (error) {
            next(error);
        }
    }
    buscarTodosLosPlanes(req, res, next) {
        const { obraSocialId } = req.params;
        try {
            const planesObraSocial = this.#obraSocialService.buscarTodosLosPlanesDeObraSocial(obraSocialId);
            res.status(200).json({ status: "success", data: planesObraSocial });
        } catch (error) {
            next(error);
        }
    }

    eliminarPlan(req, res, next) {
        const { obraSocialId, planId } = req.params;
        try {
            const planObraSocialEliminado = this.#obraSocialService.eliminarPlanDeObraSocial(obraSocialId, planId);
            res.status(200).json({ status: "success", data: planObraSocialEliminado });
        } catch (error) {
            next(error);
        }
    }
    actualizarPlan(req, res, next) {
        const { obraSocialId, planId } = req.params;
        const { actualizarPlanDto } = req.body;
        try {
            const planObraSocialActualizado = this.#obraSocialService.actualizarPlanDeObraSocial(obraSocialId, planId, actualizarPlanDto);
            res.status(200).json({ status: "success", data: planObraSocialActualizado });
        } catch (error) {
            next(error);
        }
    }
    buscarPlan(req, res, next) {
        const { obraSocialId, planId } = req.params;
        try {
            const planObraSocialEncontrado = this.#obraSocialService.buscarPlanDeObraSocial(obraSocialId, planId);
            res.status(200).json({ status: "success", data: planObraSocialEncontrado });
        } catch (error) {
            next(error);
        }
    }
}