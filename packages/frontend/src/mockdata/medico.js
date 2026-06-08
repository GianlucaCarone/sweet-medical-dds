//Sedes
export const globalSedesMock = [
  { _id: "sede_1", nombre: "Sede Central (Belgrano)", direccion: "Av. Cabildo 1234, CABA" },
  { _id: "sede_2", nombre: "Sede Norte (Pilar)", direccion: "Colectora Este Km 50.5, Pilar" },
  { _id: "sede_3", nombre: "Sede Sur (Lomas)", direccion: "España 420, Lomas de Zamora" }
];

// Servicios
export const globalServicesMock = [
  { _id: "srv_esp_1", tipo: "ESPECIALIDAD", nombre: "Cardiología Clínica", duracionEstimada: 30, costoBase: 15000 },
  { _id: "srv_esp_2", tipo: "ESPECIALIDAD", nombre: "Deportología", duracionEstimada: 40, costoBase: 18000 },
  { _id: "srv_prac_1", tipo: "PRACTICA", nombre: "Electrocardiograma", duracionEstimada: 15, costoBase: 5000 },
  { _id: "srv_prac_2", tipo: "PRACTICA", nombre: "Ecocardiograma Doppler", duracionEstimada: 45, costoBase: 25000 },
  { _id: "srv_prac_3", tipo: "PRACTICA", nombre: "Ergometría Computarizada", duracionEstimada: 30, costoBase: 12000 }
];

// medico
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
  serviciosAsignados: [
    { _id: "srv_esp_1", tipo: "ESPECIALIDAD", nombre: "Cardiología Clínica", duracionEstimada: 30, costoBase: 15000 },
    { _id: "srv_prac_1", tipo: "PRACTICA", nombre: "Electrocardiograma", duracionEstimada: 15, costoBase: 5000 }
  ],
  
  sedesAsignadas: [
    { _id: "sede_1", nombre: "Sede Central (Belgrano)", direccion: "Av. Cabildo 1234, CABA" }
  ],
  disponibilidadHoraria: [
    { _id: "disp_1", diaSemana: "LUNES", horaInicio: "09:00", horaFin: "11:00", servicio: { _id: "srv_esp_1", nombre: "Cardiología Clínica" }, sede: { _id: "sede_1", nombre: "Sede Central (Belgrano)" } },
    { _id: "disp_2", diaSemana: "LUNES", horaInicio: "11:30", horaFin: "14:00", servicio: { _id: "srv_prac_1", nombre: "Electrocardiograma" }, sede: { _id: "sede_1", nombre: "Sede Central (Belgrano)" } }
  ]
};

