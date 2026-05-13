import { ServiciosService } from "../services/serviciosService";

export class ServiciosController {
    constructor ({ serviciosService = new ServiciosService () } = {}) {
        this.serviciosService = serviciosService;
    }

    create = async (req, res, next) => {
        try {
            const datosServicio = this.extraerYValidarBodyServicio(req.body); //TODO: desacoplarlo
            const servicio = await this.serviciosService.create(datosServicio);
            res.status(201).json( {
                status: "success",
                data: servicio
            });
        } catch (error) {
            next(error);
        }
    };

    update = async (req, res, next) => {
        try {
            const id = this.parsearId(req.params.id);
           const datosServicio = this.extraerYValidarBodyServicio(req.body); //TODO: desacoplarlo
            const servicio = await this.serviciosService.update(id, datosServicio);
            res.status(200).json( {
                status: "success",
                data: servicio
            });
        } catch (error) {
            next(error);
        }
    };

    delete = async (req, res, next) => {
        try {
            const id = this.parsearId(req.params.id);
            this.serviciosService.delete(id);
            res.status(204).json( {
                status: "success"
            });
        } catch (error) {
            next(error);
        }
    };

    extraerYValidarBodyServicio(body) { //TODO: desacoplarlo
        if (!body || typeof body !== "object" || Array.isArray(body)) {
            throw new Error("El cuerpo de la request es inválido"); // TODO: AGREGAR ERROR MAS ADELANTE
        }

        const camposPermitidos = ["nombre", "duracion", "costo", "codigo"];
        const camposBody = Object.keys(body);
        const camposNoPermitidos = camposBody.filter((campo) => !camposPermitidos.includes(campo));

        if (camposNoPermitidos.length > 0) {
            throw new Error(`Campos no permitidos en la request: ${camposNoPermitidos.join(", ")}`); // TODO: AGREGAR ERROR MAS ADELANTE
        }

        const camposFaltantes = camposPermitidos.filter((campo) => body[campo] === undefined);

        if (camposFaltantes.length > 0) {
            throw new Error(`Faltan campos obligatorios en la request: ${camposFaltantes.join(", ")}`); // TODO: AGREGAR ERROR MAS ADELANTE
        }

        //verificar tipos de todos los atributos
        this.validarString(body.nombre, "nombre");this.validarEnteroPositivo(body.duracion, "duracion");this.validarDoublePositivo(body.costo, "costo");this.validarString(body.codigo, "codigo");

        return {
            nombre: body.nombre,
            duracion: body.duracion,
            costo: body.costo,
            codigo: body.codigo //el campo codigo esta si o si. en caso de ser una especialidad (no tiene ese campo), que sea un sring vacio; el service lo interpreta
        };
    }

    parsearId (idParam) {
        const id = Number(idParam);
        this.validarEnteroPositivo(id, "id");
        return id;
    }

    validarEnteroPositivo(numero, parametro) {
        if (!Number.isInteger(numero) || numero <= 0) {
            throw new Error(`El parámetro ${parametro} debe ser un entero positivo`); // TODO: AGREGAR ERROR MAS ADELANTE
        }
    }

    validarDoublePositivo(numero, parametro) {
        if (Number.isInteger(numero) || numero <= 0) {
            throw new Error(`El parámetro ${parametro} debe tener parte decimal`); // TODO: AGREGAR ERROR MAS ADELANTE
        }
    }

    validarString(texto, parametro) {
        if (typeof texto !== "string") {
            throw new Error(`El parámetro ${parametro} debe ser un string válido`); // TODO: AGREGAR ERROR MAS ADELANTE
        }
    }
}