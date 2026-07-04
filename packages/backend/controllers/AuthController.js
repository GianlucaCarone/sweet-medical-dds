import jwt from "jsonwebtoken";
import { UsuarioService } from "../services/UsuarioService.js";
import { MedicoService } from "../services/MedicoService.js";
import { PacienteService } from "../services/PacienteService.js";
import { logger } from "../config/logger.js";

export class AuthController {
    constructor({
        usuarioService = new UsuarioService(),
        medicoService = new MedicoService(),
        pacienteService = new PacienteService()
    } = {}) {
        this.usuarioService = usuarioService;
        this.medicoService = medicoService;
        this.pacienteService = pacienteService;
    }

    /**
     * POST /auth/login
     * Body: { nombreUsuario, password }
     * Responde con los datos del usuario y setea la cookie HttpOnly con el JWT.
     */
    login = async (req, res, next) => {
        try {
          const { nombreUsuario, password } = req.body;

          if (!nombreUsuario || !password) {
            return res
              .status(400)
              .json({ message: "nombreUsuario y password son requeridos" });
          }

          logger.info(
            "[AUTH CONTROLLER]: Intento de login para: ",
            nombreUsuario,
          );

          const usuario = await this.usuarioService.login(
            nombreUsuario,
            password,
          );
          // Fetch perfiles de manera segura (si no existen, catch y retorna null)
          let idEspecifico = null;
          
          if (usuario.rol === "MEDICO") {
              const medico = await this.medicoService.findByIdUsuario(usuario.id).catch(() => null);
              idEspecifico = medico ? medico.id : null;
          } else if (usuario.rol === "PACIENTE") {
              const paciente = await this.pacienteService.findByUserId(usuario.id).catch(() => null);
              idEspecifico = paciente ? paciente.id : null;
          }

          // Firmar el JWT con los datos del usuario + Custom Claims
          const token = jwt.sign(
            {
              id: usuario.id,
              nombreUsuario: usuario.nombreUsuario,
              rol: usuario.rol,
              idEspecifico: idEspecifico,
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRATION || "1h" },
          );

          // Setear la cookie HttpOnly — JavaScript del cliente no puede leerla
          res.cookie("token", token, {
            httpOnly: true, // no accesible por JS
            secure: process.env.NODE_ENV === "production", // solo HTTPS en prod
            sameSite: "strict", // previene CSRF
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días en ms
          });

          logger.info("[AUTH CONTROLLER]: Login exitoso para: ", nombreUsuario);
          return res.status(200).json({ usuario });
        } catch (error) {
          // UnauthorizedError (y cualquier otro AppError) es manejado automáticamente
          // por el errorHandler global, que responde con el statusCode correcto.
          next(error);
        }
    };

    /**
     * POST /auth/registro
     * Body: { nombreUsuario, password, nombre, dni, obraSocial?, plan? }
     * Crea un Usuario (rol=PACIENTE) + su Paciente, firma el JWT y setea la cookie.
     * El paciente queda logueado automáticamente tras el registro.
     */
    registro = async (req, res, next) => {
        try {
            const { nombreUsuario, password, nombre, dni, obraSocial, plan } = req.body;

            if (!nombreUsuario || !password || !nombre || !dni) {
                return res.status(400).json({
                    message: "nombreUsuario, password, nombre y dni son requeridos",
                });
            }

            logger.info("[AUTH CONTROLLER]: Registrando nuevo paciente: ", nombreUsuario);

            const usuario = await this.usuarioService.registrarPaciente({
                nombreUsuario,
                password,
                nombre,
                dni,
                obraSocial,
                plan,
            });

            // Auto-login: firmar JWT igual que en /login
            const token = jwt.sign(
                {
                    id: usuario.id,
                    nombreUsuario: usuario.nombreUsuario,
                    rol: usuario.rol,
                },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRATION || "1h" },
            );

            res.cookie("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });

            logger.info("[AUTH CONTROLLER]: Registro exitoso para: ", nombreUsuario);
            return res.status(201).json({ usuario });
        } catch (error) {
            next(error);
        }
    };

    /**
     * POST /auth/logout
     * Borra la cookie del browser.
     */
    logout = async (req, res) => {
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });
        logger.info("[AUTH CONTROLLER]: Logout exitoso");
        return res.status(200).json({ message: "Sesión cerrada correctamente" });
    };

    /**
     * GET /auth/me
     * Protegido por authMiddleware. Devuelve los datos del usuario autenticado.
     * req.user es seteado por el middleware con los datos del JWT.
     */
    me = async (req, res, next) => {
        try {
            logger.info("[AUTH CONTROLLER]: Consultando usuario autenticado: ", req.user.id);
            const usuario = await this.usuarioService.findById(req.user.id);
            return res.status(200).json({ usuario });
        } catch (error) {
            next(error);
        }
    };
}
