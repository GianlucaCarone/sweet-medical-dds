import { NotificacionRepository } from "../repositories/NotificacionRepository.js";
import { NotFoundError } from "../errors/AppError.js";
import { Notificacion } from "../domain/notificacion.js";
import { UsuarioService } from "./UsuarioService.js";
import { logger } from "../config/logger.js";
import { Usuario } from "../domain/usuario.js";
import { NotificacionMapper } from "../mappers/notificacionMapper.js";
import { FactoryNotificacion } from "../domain/factoryNotificacion.js";

export class NotificacionService {
    constructor({ notificacionRepository = new NotificacionRepository(), usuarioService = new UsuarioService(), factoryNotificacion = new FactoryNotificacion() } = {}) {
        this.notificacionRepository = notificacionRepository;
        this.usuarioService = usuarioService;
        this.factoryNotificacion = factoryNotificacion;
    }

    async crearNotificacion(notificacionData) {
        logger.info("[NOTIFICACIONES SERVICE]: Obteniendo datos necesarios para crear la notificacion");
        const destinatarioObtenido = await this.usuarioService.findById(notificacionData.destinatario);
        const destinatario = new Usuario(destinatarioObtenido); destinatario.id = destinatarioObtenido.id;
        notificacionData.destinatario = destinatario;
        const remitenteObtenido = await this.usuarioService.findById(notificacionData.remitente);
        const remitente = new Usuario(remitenteObtenido); remitente.id = remitenteObtenido.id;
        notificacionData.remitente = remitente;

        const notificacion = new Notificacion(notificacionData);
        const notificacionGuardada = await this.notificacionRepository.save(notificacion);
        logger.info("[NOTIFICACIONES SERVICE]: Notificacion creada: ", notificacionGuardada);
        return NotificacionMapper.toDTO(notificacionGuardada);
    }

    async crearNotificacionSegunTurno(turno) {
        logger.info("[NOTIFICACIONES SERVICE]: Creando la notificacion con el Factory para el turno ", turno);
        const notificacion = this.factoryNotificacion.crearSegunEstadoTurno(turno);
        const notificacionGuardada = await this.notificacionRepository.save(notificacion);
        logger.info("[NOTIFICACIONES SERVICE]: Notificacion creada: ", notificacionGuardada);
        return NotificacionMapper.toDTO(notificacionGuardada);
    }

    async getLeidosNoLeidos(idDestinatario, leido) {
        logger.info("[NOTIFICACIONES SERVICE]: Obteniendo notificaciones " + ((leido) ? "leidas" : "no leidas") + " del usuario " + idDestinatario);
        const notificaciones = await this.notificacionRepository.getByDestinatarioIdAndLeido(idDestinatario, leido);
        logger.info("[NOTIFICACIONES SERVICE]: Se obtuvieron las notificaciones: ", notificaciones);
        return notificaciones.map(n => NotificacionMapper.toDTO(n));
    }

    async getLeidosNoLeidosPaginado(idDestinatario, leido, page = 1, limit = 10) {
        logger.info("[NOTIFICACIONES SERVICE]: Obteniendo notificaciones " + (leido ? "leidas" : "no leidas") + " del usuario " + idDestinatario);
        const resultado = await this.notificacionRepository.getByDestinatarioIdAndLeidoPaginado(idDestinatario, leido, page, limit);

        const notificaciones = resultado.data.map(n => NotificacionMapper.toDTO(n));
        logger.info("[NOTIFICACIONES SERVICE]: Se obtuvieron las notificaciones:", resultado.data);
        return {
            ...resultado,
            data: notificaciones
        };

    }

    /*
    async obtenerPaginadas(numeroPagina = 1, limitePorPagina = 10, filtros = {}) {
        logger.info("[NOTIFICACIONES SERVICE]: Obteniendo notificaciones paginadas");

        const resultado = await this.notificacionesRepository.obtenerPaginadas(numeroPagina, limitePorPagina, filtros);

        logger.info("[NOTIFICACIONES SERVICE]: Notificaciones obtenidas:", resultado.notificaciones.length);

        return {
            totalNotificaciones: resultado.totalNotificaciones,
            numeroPagina,
            limitePorPagina,
            totalPaginas: Math.ceil(resultado.totalNotificaciones / limitePorPagina),
            notificaciones: resultado.notificaciones.map(n => NotificacionMapper.toDTO(n))
        };
    }*/

    async leer(idNotificacion) {
        logger.info("[NOTIFICACIONES SERVICE]: Obteniendo los datos necesarios para leer la notificacion");
        const notificacion = await this.notificacionRepository.getById(idNotificacion);

        if (!notificacion) throw new NotFoundError("No se encontro la notificacion con el id " + idNotificacion);
        logger.info("[NOTIFICACIONES SERVICE]: Leyendo notificacion: ", idNotificacion);
        if (notificacion.leida === true) return NotificacionMapper.toDTO(notificacion); //de ultima que tire BadRequestError
        notificacion.marcarComoLeida();
        const notificacionGuardada = await this.notificacionRepository.save(notificacion);
        logger.info("[NOTIFICACIONES SERVICE]: Notificacion leida: ", notificacionGuardada);

        return NotificacionMapper.toDTO(notificacionGuardada);
    }
}