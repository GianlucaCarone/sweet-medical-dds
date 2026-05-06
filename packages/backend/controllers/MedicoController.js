import {MedicoService} from '../services/MedicoService.js';
import { medicoSchema, disponibilidadSchema, medicoIdParamsSchema } from '../schemas/medicoSchema.js';
import { idParamNumberSchema } from '../schemas/urlSchema.js';


export class MedicoController {
  constructor({ medicoService = new MedicoService() } = {}) {
    this.medicoService = medicoService;
  }

  create = async (req, res, next) => {
   
    try {
      const medicoData = medicoSchema.parse(req.body);
      const nuevoMedico = await this.medicoService.create(medicoData);
      res.status(201).json(nuevoMedico);
    } catch (error) {
      next(error);
    }
  }

  findById = async (req, res, next) => {
    try {
        const { id } = idParamNumberSchema.parse(req.params);
        const medico = await this.medicoService.getById(id);

        if (!medico) {
            return res.status(404).json({ message: "Médico no encontrado" });
            }
        
        res.status(200).json(medico);
        } catch (error) {
        return next(error);
        }
    }

  definirDisponibilidad = async (req, res, next) => {
    try{
        const { id } = idParamNumberSchema.parse(req.params);

        const disponibilidadData = disponibilidadSchema.parse(req.body);
        const disponibilidadActualizada = await this.medicoService.definirDisponibilidadPara(disponibilidadData, id);

        return res.status(201).json({
            status: "success",
            data: disponibilidadActualizada
        });

    }catch(error){
        return next(error)
    }
  }

    parsearId(idParam) {
        if (typeof idParam !== "string" || idParam.trim().length === 0) {
            throw new Error("id inválido");
        }
        return idParam;
    }

    seed = async (req, res, next) => {
        try {
          const MEDICOS_INICIALES =  [
            {
              id: "1",
              nombre: "Dr. Juan Pérez",
              usuario: {
                id: "1",
                nombreUsuario: "juanperez",
                password: "password123"
              },
              matricula: "1234567890",
              disponibilidad: []
            },
            {
              id: "2",
              nombre: "Dra. María Gómez",
              usuario: {
                id: "2",
                nombreUsuario: "mariagomez",
                password: "password456"
              },
              matricula: "0987654321",
              disponibilidad: []
            }
          ];

          this.medicoService.crearMedicos(MEDICOS_INICIALES);

          res.status(201).json(MEDICOS_INICIALES);
        } catch (error) {
          next(error);
        }
      }
}