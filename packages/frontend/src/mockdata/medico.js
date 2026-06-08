// Catálogo Global de Sedes
export const globalSedesMock = [
  { _id: "sede_1", nombre: "Sede Central (Belgrano)", direccion: "Av. Cabildo 1234, CABA" },
  { _id: "sede_2", nombre: "Sede Norte (Pilar)", direccion: "Colectora Este Km 50.5, Pilar" },
  { _id: "sede_3", nombre: "Sede Sur (Lomas)", direccion: "España 420, Lomas de Zamora" }
];

// Catálogo Global de Servicios
export const globalServicesMock = [
  { _id: "srv_esp_1", tipo: "ESPECIALIDAD", nombre: "Cardiología Clínica", duracionEstimada: 30, costoBase: 15000 },
  { _id: "srv_esp_2", tipo: "ESPECIALIDAD", nombre: "Deportología", duracionEstimada: 40, costoBase: 18000 },
  { _id: "srv_prac_1", tipo: "PRACTICA", nombre: "Electrocardiograma", duracionEstimada: 15, costoBase: 5000 },
  { _id: "srv_prac_2", tipo: "PRACTICA", nombre: "Ecocardiograma Doppler", duracionEstimada: 45, costoBase: 25000 },
  { _id: "srv_prac_3", tipo: "PRACTICA", nombre: "Ergometría Computarizada", duracionEstimada: 30, costoBase: 12000 }
];

// Datos iniciales del médico
export const initialDoctorMock = {
  _id: "60d5ecb8b392d70015342341", // ObjectId real
  nombre: "Roberto",
  apellido: "Sánchez",
  fotoUrl: "https://ui-avatars.com/api/?name=Roberto+Sanchez&background=0D8ABC&color=fff&size=150",
  honorario: 15000,
  usuario: "roberto.sanchez@sweetmedical.com",
  telefono: "11-4567-8910",
  matricula: "MN 123456",
  documento: "30.123.456",
  // En Mongoose esto sería el resultado de un .populate('serviciosAsignados')
  serviciosAsignados: [
    { _id: "srv_esp_1", tipo: "ESPECIALIDAD", nombre: "Cardiología Clínica", duracionEstimada: 30, costoBase: 15000 },
    { _id: "srv_prac_1", tipo: "PRACTICA", nombre: "Electrocardiograma", duracionEstimada: 15, costoBase: 5000 }
  ],
  // Sedes asociadas al médico
  sedesAsignadas: [
    { _id: "sede_1", nombre: "Sede Central (Belgrano)", direccion: "Av. Cabildo 1234, CABA" }
  ],
  // Colección de disponibilidades ligadas a este médico
  disponibilidadHoraria: [
    { _id: "disp_1", diaSemana: "LUNES", horaInicio: "09:00", horaFin: "11:00", servicio: { _id: "srv_esp_1", nombre: "Cardiología Clínica" }, sede: { _id: "sede_1", nombre: "Sede Central (Belgrano)" } },
    { _id: "disp_2", diaSemana: "LUNES", horaInicio: "11:30", horaFin: "14:00", servicio: { _id: "srv_prac_1", nombre: "Electrocardiograma" }, sede: { _id: "sede_1", nombre: "Sede Central (Belgrano)" } }
  ]
};
