import { Paciente } from "../domain/paciente.js";
import { UsuarioService } from "./UsuarioService.js";

export class PacienteService {
    constructor({
        usuarioService = new UsuarioService(),
        servicioService = new ServicioService(),
        sedeService = new SedeService(),
    } = {}) {
        this.medicoRepository = medicoRepository;
        this.usuarioService = usuarioService;
        this.servicioService = servicioService;
        this.sedeService = sedeService;
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
            nombre: medicoData.nombre,
            honorario: medicoData.honorario
        };
        const medico = new Medico(medicoEntityData);

        const nuevoMedico = await this.medicoRepository.save(medico);
        logger.info("[MEDICO SERVICE]: Médico creado: ", nuevoMedico);

        return MedicoMapper.toDTO(nuevoMedico);
    }
}