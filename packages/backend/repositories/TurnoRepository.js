import { EstadoTurnoEnum } from "../domain/turnos/estadoTurnoEnum.js";
import { BadRequestError } from "../errors/AppError.js";
import { TurnoModel } from "../schemas/dataBase/turnoSchemaDB.js";

export class TurnoRepository {
    constructor() {
        this.model = TurnoModel;
    }

    // Si bien la creación de turnos será por un cronjob
    // se agrega el método dentro de turno repository para llamarlo
    // y no declararlos dos veces
    async crear(turnoDto) {
        return await this.model.create(turnoDto);
    }

    async findAll() {
        return await this.model.find().lean().exec();  // no es necesariamente obligatorio pero mejora el Stack Traces y devuelve una promesa de js 
    }

    async findByEstado(estado) {
        this.validarEstado(estado);
        return await this.model.find({ estado }).lean().exec();
    }

    async findById(id) {
        return await this.model.findById(id).lean().exec();
    }

    async save(turno) {
        const nuevoTurno = new this.model(turno);
        return await nuevoTurno.save();
    }

    async update(id, turno) {
        return await this.model.findByIdAndUpdate(id, turno, { new: true }).exec();
    }

    async existeTurno(medicoId, fechaHora) {
        const fechaNormalizada = new Date(fechaHora);
        fechaNormalizada.setSeconds(0, 0);

        const turnoExistente = await this.model.findOne({
            medico: medicoId,
            fechaHora: fechaNormalizada
        }).exec();

        return turnoExistente !== null;
    }
    /*
    La plataforma deberá permitir a los pacientes realizar la búsqueda de turnos 
disponibles, teniendo en cuenta tanto criterios médicos como las condiciones de 
cobertura del paciente. 
La búsqueda de turnos deberá soportar, como mínimo, los siguientes filtros: 
● Profesional (médico específico). 
● Especialidad. 
● Práctica. 
● Sede de atención. 
● Rango de fechas. 
Al momento de realizar la búsqueda, el Sistema deberá considerar la obra social y 
el plan del paciente, de modo de poder calcular y mostrar, para cada turno 
disponible: 
● Si la prestación se encuentra cubierta, parcialmente cubierta o no cubierta. 
● El monto que el paciente deberá abonar en caso de reservar dicho turno.
    */



    async obtenerPaginados(numeroPagina, limitePorPagina, filtros = {}) {
        const query = {};

        if (filtros.estado !== undefined) {
            query.estado = filtros.estado;
        }
        if (filtros.sedeId !== undefined) {
            query.sede = filtros.sedeId;
        }
        if (filtros.pacienteId !== undefined) {
            query.paciente = filtros.pacienteId;
        }

        if (filtros.fechaHoraInicio !== undefined || filtros.fechaHoraFin !== undefined) {
            query.fechaHora = {};
            if (filtros.fechaHoraInicio !== undefined) query.fechaHora.$gte = filtros.fechaHoraInicio;
            if (filtros.fechaHoraFin !== undefined) query.fechaHora.$lte = filtros.fechaHoraFin;
        }

        /*
        TODO: filtro de medico -> No confiamos en el front y esta solucion soluciona esto
         si esta definido el id de medico y tambien de especialiad o practica o ambas, se pisaria
         el front deberia poner una restriccion para que si pones el filtro de medico no puedas filtrar por especialida o practica
        */
        if (filtros.medicoId !== undefined) {
            query.medico = filtros.medicoId;
        }

        if (filtros.servicioId !== undefined) {
            query.servicio = filtros.servicioId;
        }

        const ordenamiento = {};
        if (filtros.ordenPorCosto !== undefined) {
             ordenamiento.costoBase = filtros.ordenPorCosto === 'desc' ? -1 : 1;
        }
        if (filtros.ordenPorFecha !== undefined) {
             ordenamiento.fechaHora = filtros.ordenPorFecha === 'desc' ? -1 : 1;
        }

        const inicio = (numeroPagina - 1) * limitePorPagina;

        // Ejecutar la consulta y el conteo en paralelo
        const [turnos, totalTurnos] = await Promise.all([
            this.model.find(query)
                .populate('medico paciente servicio sede')
                .sort(ordenamiento)
                .skip(inicio)
                .limit(limitePorPagina)
                .lean()
                .exec(),
            this.model.countDocuments(query).exec()
        ]);

        return {
            turnos,
            totalTurnos
        };
    }

    validarEstado(estado) {
        if (!Object.values(EstadoTurnoEnum).includes(estado)) {
            throw new BadRequestError("Estado de turno inválido");
        }
    }
}