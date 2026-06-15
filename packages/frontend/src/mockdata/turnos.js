const turnosEjemplo = [
    {
        id: 1,
        medico: {
            id: 1,
            nombre: "Dra. María Gómez"
        },
        servicio: {
            id: 2,
            nombre: "Ecocardiograma",
            tipo: "practica"
        },
        sede: {
            id: 1,
            nombre: "Sede Belgrano"
        },
        fechaHora: "2024-06-04T08:00:00",
        costo: 0,
        estadoCobertura: "TOTAL"
    },
    {
        id: 2,
        medico: {
            id: 1,
            nombre: "Dra. María Gómez"
        },
        servicio: {
            id: 2,
            nombre: "Ecocardiograma",
            tipo: "practica"
        },
        sede: {
            id: 1,
            nombre: "Sede Belgrano"
        },
        fechaHora: "2024-06-04T08:45:00",
        costo: 0,
        estadoCobertura: "TOTAL"
    },
    {
        id: 3,
        medico: {
            id: 1,
            nombre: "Dra. María Gómez"
        },
        servicio: {
            id: 1,
            nombre: "Electrocardiograma",
            tipo: "practica"
        },
        sede: {
            id: 1,
            nombre: "Sede Belgrano"
        },
        fechaHora: "2024-06-04T09:30:00",
        costo: 0,
        estadoCobertura: "TOTAL"
    },
    {
        id: 4,
        medico: {
            id: 1,
            nombre: "Dra. María Gómez"
        },
        servicio: {
            id: 1,
            nombre: "Electrocardiograma",
            tipo: "practica"
        },
        sede: {
            id: 1,
            nombre: "Sede Belgrano"
        },
        fechaHora: "2024-06-04T10:45:00",
        costo: 0,
        estadoCobertura: "TOTAL"
    },
    {
        id: 5,
        medico: {
            id: 2,
            nombre: "Dra. Valentina Cruz"
        },
        servicio: {
            id: 5,
            nombre: "Neurofisiología",
            tipo: "practica"
        },
        sede: {
            id: 1,
            nombre: "Sede Belgrano"
        },
        fechaHora: "2024-06-04T08:30:00",
        costo: 18000,
        estadoCobertura: "PARCIAL"
    },
    {
        id: 6,
        medico: {
            id: 2,
            nombre: "Dra. Valentina Cruz"
        },
        servicio: {
            id: 5,
            nombre: "Neurofisiología",
            tipo: "practica"
        },
        sede: {
            id: 1,
            nombre: "Sede Belgrano"
        },
        fechaHora: "2024-06-04T09:00:00",
        costo: 18000,
        estadoCobertura: "PARCIAL"
    },
    {
        id: 7,
        medico: {
            id: 2,
            nombre: "Dra. Valentina Cruz"
        },
        servicio: {
            id: 5,
            nombre: "Neurofisiología",
            tipo: "practica"
        },
        sede: {
            id: 1,
            nombre: "Sede Belgrano"
        },
        fechaHora: "2024-06-04T09:30:00",
        costo: 18000,
        estadoCobertura: "PARCIAL"
    },
    {
        id: 8,
        medico: {
            id: 3,
            nombre: "Dr. Juan Pérez"
        },
        servicio: {
            id: 2,
            nombre: "Dermatología",
            tipo: "especialidad"
        },
        sede: {
            id: 2,
            nombre: "Sede Vicente López"
        },
        fechaHora: "2024-06-04T14:00:00",
        costo: 25000,
        estadoCobertura: "NO_CUBIERTA"
    },
    {
        id: 9,
        medico: {
            id: 3,
            nombre: "Dr. Juan Pérez"
        },
        servicio: {
            id: 2,
            nombre: "Dermatología",
            tipo: "especialidad"
        },
        sede: {
            id: 2,
            nombre: "Sede Vicente López"
        },
        fechaHora: "2024-06-04T14:30:00",
        costo: 25000,
        estadoCobertura: "NO_CUBIERTA"
    },
    {
        id: 10,
        medico: {
            id: 3,
            nombre: "Dr. Juan Pérez"
        },
        servicio: {
            id: 2,
            nombre: "Dermatología",
            tipo: "especialidad"
        },
        sede: {
            id: 2,
            nombre: "Sede Vicente López"
        },
        fechaHora: "2024-06-04T16:30:00",
        costo: 25000,
        estadoCobertura: "NO_CUBIERTA"
    }
];
const datosPaginacionEjemplo = {
  numeroPagina: 1,
  limitePorPagina: 10,
  totalPaginas: 4,
  totalResultados: 32,
};


    // src/mockdata/turnos.js

