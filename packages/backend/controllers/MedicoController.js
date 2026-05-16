import { MedicoService } from "../services/MedicoService.js";
import {
  medicoSchema,
  disponibilidadSchema,
  eliminarDisponibilidadSchema,
} from "../schemas/zod/medicoSchema.js";
import { objectIdSchema } from "../schemas/zod/objectIdSchema.js";
import {
  asociarSedeSchema,
  eliminarSedeParamsSchema,
} from "../schemas/sedeSchema.js";

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
  };

  findAll = async (req, res, next) => {
    try {
      const medicos = await this.medicoService.findAll();
      res.status(200).json(medicos);
    } catch (error) {
      next(error);
    }
  };

  findById = async (req, res, next) => {
    try {
      const { id } = objectIdSchema.parse(req.params);
      const medico = await this.medicoService.findById(id);

      if (!medico) {
        return res.status(404).json({ message: "Médico no encontrado" });
      }

      res.status(200).json(medico);
    } catch (error) {
      return next(error);
    }
  };

  delete = async (req, res, next) => {
    try {
      const { id } = objectIdSchema.parse(req.params);
      const medicoEliminado = await this.medicoService.delete(id);
      if (!medicoEliminado) {
        return res.status(404).json({ message: "Médico no encontrado" });
      }
      console.log("Médico eliminado:", medicoEliminado);
      res.status(200).json(medicoEliminado);
    } catch (error) {
      return next(error);
    }
  };

  definirDisponibilidad = async (req, res, next) => {
    try {
      const { id } = objectIdSchema.parse(req.params);

      const disponibilidadData = disponibilidadSchema.parse(req.body);
      const disponibilidadActualizada =
        await this.medicoService.definirDisponibilidadPara(
          disponibilidadData,
          id,
        );

      return res.status(201).json({
        status: "success",
        data: disponibilidadActualizada,
      });
    } catch (error) {
      return next(error);
    }
  };

  consultarDisponibilidad = async (req, res, next) => {
    try {
      const { id } = objectIdSchema.parse(req.params);

      //const { idPractica } = disponibilidadConsultaSchema.parse(req.query);

      const disponibilidades =
        await this.medicoService.consultarDisponibilidad(id);

      return res.status(200).json({
        status: "success",
        data: disponibilidades,
      });
    } catch (error) {
      return next(error);
    }
  };

  modificarDisponibilidad = async (req, res, next) => {
    try {
      const { id } = objectIdSchema.parse(req.params);
      const disponibilidadData = disponibilidadSchema.parse(req.body);

      const medicoActualizado =
        await this.medicoService.modificarDisponibilidadPara(
          disponibilidadData,
          id,
        );

      return res.status(200).json({
        status: "success",
        data: medicoActualizado,
      });
    } catch (error) {
      return next(error);
    }
  };

  eliminarDisponibilidad = async (req, res, next) => {
    try {
      const { id } = objectIdSchema.parse(req.params);
      const { diaSemana } = eliminarDisponibilidadSchema.parse(req.body);

      const medicoActualizado =
        await this.medicoService.eliminarDisponibilidadPara(id, diaSemana);

      return res.status(200).json({
        status: "success",
        data: medicoActualizado,
      });
    } catch (error) {
      return next(error);
    }
  };

  agregarSede = async (req, res, next) => {
    try {
      const { id } = objectIdSchema.parse(req.params);
      const { sedeId } = asociarSedeSchema.parse(req.body);

      const medicoActualizado = await this.medicoService.agregarSede(
        id,
        sedeId,
      );

      return res.status(200).json({
        status: "success",
        data: medicoActualizado,
      });
    } catch (error) {
      return next(error);
    }
  };

  eliminarSede = async (req, res, next) => {
    try {
      const { id } = objectIdSchema.parse(req.params);
      const { sedeId } = eliminarSedeParamsSchema.parse(req.params);

      const medicoActualizado = await this.medicoService.eliminarSede(
        id,
        sedeId,
      );

      return res.status(200).json({
        status: "success",
        data: medicoActualizado,
      });
    } catch (error) {
      return next(error);
    }
  };

  /*
  parsearId(idParam) {
      if (typeof idParam !== "string" || idParam.trim().length === 0) {
          throw new Error("id inválido");
      }
      return idParam;
  }
  */

  /*
  seed = async (req, res, next) => {
      try {
        const MEDICOS_INICIALES =  [
          {
            nombre: "Dr. Juan Pérez",
            usuario: {
              id: "1",
              nombreUsuario: "juanperez",
              password: "password123"
            },
            matricula: "1234567890",
          },
          {
            nombre: "Dra. María Gómez",
            usuario: {
              id: "2",
              nombreUsuario: "mariagomez",
              password: "password456"
            },
            matricula: "0987654321",
          }
        ];
        this.medicoService.crearMedicos(MEDICOS_INICIALES);
        res.status(201).json(MEDICOS_INICIALES);
      } catch (error) {
        next(error);
      }
    }
      */

  seed = async (req, res, next) => {
    // Esta seed crea el usuario primero y despues al medico con el usuarioId, falta implementar toda la parte de usuario
    try {
      // 1. Crear usuarios
      const usuarios = [
        {
          nombreUsuario: "juanperez",
          password: "password123",
        },
        {
          nombreUsuario: "mariagomez",
          password: "password456",
        },
      ];

      const usuariosCreados = usuarios.map((usuarioData) =>
        this.medicoService.usuarioService.create(usuarioData),
      );

      // 2. Crear médicos usando usuarioId
      const medicos = [
        {
          nombre: "Dr. Juan Pérez",
          usuarioId: usuariosCreados[0].id,
          matricula: "1234567890",
        },
        {
          nombre: "Dra. María Gómez",
          usuarioId: usuariosCreados[1].id,
          matricula: "0987654321",
        },
      ];

      const medicosCreados = this.medicoService.crearMedicos(medicos);

      return res.status(201).json({
        status: "success",
        data: medicosCreados,
      });
    } catch (error) {
      next(error);
    }
  };
}
