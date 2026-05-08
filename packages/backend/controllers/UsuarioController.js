import { UsuarioService } from "../services/UsuarioService.js";
import { usuarioSchema } from "../schemas/usuarioSchema.js";
import { idParamNumberSchema, idParamUUIDSchema } from "../schemas/urlSchema.js";

export class UsuarioController {
    constructor({ usuarioService = new UsuarioService() } = {}) {
        this.usuarioService = usuarioService;
    }

    create = async (req, res, next) => {
        try {
            const usuarioData = usuarioSchema.parse(req.body);
            const nuevoUsuario = await this.usuarioService.create(usuarioData);
            res.status(201).json(nuevoUsuario);
        } catch (error) {
            next(error);
        }
    }

    findById = async (req, res, next) => {
        try {
            const { id } = idParamUUIDSchema.parse(req.params);
            const usuario = await this.usuarioService.findById(id);
            if (!usuario) {
                return res.status(404).json({ message: "Usuario no encontrado" });
            }
            res.status(200).json(usuario);
        } catch (error) {
            return next(error);
        }   
    }

    findAll = async (req, res, next) => {
        try {
            const usuarios = await this.usuarioService.findAll();
            res.status(200).json(usuarios);
        } catch (error) {
            next(error);
        } 
    }

    delete = async (req, res, next) => {
        try {
            const { id } = idParamUUIDSchema.parse(req.params);
            await this.usuarioService.delete(id);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }

    // solo actualiza el nombre de usuario y la contraseña, no el id
    update = async (req, res, next) => {
        try {
            const { id } = idParamUUIDSchema.parse(req.params);
            const usuarioData = usuarioSchema.partial().parse(req.body);
            const usuarioActualizado = await this.usuarioService.update(id, usuarioData);
            res.status(200).json(usuarioActualizado);
        } catch (error) {
            next(error);
        }
    }
}