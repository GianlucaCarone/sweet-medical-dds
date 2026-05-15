import { ServiciosService } from "../services/serviciosService.js";
import { servicioSchema, servicioIdParamsSchema } from "../schemas/servicioSchema.js";
import { logger } from '../config/logger.js'; 

export class ServiciosController {
    constructor ({ 
        serviciosService = new ServiciosService () 
    } = {}) {
        this.serviciosService = serviciosService;
    }

    create = async (req, res, next) => {
        try {
            const datosServicio = servicioSchema.parse(req.body);
            logger.info("[SERVICIOS CONTROLLER]: Creando servicio: ", datosServicio);
            const servicio = await this.serviciosService.create(datosServicio);
            logger.info("[SERVICIOS CONTROLLER]: Servicio creado:", servicio);
            res.status(201).json( {
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
            const servicio = await this.serviciosService.update(idServicio, datosServicio);
            logger.info("[SERVICIOS CONTROLLER]: Servicio actualizado: ", servicio);
            res.status(200).json( {
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
            logger.info("[SERVICIOS CONTROLLER]: Eliminando servicio: ", idServicio)
            this.serviciosService.delete(idServicio);
            logger.info("[SERVICIOS CONTROLLER]: Servicio eliminado");
            res.status(204).json( {
                status: "success"
            });
        } catch (error) {
            next(error);
        }
    };

    async seed () {
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

        return servicios.map(s => this.serviciosService.create(s));
    }
}