export const initialTurnosMock = [
  {
    id: "turno_1",
    medico: { _id: "60d5ecb8b392d70015342341", nombre: "Roberto", apellido: "Sánchez" },
    paciente: { id: "pac_1", nombre: "Carlos Larrañaga", dni: "32.456.789", obraSocial: "OSDE", plan: "310", usuario: "carlos.l@email.com" },
    servicio: { _id: "srv_esp_1", tipo: "ESPECIALIDAD", nombre: "Cardiología Clínica", duracionEstimada: 30, costoBase: 15000 },
    sede: { _id: "sede_1", nombre: "Sede Central (Belgrano)" },
    fechaHora: "2026-06-08T09:30:00",
    estado: "RESERVADO",
    costo: 15000,
    historialEstado: [
      { estado: "RESERVADO", usuario: "paciente", motivo: "" }
    ]
  },
  {
    id: "turno_2",
    medico: { _id: "60d5ecb8b392d70015342341", nombre: "Roberto", apellido: "Sánchez" },
    paciente: { id: "pac_2", nombre: "Ana Milstein", dni: "35.789.012", obraSocial: "Swiss Medical", plan: "SMG20", usuario: "ana.m@email.com" },
    servicio: { _id: "srv_prac_1", tipo: "PRACTICA", nombre: "Electrocardiograma", duracionEstimada: 15, costoBase: 5000 },
    sede: { _id: "sede_1", nombre: "Sede Central (Belgrano)" },
    fechaHora: "2026-06-08T04:15:00", // Menos de 1 hora de diferencia
    estado: "RESERVADO",
    costo: 5000,
    historialEstado: [
      { estado: "RESERVADO", usuario: "paciente", motivo: "" }
    ]
  },
  {
    id: "turno_3",
    medico: { _id: "60d5ecb8b392d70015342341", nombre: "Roberto", apellido: "Sánchez" },
    paciente: { id: "pac_3", nombre: "Beatriz Peluffo", dni: "28.901.234", obraSocial: "Galeno", plan: "Oro", usuario: "beatriz.p@email.com" },
    servicio: { _id: "srv_esp_1", tipo: "ESPECIALIDAD", nombre: "Cardiología Clínica", duracionEstimada: 30, costoBase: 15000 },
    sede: { _id: "sede_1", nombre: "Sede Central (Belgrano)" },
    fechaHora: "2026-06-09T10:00:00",
    estado: "CONFIRMADO",
    costo: 15000,
    historialEstado: [
      { estado: "RESERVADO", usuario: "paciente", motivo: "" },
      { estado: "CONFIRMADO", usuario: "medico", motivo: "" }
    ]
  },
  {
    id: "turno_4",
    medico: { _id: "60d5ecb8b392d70015342341", nombre: "Roberto", apellido: "Sánchez" },
    paciente: { id: "pac_1", nombre: "Carlos Larrañaga", dni: "32.456.789", obraSocial: "OSDE", plan: "310", usuario: "carlos.l@email.com" },
    servicio: { _id: "srv_esp_1", tipo: "ESPECIALIDAD", nombre: "Cardiología Clínica", duracionEstimada: 30, costoBase: 15000 },
    sede: { _id: "sede_1", nombre: "Sede Central (Belgrano)" },
    fechaHora: "2026-06-07T10:30:00", // Pasado
    estado: "REALIZADO",
    costo: 15000,
    historialEstado: [
      { estado: "RESERVADO", usuario: "paciente", motivo: "" },
      { estado: "CONFIRMADO", usuario: "medico", motivo: "" },
      { estado: "REALIZADO", usuario: "medico", motivo: "" }
    ]
  },
  {
    id: "turno_5",
    medico: { _id: "60d5ecb8b392d70015342341", nombre: "Roberto", apellido: "Sánchez" },
    paciente: { id: "pac_3", nombre: "Beatriz Peluffo", dni: "28.901.234", obraSocial: "Galeno", plan: "Oro", usuario: "beatriz.p@email.com" },
    servicio: { _id: "srv_prac_1", tipo: "PRACTICA", nombre: "Electrocardiograma", duracionEstimada: 15, costoBase: 5000 },
    sede: { _id: "sede_1", nombre: "Sede Central (Belgrano)" },
    fechaHora: "2026-06-10T12:00:00",
    estado: "PENDIENTECAMBIO",
    fechaHoraPropuesta: "2026-06-12T11:00:00",
    costo: 5000,
    historialEstado: [
      { estado: "RESERVADO", usuario: "paciente", motivo: "" },
      { estado: "PENDIENTECAMBIO", usuario: "paciente", motivo: "Cambio de turno por viaje" }
    ]
  },
  {
    id: "turno_6",
    medico: { _id: "60d5ecb8b392d70015342341", nombre: "Roberto", apellido: "Sánchez" },
    paciente: { id: "pac_1", nombre: "Carlos Larrañaga", dni: "32.456.789", obraSocial: "OSDE", plan: "310", usuario: "carlos.l@email.com" },
    servicio: { _id: "srv_prac_1", tipo: "PRACTICA", nombre: "Electrocardiograma", duracionEstimada: 15, costoBase: 5000 },
    sede: { _id: "sede_1", nombre: "Sede Central (Belgrano)" },
    fechaHora: "2026-06-06T15:00:00",
    estado: "CANCELADO",
    costo: 5000,
    historialEstado: [
      { estado: "RESERVADO", usuario: "paciente", motivo: "" },
      { estado: "CANCELADO", usuario: "medico", motivo: "Cancelado por el médico debido a feriado" }
    ]
  },
  {
    id: "turno_7",
    medico: { _id: "123465", nombre: "Roberto", apellido: "Sánchez" },
    paciente: { id: "pac_1", nombre: "Carlos Larrañaga", dni: "32.456.789", obraSocial: "OSDE", plan: "310", usuario: "carlos.l@email.com" },
    servicio: { _id: "srv_prac_1", tipo: "PRACTICA", nombre: "Electrocardiograma", duracionEstimada: 15, costoBase: 5000 },
    sede: { _id: "sede_1", nombre: "Sede Central (Belgrano)" },
    fechaHora: "2026-06-06T15:00:00",
    estado: "CANCELADO",
    costo: 5000,
    historialEstado: [
      { estado: "RESERVADO", usuario: "paciente", motivo: "" },
      { estado: "CANCELADO", usuario: "medico", motivo: "Cancelado por el médico debido a feriado" }
    ]
  },
  {
    id: "turno_8",
    medico: { _id: "123645", nombre: "Roberto", apellido: "Sánchez" },
    paciente: { id: "pac_1", nombre: "Carlos Larrañaga", dni: "32.456.789", obraSocial: "OSDE", plan: "310", usuario: "carlos.l@email.com" },
    servicio: { _id: "srv_prac_1", tipo: "PRACTICA", nombre: "Electrocardiograma", duracionEstimada: 15, costoBase: 5000 },
    sede: { _id: "sede_1", nombre: "Sede Central (Belgrano)" },
    fechaHora: "2026-06-06T15:00:00",
    estado: "PENDIENTECAMBIO",
    costo: 5000,
    historialEstado: [
      { estado: "RESERVADO", usuario: "paciente", motivo: "" },
      { estado: "CANCELADO", usuario: "medico", motivo: "Cancelado por el médico debido a feriado" }
    ]
  },
  {
    id: "turno_9",
    medico: { _id: "123645", nombre: "Roberto", apellido: "Sánchez" },
    paciente: { id: "pac_1", nombre: "Carlos Larrañaga", dni: "32.456.789", obraSocial: "OSDE", plan: "310", usuario: "carlos.l@email.com" },
    servicio: { _id: "srv_prac_1", tipo: "PRACTICA", nombre: "Electrocardiograma", duracionEstimada: 15, costoBase: 5000 },
    sede: { _id: "sede_1", nombre: "Sede Central (Belgrano)" },
    fechaHora: "2026-06-06T15:00:00",
    estado: "CONFIRMADO",
    costo: 5000,
    historialEstado: [
      { estado: "RESERVADO", usuario: "paciente", motivo: "" },
      { estado: "CANCELADO", usuario: "medico", motivo: "Cancelado por el médico debido a feriado" }
    ]
  },
  {
    id: "turno_10",
    medico: { _id: "123645", nombre: "Roberto", apellido: "Sánchez" },
    paciente: { id: "pac_1", nombre: "Carlos Larrañaga", dni: "32.456.789", obraSocial: "OSDE", plan: "310", usuario: "carlos.l@email.com" },
    servicio: { _id: "srv_prac_1", tipo: "PRACTICA", nombre: "Electrocardiograma", duracionEstimada: 15, costoBase: 5000 },
    sede: { _id: "sede_1", nombre: "Sede Central (Belgrano)" },
    fechaHora: "2026-06-06T15:00:00",
    estado: "REALIZADO",
    costo: 5000,
    historialEstado: [
      { estado: "RESERVADO", usuario: "paciente", motivo: "" },
      { estado: "CANCELADO", usuario: "medico", motivo: "Cancelado por el médico debido a feriado" }
    ]
  },
  {
    id: "turno_11",
    medico: { _id: "60d5ecb8b392d70015342341", nombre: "Roberto", apellido: "Sánchez" },
    paciente: { id: "pac_1", nombre: "Carlos Larrañaga", dni: "32.456.789", obraSocial: "OSDE", plan: "310", usuario: "carlos.l@email.com" },
    servicio: { _id: "srv_esp_1", tipo: "ESPECIALIDAD", nombre: "Cardiología Clínica", duracionEstimada: 30, costoBase: 15000 },
    sede: { _id: "sede_1", nombre: "Sede Central (Belgrano)" },
    fechaHora: "2026-06-15T09:00:00",
    estado: "RESERVADO",
    costo: 15000,
    historialEstado: [
      { estado: "RESERVADO", usuario: "paciente", motivo: "Reserva de prueba 1" }
    ]
  },
  {
    id: "turno_12",
    medico: { _id: "60d5ecb8b392d70015342341", nombre: "Roberto", apellido: "Sánchez" },
    paciente: { id: "pac_2", nombre: "Ana Milstein", dni: "35.789.012", obraSocial: "Swiss Medical", plan: "SMG20", usuario: "ana.m@email.com" },
    servicio: { _id: "srv_esp_1", tipo: "ESPECIALIDAD", nombre: "Cardiología Clínica", duracionEstimada: 30, costoBase: 15000 },
    sede: { _id: "sede_1", nombre: "Sede Central (Belgrano)" },
    fechaHora: "2026-06-16T10:00:00",
    estado: "RESERVADO",
    costo: 15000,
    historialEstado: [
      { estado: "RESERVADO", usuario: "paciente", motivo: "Reserva de prueba 2" }
    ]
  },
  {
    id: "turno_13",
    medico: { _id: "60d5ecb8b392d70015342341", nombre: "Roberto", apellido: "Sánchez" },
    paciente: { id: "pac_3", nombre: "Beatriz Peluffo", dni: "28.901.234", obraSocial: "Galeno", plan: "Oro", usuario: "beatriz.p@email.com" },
    servicio: { _id: "srv_prac_1", tipo: "PRACTICA", nombre: "Electrocardiograma", duracionEstimada: 15, costoBase: 5000 },
    sede: { _id: "sede_1", nombre: "Sede Central (Belgrano)" },
    fechaHora: "2026-06-17T11:30:00",
    estado: "RESERVADO",
    costo: 5000,
    historialEstado: [
      { estado: "RESERVADO", usuario: "paciente", motivo: "Reserva de prueba 3" }
    ]
  }
];