// 1. PRÓXIMOS TURNOS (Estados: RESERVADO, CONFIRMADO - Fechas en el futuro)
const proximosTurnos = [
  {
    id: '6a2f3a68b58424e0c2f0d2bc',
    medico: {
      _id: '6a08f604f7c7bdf4a7d78441',
      nombre: 'Dr. Franco',
      idUsuario: '6a07ded13b0b9c47c60dde80',
      matricula: '1234567890',
    },
    servicio: {
      _id: '6a18f928b3b9344d0e4c6f46',
      nombre: 'Oftalmología General',
      duracionTurnoEnMins: 30,
      tipo: 'Especialidad',
      costo: 10000,
    },
    // Fecha en el futuro
    fechaHora: '2026-08-15T11:00:00.000Z',
    sede: {
      _id: '6a08ff8d198602a8b2bcfbd6',
      nombre: 'Hospital Británico',
      direccion: 'Avenida Cabildo 2209',
    },
    estado: 'CONFIRMADO',
    historialEstado: [],
    costo: 10000,
    estadoCobertura: 'TOTAL', // Agregado según lo que devuelve tu TurnoService
  },
  {
    id: '6a2f3a68b58424e0c2f0d2c4',
    medico: {
      _id: '6a08f604f7c7bdf4a7d78442',
      nombre: 'Dra. Martínez',
      idUsuario: '6a07ded13b0b9c47c60dde81',
      matricula: '0987654321',
    },
    servicio: {
      _id: '6a18f928b3b9344d0e4c6f47',
      nombre: 'Cardiología',
      duracionTurnoEnMins: 45,
      tipo: 'Especialidad',
      costo: 15000,
    },
    fechaHora: '2026-08-20T14:30:00.000Z',
    sede: {
      _id: '6a08ff8d198602a8b2bcfbd7',
      nombre: 'Clínica Suizo Argentina',
      direccion: 'Av. Pueyrredón 1461',
    },
    estado: 'RESERVADO',
    historialEstado: [],
    costo: 15000,
    estadoCobertura: 'PARCIAL',
  },
  {
    id: '6a2f3a68b58424e0c2f0d2cc',
    medico: {
      _id: '6a08f604f7c7bdf4a7d78443',
      nombre: 'Dr. Gómez',
      idUsuario: '6a07ded13b0b9c47c60dde82',
      matricula: '1122334455',
    },
    servicio: {
      _id: '6a18f928b3b9344d0e4c6f48',
      nombre: 'Dermatología',
      duracionTurnoEnMins: 20,
      tipo: 'Especialidad',
      costo: 8000,
    },
    fechaHora: '2026-08-25T09:00:00.000Z',
    sede: {
      _id: '6a08ff8d198602a8b2bcfbd6',
      nombre: 'Hospital Británico',
      direccion: 'Avenida Cabildo 2209',
    },
    estado: 'CONFIRMADO',
    historialEstado: [],
    costo: 8000,
    estadoCobertura: 'NO_CUBIERTA',
  },
];

// 2. HISTORIAL DE TURNOS (Estados: FINALIZADO, CANCELADO - Fechas en el pasado)
const historialTurnos = [
  {
    id: '6a2f3a68b58424e0c2f0d2d4',
    medico: {
      _id: '6a08f604f7c7bdf4a7d78441',
      nombre: 'Dr. Franco',
      idUsuario: '6a07ded13b0b9c47c60dde80',
      matricula: '1234567890',
    },
    servicio: {
      _id: '6a18f928b3b9344d0e4c6f46',
      nombre: 'Oftalmología 1',
      duracionTurnoEnMins: 30,
      tipo: 'Especialidad',
      costo: 10000,
    },
    // Fecha en el pasado
    fechaHora: '2026-05-10T11:00:00.000Z',
    sede: {
      _id: '6a08ff8d198602a8b2bcfbd6',
      nombre: 'Hospital Británico',
      direccion: 'Avenida Cabildo 2209',
    },
    estado: 'FINALIZADO',
    historialEstado: [],
    costo: 10000,
    estadoCobertura: 'TOTAL',
  },
  {
    id: '6a2f3a68b58424e0c2f0d2dc',
    medico: {
      _id: '6a08f604f7c7bdf4a7d78444',
      nombre: 'Dra. Silva',
      idUsuario: '6a07ded13b0b9c47c60dde83',
      matricula: '5544332211',
    },
    servicio: {
      _id: '6a18f928b3b9344d0e4c6f49',
      nombre: 'Traumatología',
      duracionTurnoEnMins: 30,
      tipo: 'Especialidad',
      costo: 12000,
    },
    fechaHora: '2026-04-22T16:00:00.000Z',
    sede: {
      _id: '6a08ff8d198602a8b2bcfbd7',
      nombre: 'Clínica Suizo Argentina',
      direccion: 'Av. Pueyrredón 1461',
    },
    estado: 'CANCELADO',
    motivoCancelacion: 'El paciente reportó síntomas de COVID', // Agregamos un posible campo extra para tu UI
    historialEstado: [],
    costo: 12000,
    estadoCobertura: 'PARCIAL',
  },
];

// 3. ENVOLTORIO PAGINADO (Opcional: Si querés simular la respuesta HTTP completa)
export const mockRespuestaPaginada = {
  status: "success",
  data: proximosTurnos,
  paginacion: {
    numeroPagina: 1,
    limitePorPagina: 3,
    totalPaginas: 1,
    totalTurnos: proximosTurnos.length
  }
};
export { turnosEjemplo, datosPaginacionEjemplo, proximosTurnos, historialTurnos };