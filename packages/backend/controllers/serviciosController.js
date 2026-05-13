import { ServiciosService } from "../services/serviciosService";
import { servicioSchema, servicioIdParamsSchema } from "../schemas/dto/servicioSchema";

export class ServiciosController {
    constructor ({ 
        serviciosService = new ServiciosService () 
        } = {}) {
        this.serviciosService = serviciosService;
    }

    create = async (req, res, next) => { //servicioSchema
        try {
            const datosServicio = servicioSchema.parse(req.body);
            const servicio = await this.serviciosService.create(datosServicio);
            res.status(201).json( {
                status: "success",
                data: servicio
            });
        } catch (error) {
            next(error);
        }
    };

    update = async (req, res, next) => { //idSchema y servicioSchema
        try {
            const { idServicio } = servicioIdParamsSchema.parse(req.params);
            const datosServicio = servicioSchema.parse(req.body);
            const servicio = await this.serviciosService.update(idServicio, datosServicio);
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
            this.serviciosService.delete(idServicio);
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
                duracacionEnMin: 60,
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

        return servicios.map(s => this.serviciosService.crearEntidad(s));
    }
}