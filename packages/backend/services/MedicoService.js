import { ServiciosService } from "./serviciosService.js";
import { NotFoundError, ConflictError } from "../errors/AppError.js";
import { MedicoRepository } from "../repositories/MedicoRepository.js";
import { UsuarioService } from "./UsuarioService.js";
import { DisponibilidadHoraria } from "../domain/disponibilidadHoraria.js";
import { Medico } from "../domain/medico.js";
import { Usuario } from "../domain/usuario.js";
import { SedeService } from "./SedeService.js";
import { logger } from "../config/logger.js";
import { UsuarioMapper } from "../mappers/usuarioMapper.js";
import { MedicoMapper } from "../mappers/medicoMapper.js";
import { DisponibilidadMapper } from "../mappers/disponibilidadMapper.js";

export class MedicoService2 {
    constructor({
        medicoRepository = new MedicoRepository(),
        serviciosService = new ServiciosService(),
        usuarioService = new UsuarioService()
    } = {}) {
        this.medicoRepository = medicoRepository;
        this.serviciosService = serviciosService;
        this.usuarioService = usuarioService;
    }

    async crearMedicos(listaMedicos) { //funciona
        return listaMedicos.map((medicoData) => this.create(medicoData));
    }

    async create(medicoData) { //funciona
        logger.info("[MEDICO SERVICE]: Obteniendo los datos necesarios para crear medico");
        const usuario = await this.usuarioService.findEntityById(medicoData.usuarioId);
        if (!usuario) throw new NotFoundError("Usuario no encontrado");
        const medicoExistente = await this.medicoRepository.findByIdUsuario(usuario.id);
        if (medicoExistente) throw new ConflictError("Ya existe un médico con ese usuario");

        logger.info("[MEDICO SERVICE]: Creando medico: ", medicoData);
        const medicoEntityData = {
            usuario: usuario,
            matricula: medicoData.matricula,
            nombre: medicoData.nombre
        };
        const medico = new Medico(medicoEntityData);

        const nuevoMedico = await this.medicoRepository.save(medico);
        logger.info("[MEDICO SERVICE]: Médico creado: ", nuevoMedico);

        return MedicoMapper.toDto(nuevoMedico);
    }

    async getById(idMedico) { //TODO: VER QUE FUNCIONE
        logger.info("[MEDICO SERVICE]: Obteniendo medico con id: ", idMedico);
        const medico = await this.medicoRepository.findById(idMedico);
        if (!medico) throw new NotFoundError("Médico no encontrado");
        logger.info("[MEDICO SERVICE]: Medico obtenido: ", medico);

        return MedicoMapper.toDTOmedico;
    }


    async agregarServicioPara(idMedico, idServicio) { //TODO: VER QUE FUNCIONE
        logger.info("[MEDICO SERVICE]: Obteniendo datos necesarios para agendar un servicio para el medico ", idMedico)
        const medico = await this.medicoRepository.findById(idMedico);
        const servicio = await this.serviciosService.getById(idServicio);
        if (!medico || !servicio) throw new NotFoundError("Datos no encontrados");

        logger.info("[MEDICO SERVICE]: Guardando servicio con id: ", idServicio);
        medico.agregarServicio(servicio);

        const guardado = await this.medicoRepository.save(medico);
        logger.info("[MEDICO SERVICE]: Servicio guardado: ", guardado);

        return MedicoMapper.toDTO(guardado);
    }


    async eliminarServicioPara(idMedico, idServicio) { //TODO: VER QUE FUNCIONE
        logger.info("[MEDICO SERVICE]: Obteniendo datos necesarios para eliminar un servicio para el medico ", idMedico)
        const medico = await this.medicoRepository.findById(idMedico);
        const servicio = await this.serviciosService.getById(idServicio);
        if (!medico || !servicio) throw new NotFoundError("Datos no encontrados");

        logger.info("[MEDICO SERVICE]: Eliminando servicio con id: ", idServicio);
        medico.eliminarServicio(servicio);

        const guardadoGuardado = await this.medicoRepository.save(medico);
        logger.info("[MEDICO SERVICE]: Servicio eliminado con id: ", idServicio);

        return MedicoMapper.toDTO(guardadoGuardado);
    }
}

export class MedicoService {
    constructor({
        medicoRepository = new MedicoRepository(),
        usuarioService = new UsuarioService(),
        serviciosService = new ServiciosService(),
        sedeService = new SedeService(),
    } = {}) {
        this.medicoRepository = medicoRepository;
        this.usuarioService = usuarioService;
        this.serviciosService = serviciosService;
        this.sedeService = sedeService;
    }

    async create(medicoData) {
        logger.info("Iniciando creación de médico con los datos: ", medicoData);
        const usuarioDTO = await this.usuarioService.findById(medicoData.idUsuario);

        if (!usuarioDTO) {
            logger.error("Usuario no encontrado para el ID: ", medicoData.idUsuario);
            throw new NotFoundError("Usuario no encontrado");
        }

        const medicoExistente = await this.medicoRepository.findByIdUsuario(
            usuarioDTO.id,
        ); // Verificar que no exista otro médico con el mismo nombre de usuario
        if (medicoExistente) {
            logger.error(
                "Ya existe un médico con ese nombre de usuario: ",
                medicoData.nombre,
            );
            throw new ConflictError("Ya existe un médico con ese nombre de usuario");
        }

        const medicoEntityData = {
            nombre: medicoData.nombre,
            matricula: medicoData.matricula,
            idUsuario: medicoData.idUsuario,
        };
        const medico = new Medico(medicoEntityData);

        const nuevoMedico = await this.medicoRepository.save(medico);
        logger.info("Médico creado exitosamente: ", nuevoMedico);
        return this.toDto(nuevoMedico);
    }

