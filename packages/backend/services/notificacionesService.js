import { NotificacionesRepository } from "../repositories/notificacionesRepository.js";
import { BadRequestError } from "../errors/AppError.js";
import { Notificacion } from "../domain/notificacion.js";
import { UsuarioService } from "./UsuarioService.js";
import { logger } from '../config/logger.js';

export class NotificacionesService {
    constructor({ notificacionesRepository = new NotificacionesRepository(), usuariosService = new UsuarioService() } = {}) {
        this.notificacionesRepository = notificacionesRepository;
        this.usuariosService = usuariosService;
    }

    toDTO (notificacion) {
        return {
            id: notificacion.id,
            destinatario: notificacion.destinatario.nombre,
            remitente: notificacion.remitente.nombre,
            mensaje: notificacion.mensaje,
            fechaHoraCreacion: notificacion.fechaHoraCreacion,
            fechaHoraLeida: notificacion.fechaHoraLeida,
            leida: notificacion.leida
        };
    }

    async crearNotificacion (notificacionData) {
        logger.info("[NOTIFICACIONES SERVICE]: Obteniendo datos necesarios para crear la notificacion")
        const destinatario = await this.usuariosService.findById(notificacionData.destinatario);
        notificacionData.destinatario = destinatario;
        const remitente = await this.usuariosService.findById(notificacionData.remitente);
        notificacionData.remitente = remitente;

        const notificacion = new Notificacion(notificacionData);

        logger.info("[NOTIFICACIONES SERVICE]: Creando notificacion con id: ", notificacionData.id);
        const guardado = await this.notificacionesRepository.save(notificacion);  
        logger.info("[NOTIFICACIONES SERVICE]: Notificacion creada: ", guardado);
        return this.toDTO(guardado);
    }

    async getLeidosNoLeidos (idDestinatario, leido) {
        logger.info("[NOTIFICACIONES SERVICE]: Obteniendo notificaciones " + ((leido) ? "leidas":"no leidas") + " del usuario " + idDestinatario);
        const notificaciones = await this.notificacionesRepository.getByDestinatarioIdAndLeido(idDestinatario, leido);
        logger.info("[NOTIFICACIONES SERVICE]: Se obtuvieron las notificaciones: ", notificaciones);
        return notificaciones.map(n => this.toDTO(n));
    }
    
    async getLeidosNoLeidosPaginado(idDestinatario, leido, page = 1, limit = 10) {
        logger.info("[NOTIFICACIONES SERVICE]: Obteniendo notificaciones " + (leido ? "leidas" : "no leidas") + " del usuario " + idDestinatario);
        const resultado = await this.notificacionesRepository.getByDestinatarioIdAndLeidoPaginado(idDestinatario, leido, page, limit);

        logger.info("[NOTIFICACIONES SERVICE]: Se obtuvieron las notificaciones:", resultado.data);

        return {
            ...resultado,
            data: resultado.data.map(n => this.toDTO(n))
        };
    }
    
    async obtenerPaginadas(numeroPagina = 1, limitePorPagina = 10, filtros = {}) {
        logger.info("[NOTIFICACIONES SERVICE]: Obteniendo notificaciones paginadas");

        const resultado = await this.notificacionesRepository.obtenerPaginadas(numeroPagina, limitePorPagina, filtros);

        logger.info("[NOTIFICACIONES SERVICE]: Notificaciones obtenidas:", resultado.notificaciones.length);

        return {
            totalNotificaciones: resultado.totalNotificaciones,
            numeroPagina,
            limitePorPagina,
            totalPaginas: Math.ceil(resultado.totalNotificaciones / limitePorPagina),
            notificaciones: resultado.notificaciones.map(n => this.toDTO(n))
        };
    }
    
    

    async leer (idNotificacion) {
        logger.info("[NOTIFICACIONES SERVICE]: Obteniendo los datos necesarios para leer la notificacion");
        const notificacion = await this.notificacionesRepository.getById(idNotificacion);

        if (!notificacion) throw new BadRequestError("No se encontro la notificacion con el id " + idNotificacion);
        logger.info("[NOTIFICACIONES SERVICE]: Leyendo notificacion: ", idNotificacion);
        notificacion.marcarComoLeida();
        const notificacionGuardada = await this.notificacionesRepository.save(notificacion);
        logger.info("[NOTIFICACIONES SERVICE]: Notificacion leida: ", notificacionGuardada);
        
        return this.toDTO(notificacionGuardada);
    }
}