import { PacienteRepository } from "../repositories/PacienteRepository.js";
import { UsuarioService } from "./UsuarioService.js";
import { ObraSocialService } from "./ObraSocialService.js";
import { NotFoundError, ConflictError } from "../errors/AppError.js";
import { logger } from "../config/logger.js";

export class PacienteService {
    #pacienteRepository;
    #usuarioService;
    #obraSocialService;

    constructor({
        pacienteRepository = new PacienteRepository(),
        usuarioService = new UsuarioService(),
        obraSocialService = new ObraSocialService(),
    } = {}) {
        this.#pacienteRepository = pacienteRepository;
        this.#usuarioService = usuarioService;
        this.#obraSocialService = obraSocialService;
    }

    async crear(pacienteData) {
        const usuario = await this.#usuarioService.findEntityById(pacienteData.idUsuario);
        if (!usuario) throw new NotFoundError("Usuario no encontrado");

        const pacienteExistente = await this.#pacienteRepository.findByIdUsuario(usuario.id);
        if (pacienteExistente) throw new ConflictError("Ya existe un paciente con ese usuario");

        if (pacienteData.obraSocial) {
            const obraSocialExistente = await this.#obraSocialService.buscar(pacienteData.obraSocial);
            if (!obraSocialExistente) throw new NotFoundError("Obra social no encontrada");
        }
        logger.info("[PACIENTE SERVICE]: Paciente creado: ", pacienteData);
        const nuevoPaciente = await this.#pacienteRepository.save(pacienteData);
        return this.toDto(nuevoPaciente);
    }

    async findAll() {
        logger.info("[PACIENTE SERVICE]: Buscando todos los pacientes");
        const pacientes = await this.#pacienteRepository.findAll();
        logger.info("[PACIENTE SERVICE]: Pacientes encontrados: ", pacientes);
        return pacientes.map((p) => this.toDto(p));
    }

    async findById(idPaciente) {
        logger.info("[PACIENTE SERVICE]: Buscando pacientes con ID: ", idPaciente);
        const paciente = await this.#pacienteRepository.findById(idPaciente);
        if (!paciente) throw new NotFoundError("Paciente no encontrado");
        logger.info("[PACIENTE SERVICE]: Paciente encontrado con ID: ", paciente);
        return this.toDto(paciente);
    }

    async findByUserId(idUsuario) {
        logger.info("[PACIENTE SERVICE]: Buscando paciente por ID de usuario: ", idUsuario);
        const paciente = await this.#pacienteRepository.findByIdUsuario(idUsuario);
        if (!paciente) throw new NotFoundError("Paciente no encontrado para el usuario actual");
        logger.info("[PACIENTE SERVICE]: Paciente encontrado por ID de usuario: ", paciente);
        return this.toDto(paciente);
    }

    async update(idPaciente, pacienteData) {
        logger.info("[PACIENTE SERVICE]: Actualizando paciente con id: ", idPaciente);
        const paciente = await this.#pacienteRepository.findById(idPaciente);
        if (!paciente) throw new NotFoundError("Paciente no encontrado");

        if (pacienteData.obraSocial) {
            const obraSocialExistente = await this.#obraSocialService.buscar(pacienteData.obraSocial);
            if (!obraSocialExistente) throw new NotFoundError("Obra social no encontrada");
        }

        if (pacienteData.dni) paciente.dni = pacienteData.dni;
        if (pacienteData.nombre) paciente.nombre = pacienteData.nombre;
        if (pacienteData.obraSocial !== undefined) paciente.obraSocial = pacienteData.obraSocial;
        if (pacienteData.plan !== undefined) paciente.plan = pacienteData.plan;

        const pacienteActualizado = await this.#pacienteRepository.save(paciente);
        logger.info("[PACIENTE SERVICE]: Paciente actualizado: ", pacienteActualizado);
        return this.toDto(pacienteActualizado);
    }

    async delete(idPaciente) {
        logger.info("[PACIENTE SERVICE]: Eliminando paciente con id: ", idPaciente);
        const paciente = await this.#pacienteRepository.findById(idPaciente);
        if (!paciente) throw new NotFoundError("Paciente no encontrado");

        const pacienteEliminado = await this.#pacienteRepository.delete(idPaciente);
        logger.info("[PACIENTE SERVICE]: Paciente eliminado: ", pacienteEliminado);
        return this.toDto(pacienteEliminado);
    }

    /**
     * Transforma un documento Mongoose de Paciente (con populate de obraSocial)
     * a un DTO plano y seguro para exponer en la API.
     *
     * - obraSocial: { id, nombre, planes } (objeto populado o null)
     * - plan: { id, nombre, coberturaEspecialidad, coberturaPractica } (resuelto desde obraSocial.planes) o null
     * - idUsuario: el ObjectId del usuario relacionado
     */
    toDto(paciente) {
        if (!paciente) return null;

        // Resolver el plan desde el array de planes de la obra social populada
        let planDto = null;
        const obraSocialDoc = paciente.obraSocial;

        if (obraSocialDoc && paciente.plan) {
            const planIdStr = paciente.plan.toString();
            const planEncontrado = obraSocialDoc.planes?.find(
                (p) => p._id?.toString() === planIdStr
            );
            if (planEncontrado) {
                planDto = {
                    id: planEncontrado._id?.toString(),
                    nombre: planEncontrado.nombre,
                    coberturaEspecialidad: planEncontrado.coberturaEspecialidad ?? [],
                    coberturaPractica: planEncontrado.coberturaPractica ?? [],
                };
            }
        }

        // Resolver obra social
        let obraSocialDto = null;
        if (obraSocialDoc) {
            obraSocialDto = {
                id: obraSocialDoc._id?.toString() ?? obraSocialDoc.toString(),
                nombre: obraSocialDoc.nombre ?? null,
                planes: obraSocialDoc.planes?.map((p) => ({
                    id: p._id?.toString(),
                    nombre: p.nombre,
                })) ?? [],
            };
        }

        return {
            id: paciente._id?.toString() ?? paciente.id,
            idUsuario: paciente.idUsuario?._id?.toString() ?? paciente.idUsuario?.toString() ?? null,
            nombre: paciente.nombre,
            dni: paciente.dni,
            obraSocial: obraSocialDto,
            plan: planDto,
        };
    }
}