    async findById(id) {
        const medico = await this.medicoRepository.findById(id);

        if (!medico) {
            throw new NotFoundError("Médico no encontrado");
        }

        return MedicoMapper.toDto(medico);
    }

    async findAll() {
        logger.info("Consultando todos los médicos");
        return this.medicoRepository.findAll().then(medicos => medicos.map(medico => this.toDto(medico)));
    }

    async delete(id) {
        logger.info(`Eliminando médico con ID: ${id}`);
        const medicoEliminado = await this.medicoRepository.delete(id);

        if (!medicoEliminado) {
            throw new NotFoundError("Médico no encontrado");
        }

        logger.info(`Médico eliminado con ID: ${id}`);
        return this.toDto(medicoEliminado);
    }

    crearMedicos(listaMedicos) {
        return listaMedicos.map((medicoData) => this.create(medicoData));
    }

    validarMedico(medico) {
        // TODO: Implementar validaciones necesarias para el médico
        this.validarUsuario(medico.idUsuario);
        this.validarMatricula(medico.matricula);
    }

    validarUsuario(idUsuario) {
        // TODO: Implementar validaciones necesarias para el usuario
    }

    async agregarSede(medicoId, sedeId) {
        logger.info(`Agregando sede ${sedeId} al médico ${medicoId}`);
        const medico = await this.medicoRepository.findById(medicoId);
        if (!medico) {
            throw new NotFoundError("Médico no encontrado");
        }

        const sede = await this.sedeService.getById(sedeId);

        const medicoDomain = MedicoMapper.toDomain(medico);
        medicoDomain.agregarSede(sede);

        const medicoActualizado = await this.medicoRepository.save(medicoDomain);
        return this.toDto(medicoActualizado);
    }

    async eliminarSede(medicoId, sedeId) {
        logger.info(`Eliminando sede ${sedeId} del médico ${medicoId}`);
        const medico = await this.medicoRepository.findById(medicoId);

        if (!medico) {
            throw new NotFoundError("Médico no encontrado");
        }

        //const sede = this.sedeService.getById(sedeId);

        medico.eliminarSede(sedeId);

        const medicoActualizado = await this.medicoRepository.save(medico);
        return this.toDto(medicoActualizado);
    }

    async definirDisponibilidadPara(disponibilidadData, id) {
        logger.info(`Definiendo disponibilidad para el médico ${id}`);

        // Docs de mongoose
        const medicoDoc = await this.medicoRepository.findById(id);
        // docs pasados a dominio
        const medico = MedicoMapper.toDomain(medicoDoc);

        const disponibilidad = new DisponibilidadHoraria(disponibilidadData);

        medico.definirDisponibilidad(disponibilidad);

        logger.info(`Disponibilidad definida para el médico ${id}: `, disponibilidad);

        return MedicoMapper.toDto(await this.medicoRepository.save(medico));
    }

    async modificarDisponibilidadPara(disponibilidadData, medicoId) {
        const medicoDoc = await this.medicoRepository.findById(medicoId);
        if (!medicoDoc) {
            throw new NotFoundError("Médico no encontrado");
        }
        const usuarioDoc = await this.usuarioService.findById(medicoDoc.idUsuario);

        const medico = MedicoMapper.toDomain(medicoDoc, usuarioDoc);

        const disponibilidad = new DisponibilidadHoraria(disponibilidadData);

        medico.modificarDisponibilidad(disponibilidad);

        // TODO avisar al turno service que genere los turnos.
        //await this.turnoService.regenerarTurnosDisponiblesDelMedico(medico.id);

        return this.medicoRepository.save(
            MedicoMapper.toPersistence(medico),
            medico.id
        );
    }

    async eliminarDisponibilidadPara(medicoId, diaSemana) {
        const medicoDoc = await this.medicoRepository.findById(medicoId);
        if (!medicoDoc) {
            throw new NotFoundError("Médico no encontrado");
        }

        const usuarioDoc = await this.usuarioService.findById(medicoDoc.idUsuario);

        const medico = MedicoMapper.toDomain(medicoDoc, usuarioDoc);

        medico.eliminarDisponibilidad(diaSemana);

        // TODO avisar al turno service que genere los turnos.
        //await this.turnoService.regenerarTurnosDisponiblesDelMedico(medico.id);

        return this.medicoRepository.save(
            MedicoMapper.toPersistence(medico),
            medico.id
        );
    }

    async consultarDisponibilidad(medicoId) {
        const medico = await this.findById(medicoId);

        /* if (!medico.ofrecePractica(practicaId)) {
          throw new Error("El médico no ofrece esa práctica");
        } */

        return medico.disponibilidades;
    }

    toDto(medico) {
        return {
            id: medico._id,
            nombre: medico.nombre,
            matricula: medico.matricula,
            idUsuario: medico.idUsuario,
            sedes: medico.sedes,
            disponibilidades: medico.disponibilidades,
        };
    }
}
