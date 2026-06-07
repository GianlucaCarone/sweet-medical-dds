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
        estadoCobertura: "TOTALMENTE CUBIERTA"
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
        estadoCobertura: "TOTALMENTE CUBIERTA"
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
        estadoCobertura: "TOTALMENTE CUBIERTA"
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
        estadoCobertura: "TOTALMENTE CUBIERTA"
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
        estadoCobertura: "PARCIALMENTE CUBIERTA"
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
        estadoCobertura: "PARCIALMENTE CUBIERTA"
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
        estadoCobertura: "PARCIALMENTE CUBIERTA"
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
        estadoCobertura: "NO CUBIERTA"
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
        estadoCobertura: "NO CUBIERTA"
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
        estadoCobertura: "NO CUBIERTA"
    }
];
const datosPaginacionEjemplo = {
    paginaActual: 1,
    limitePorPagina: 10,
    totalPaginas: 4,
    totalResultados: 32
};

export { turnosEjemplo, datosPaginacionEjemplo };