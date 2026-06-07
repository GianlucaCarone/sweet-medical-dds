const medicosEjemplo = [
    { id: 1, nombre: "Dra. María Gómez" },
    { id: 2, nombre: "Dra. Valentina Cruz" },
    { id: 3, nombre: "Dr. Juan Perez" }
];
const especialidadesEjemplo = [
    { id: 1, nombre: "Cardiología" },
    { id: 2, nombre: "Dermatología" },
    { id: 3, nombre: "Neurología" }
];
const practicasEjemplo = [
    { id: 1, nombre: "Electrocardiograma", idEspecialidadPadre: 1 },
    { id: 2, nombre: "Ecocardiograma", idEspecialidadPadre: 1 },
    { id: 3, nombre: "Biopsia endomiocárdica", idEspecialidadPadre: 2 },
    { id: 4, nombre: "Valvuloplastia percutánea", idEspecialidadPadre: 2 },
    { id: 5, nombre: "Neurofisiología", idEspecialidadPadre: 3 }
];
const sedesEjemplo = [
    { id: 1, nombre: "Sede Belgrano" },
    { id: 2, nombre: "Sede Vicente López" }
];

export { medicosEjemplo, especialidadesEjemplo, practicasEjemplo, sedesEjemplo };