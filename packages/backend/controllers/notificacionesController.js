import { NotificacionesService } from "../services/notificacionesService.js"; 

export class NotificacionesController {
    constructor ({ notificacionesService = new NotificacionesService () } = {}) {
        this.notificacionesService = notificacionesService;
    }

    getLeidos = async (req, res, next) => {
        try {
            const id = this.parsearId(req.params.id);
            //const datosServicio = this.extraerYValidarBodyServicio(req.body)
            const notificaciones = await this.notificacionesService.getLeidosNoLeidos(id, true);
            res.status(200).json( {
                status: 'success',
                data: notificaciones
            });
        } catch (error) {
            next(error);
        }
    }

    getNoLeidos = async (req, res, next) => {
        try {
            const id = this.parsearId(req.params.id);
            //const datosServicio = this.extraerYValidarBodyServicio(req.body)
            const notificaciones = await this.notificacionesService.getLeidosNoLeidos(id, false);
            res.status(200).json( {
                status: 'success',
                data: notificaciones
            });
        } catch (error) {
            next(error);
        }
    }

    leer = async (req, res, next) => {
        try {
            const id = this.parsearId(req.params.id);
            //const datosServicio = this.extraerYValidarBodyServicio(req.body)
            const notificacion = await this.notificacionesService.leer(id);
            res.status(200).json( {
                status: 'success',
                data: notificacion
            });
        } catch (error) {
            next(error);
        }
    }
/*
    extraerYValidarBodyServicio(body) {
        if (!body || typeof body !== "object" || Array.isArray(body)) {
            throw new Error("El cuerpo de la request es inválido") // TODO: AGREGAR ERROR MAS ADELANTE
        }

        const camposPermitidos = ["nombre", "duracion", "costo", "codigo"]
        const camposBody = Object.keys(body)
        const camposNoPermitidos = camposBody.filter((campo) => !camposPermitidos.includes(campo))

        if (camposNoPermitidos.length > 0) {
            throw new Error(`Campos no permitidos en la request: ${camposNoPermitidos.join(", ")}`) // TODO: AGREGAR ERROR MAS ADELANTE
        }

        const camposFaltantes = camposPermitidos.filter((campo) => body[campo] === undefined)

        if (camposFaltantes.length > 0) {
            throw new Error(`Faltan campos obligatorios en la request: ${camposFaltantes.join(", ")}`) // TODO: AGREGAR ERROR MAS ADELANTE
        }

        //verificar tipos de todos los atributos
        this.validarString(body.nombre, "nombre");this.validarEnteroPositivo(body.duracion, "duracion");this.validarDoublePositivo(body.costo, "costo");this.validarString(body.codigo, "codigo");

        return {
            nombre: body.nombre,
            duracion: body.duracion,
            costo: body.costo,
            codigo: body.codigo //el campo codigo esta si o si. en caso de ser una especialidad (no tiene ese campo), que sea un sring vacio; el service lo interpreta
        }
    }
*/
    parsearId (idParam) {
        const id = Number(idParam)
        this.validarEnteroPositivo(id, "id")
        return id
    }
}