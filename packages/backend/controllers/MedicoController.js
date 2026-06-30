import { MedicoService } from "../services/MedicoService.js";
import { logger } from "../config/logger.js";
import { medicoSchema, disponibilidadSchema, eliminarDisponibilidadSchema, medicoIdParamsSchema, servicioIdSchema } from "../schemas/zod/medicoSchema.js";
import { idParamObjectIdSchema } from "../schemas/zod/urlSchema.js";
import { agregarSedeParamsSchema, eliminarSedeParamsSchema } from "../schemas/zod/sedeSchema.js";

export class MedicoController {
  constructor({ medicoService = new MedicoService() } = {}) {
    this.medicoService = medicoService;
  }

  create = async (req, res, next) => {
    try {
      const medicoData = medicoSchema.parse(req.body);
      logger.info("[MEDICO CONTROLLER]: Creando medico: ", medicoData);
      const nuevoMedico = await this.medicoService.create(medicoData);
      logger.info("[MEDICO CONTROLLER]: Creando medico: ", nuevoMedico);
      res.status(201).json(nuevoMedico);
    } catch (error) {
      next(error);
    }
  };

  findAll = async (req, res, next) => {
    try {
      logger.info("[MEDICO CONTROLLER]: Obteniendo todos los medicos");
      const medicos = await this.medicoService.findAll();
      logger.info("[MEDICO CONTROLLER]: Medicos obtenidos: ", medicos);
      res.status(200).json(medicos);
    } catch (error) {
      next(error);
    }
  };

  findById = async (req, res, next) => {
    try {
      const { id } = idParamObjectIdSchema.parse(req.params);
      logger.info("[MEDICO CONTROLLER]: Obteniendo medico de id: ", id);
      const medico = await this.medicoService.findById(id);
      if (!medico) {
        return res.status(404).json({ message: "Médico no encontrado" }); //TODO: ver donde tira error
      }
      logger.info("[MEDICO CONTROLLER]: Obteniendo medico de id: ", id, medico);
      res.status(200).json(medico);
    } catch (error) {
      return next(error);
    }
  };

  findByIdUsuario = async (req, res, next) => {
    try {
      const { id } = idParamObjectIdSchema.parse(req.params);
      logger.info("[MEDICO CONTROLLER]: Obteniendo medico de usuario: ", id);
      const medico = await this.medicoService.findByIdUsuario(id);
      if (!medico) {
        return res.status(404).json({ message: "Médico no encontrado" });
      }
      logger.info("[MEDICO CONTROLLER]: Medico obtenido: ", medico);
      res.status(200).json(medico);
    } catch (error) {
      return next(error);
    }
  }

  delete = async (req, res, next) => {
    try {
      const { id } = idParamObjectIdSchema.parse(req.params);
      logger.info("[MEDICO CONTROLLER]: Eliminando medico de id: ", id);
      const medicoEliminado = await this.medicoService.delete(id);
      if (!medicoEliminado) {
        return res.status(404).json({ message: "Médico no encontrado" });
      }
      logger.info("[MEDICO CONTROLLER]: Medico eliminado: ", medicoEliminado);
      res.status(200).json(medicoEliminado);
    } catch (error) {
      return next(error);
    }
  };

  update = async (req, res, next) => {
    try {
      const { id } = idParamObjectIdSchema.parse(req.params);
      const medicoData = medicoSchema.partial().parse(req.body);
      logger.info("[MEDICO CONTROLLER]: Actualizando medico de id: ", id, " con datos: ", medicoData);
      const medicoActualizado = await this.medicoService.update(id, medicoData);
      logger.info("[MEDICO CONTROLLER]: Medico actualizado: ", medicoActualizado);
      res.status(200).json(medicoActualizado);
    } catch (error) {
      next(error);
    }
  };

