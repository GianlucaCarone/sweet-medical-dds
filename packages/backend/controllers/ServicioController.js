import { ServicioService } from "../services/ServicioService.js";
import { servicioSchema, servicioIdParamsSchema } from "../schemas/zod/servicioSchema.js";
import { logger } from "../config/logger.js";

export class ServicioController {
    constructor({
        servicioService = new ServicioService()
    } = {}) {
        this.servicioService = servicioService;
    }

    create = async (req, res, next) => {
        try {
            const datosServicio = servicioSchema.parse(req.body);
            logger.info("[SERVICIOS CONTROLLER]: Creando servicio: ", datosServicio);
            const servicio = await this.servicioService.create(datosServicio);
            logger.info("[SERVICIOS CONTROLLER]: Servicio creado:", servicio);
            res.status(201).json({
                status: "success",
                data: servicio
            });
        } catch (error) {
            logger.error("No se pudo crear el servicio.");
            next(error);
        }
    };

    update = async (req, res, next) => {
        try {
            const { idServicio } = servicioIdParamsSchema.parse(req.params);
            const datosServicio = servicioSchema.parse(req.body);
            logger.info("[SERVICIOS CONTROLLER]: Actualizando servicio: ", datosServicio);
            const servicio = await this.servicioService.update(idServicio, datosServicio);
            logger.info("[SERVICIOS CONTROLLER]: Servicio actualizado: ", servicio);
            res.status(200).json({
                status: "success",
                data: servicio
            });
        } catch (error) {
            next(error);
        }
    };

    delete = async (req, res, next) => { //idSchema
        try {
            const { idServicio } = servicioIdParamsSchema.parse(req.params);
            logger.info("[SERVICIOS CONTROLLER]: Eliminando servicio: ", idServicio);
            await this.servicioService.delete(idServicio);
            logger.info("[SERVICIOS CONTROLLER]: Servicio eliminado");
            res.status(204).json({
                status: "success",
                message: "Servicio eliminado"
            });
        } catch (error) {
            next(error);
        }
    };

    async seed() {
        const servicios = [
            {
                nombre: "Cardiologia",
                duracionEnMin: 25,
                costo: 200,
                codigo: null
            },
            {
                nombre: "Biopsia endomiocárdica",
                duracionEnMin: 60,
                costo: 700,
                codigo: "#be347" //ni idea que es el codigo la verdad
            },
            {
                nombre: "Valvuloplastia percutánea",
                duracionEnMin: 75,
                costo: 650,
                codigo: "#vp150"
            }
        ];

        return await servicios.map(s => this.servicioService.create(s));
    }
}