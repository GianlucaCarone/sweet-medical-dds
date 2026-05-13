import { MedicoService } from "../services/MedicoService";
import { medicoIdParamsSchema, servicioIdSchema } from "../schemas/dto/medicoSchema";

export class MedicoController {
    constructor({ 
        medicoService = new MedicoService() 
        } = {}) {
        this.medicoService = medicoService;
    }

    agregarServicio = async (req, res, next) => {
        try {
            const idMedico = medicoIdParamsSchema.parse(req.params);
            const idServicio = servicioIdSchema.parse(req.body);
            const medico = this.medicoService.agregarServicioPara(idMedico, idServicio);
            res.status(200).json( {
                status: "success",
                data: medico
            });
        } catch (error) {
            next(error);
        }
    };

    eliminarServicio = async (req, res, next) => {
        try {
            const idMedico = medicoIdParamsSchema.parse(req.params);
            const idServicio = servicioIdSchema.parse(req.body);
            const medico = this.medicoService.eliminarServicioPara(idMedico, idServicio);
            res.status(200).json( {
                status: "success",
                data: medico
            });
        } catch (error) {
            next(error);
        }
    };

    // 2. El segundo seed. Previamente, se craearon los usuarios con otro seed, y usando aquellos, crea los medicos correspondientes
    async seed (usuarios) {
        // Crear médicos usando el usuario del sistema (para nuestro test, usamos uno solo)
        const medicos = [
          {
            nombre: "Dra. María Gómez",
            usuarioId: usuarios[1].id,
            matricula: "0987654321"
          }
        ];
      
        return this.medicoService.crearMedicos(medicos);
    };
}