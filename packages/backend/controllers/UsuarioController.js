import { UsuarioService } from "../services/UsuarioService.js";
import { usuarioSchema } from "../schemas/zod/usuarioSchema.js";
import { idParamObjectIdSchema } from "../schemas/zod/urlSchema.js";
import { logger } from "../config/logger.js";

export class UsuarioController {
    constructor({
        usuarioService = new UsuarioService()
    } = {}) {
        this.usuarioService = usuarioService;
    }

    create = async (req, res, next) => {
        try {
            const usuarioData = usuarioSchema.parse(req.body);
            logger.info("[USUARIOS CONTROLLER]: Creando usuario: ", usuarioData);
            const nuevoUsuario = await this.usuarioService.create(usuarioData);
            logger.info("[USUARIOS CONTROLLER]: Usuario creado: ", nuevoUsuario);
            res.status(201).json(nuevoUsuario);
        } catch (error) {
            next(error);
        }
    };

    findById = async (req, res, next) => {
        try {
            const { id } = idParamObjectIdSchema.parse(req.params);
            logger.info("[USUARIOS CONTROLLER]: Obteniendo el usuario de id: ", id);
            const usuario = await this.usuarioService.findById(id);
            logger.info("[USUARIOS CONTROLLER]: Usuario obtenido: ", id);
            if (!usuario) {
                return res.status(404).json({ message: "Usuario no encontrado" });
            }
            res.status(200).json(usuario);
        } catch (error) {
            return next(error);
        }
    };

    findAll = async (req, res, next) => {
        try {
            logger.info("[USUARIOS CONTROLLER]: Obteniendo todos los usuarios");
            const usuarios = await this.usuarioService.findAll();
            logger.info("[USUARIOS CONTROLLER]: Usuarios obtenidos: ", usuarios.length, usuarios);
            res.status(200).json(usuarios);
        } catch (error) {
            next(error);
        }
    };

    delete = async (req, res, next) => {
        try {
            const { id } = idParamObjectIdSchema.parse(req.params);
            logger.info("[USUARIOS CONTROLLER]: Eliminando usuario: ", id);
            await this.usuarioService.delete(id);
            logger.info("[USUARIOS CONTROLLER]: Usuario borrado.");
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    };

    // solo actualiza el nombre de usuario y la contraseña, no el id
    update = async (req, res, next) => {
        try {
            const { id } = idParamObjectIdSchema.parse(req.params);
            const usuarioData = usuarioSchema.partial().parse(req.body);
            logger.info("[USUARIOS CONTROLLER]: Actualizando datos de usuario: ", id);
            const usuarioActualizado = await this.usuarioService.update(id, usuarioData);
            logger.info("[USUARIOS CONTROLLER]:Usuario actualizado: ", usuarioActualizado);
            res.status(200).json(usuarioActualizado);
        } catch (error) {
            next(error);
        }
    };

    //1. El primer seed. Crea los usuarios
    async seed() {
        const usuarios = [
            {
                nombreUsuario: "System",
                password: "System00"
            },
            {
                nombreUsuario: "Mariagomez",
                password: "Password1"
            }
        ];

        return await Promise.all(
            usuarios.map(usuarioData => this.usuarioService.create(usuarioData))
        );
    };
}