  definirDisponibilidad = async (req, res, next) => {
    try {
      const { id } = idParamObjectIdSchema.parse(req.params);
      logger.info("[MEDICO CONTROLLER]: Definiendo disponibilidad del medico de id: ", id);
      const disponibilidadData = disponibilidadSchema.parse(req.body);
      const disponibilidadActualizada = await this.medicoService.definirDisponibilidadPara(disponibilidadData, id);
      logger.info("[MEDICO CONTROLLER]: Disponibilidad definida para el medico de id: ", id, disponibilidadActualizada);
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
      const { id } = idParamObjectIdSchema.parse(req.params);
      logger.info("[MEDICO CONTROLLER]: Consultando disponibilidad del medico de id: ", id);
      //const { idPractica } = disponibilidadConsultaSchema.parse(req.query);

      const disponibilidades = await this.medicoService.consultarDisponibilidad(id);
      logger.info("[MEDICO CONTROLLER]: Disponibilidad del medico de id: ", id, disponibilidades);
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
      const { id } = idParamObjectIdSchema.parse(req.params);
      const disponibilidadData = disponibilidadSchema.parse(req.body);
      logger.info("[MEDICO CONTROLLER]: Modificando disponibilidad para el medico con id: ", id);
      const medicoActualizado =
        await this.medicoService.modificarDisponibilidadPara(disponibilidadData, id);
      logger.info("[MEDICO CONTROLLER]: Disponibilidad eliminada para el medico con id: ", id);
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
      const { id } = idParamObjectIdSchema.parse(req.params);
      const { diaSemana } = eliminarDisponibilidadSchema.parse(req.body);
      logger.info("[MEDICO CONTROLLER]: Eliminando disponibilidad para medico con id: ", id);
      const medicoActualizado =
        await this.medicoService.eliminarDisponibilidadPara(id, diaSemana);
      logger.info("[MEDICO CONTROLLER]: Disponibilidad eliminada del medico con id: ", id);
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
      const { id, sedeId } = agregarSedeParamsSchema.parse(req.params);

      const medicoActualizado = await this.medicoService.agregarSede(id, sedeId);

      return res.status(200).json({
        status: "success",
        data: medicoActualizado
      });
    } catch (error) {
      return next(error);
    }
  };

  eliminarSede = async (req, res, next) => {
    try {
      const { id } = idParamObjectIdSchema.parse(req.params);
      const { sedeId } = eliminarSedeParamsSchema.parse(req.params);
      logger.info("[MEDICO CONTROLLER]: Eliminando sede con id: ", sedeId);
      const medicoActualizado = await this.medicoService.eliminarSede(id, sedeId);
      logger.info("[MEDICO CONTROLLER]: Sede eliminada con id: ", sedeId);
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

  agregarServicio = async (req, res, next) => {
    try {
      const { idMedico } = medicoIdParamsSchema.parse(req.params);
      const { idServicio } = servicioIdSchema.parse(req.params);
      logger.info("[MEDICO CONTROLLER]: Agregando servicio " + idServicio + " al medico " + idMedico);
      const medico = await this.medicoService.agregarServicioPara(idMedico, idServicio);
      logger.info("[MEDICO CONTROLLER]: Servicio agregado al medico: ", medico);
      res.status(200).json({
        status: "success",
        data: medico,
        message: "Servicio agregado al médico exitosamente."
      });
    } catch (error) {
      next(error);
    }
  };

  eliminarServicio = async (req, res, next) => {
    try {
      const { idMedico } = medicoIdParamsSchema.parse(req.params);
      const { idServicio } = servicioIdSchema.parse(req.params);
      logger.info("[MEDICO CONTROLLER]: Eliminando servicio " + idServicio + " al medico " + idMedico);
      const medico = await this.medicoService.eliminarServicioPara(idMedico, idServicio);
      logger.info("[MEDICO CONTROLLER]: Servicio eliminado al medico: ", medico);
      res.status(200).json({
        status: "success",
        data: medico,
        message: "Servicio eliminado del médico exitosamente."
      });
    } catch (error) {
      next(error);
    }
  };

  // 2. El segundo seed. Previamente, se craearon los usuarios con otro seed, y usando aquellos, crea los medicos correspondientes
  async seed(usuarios) {
    // Crear médicos usando el usuario del sistema (para nuestro test, usamos uno solo)
    const medicos = [
      {
        nombre: "Dra. María Gómez",
        usuarioId: usuarios[1].id,
        matricula: "0987654321"
      }
    ];

    return await this.medicoService.crearMedicos(medicos);
  };

  seedGeneral = async (req, res, next) => { // Esta seed crea el usuario primero y despues al medico con el usuarioId, falta implementar toda la parte de usuario
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
