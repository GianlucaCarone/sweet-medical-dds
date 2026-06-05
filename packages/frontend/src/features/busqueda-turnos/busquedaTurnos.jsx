import React from 'react';
import { useEffect, useState } from "react";
import SidebarFiltros from './sidebarFiltros.jsx';
import TarjetaTurno from './tarjetaTurno.jsx';
import TarjetaTurnoSkeleton from './tarjetaTurnoSkeleton.jsx';
import './busquedaTurnos.css';

// Mock de datos de ejemplo (Mapea 3 veces para rellenar la UI como en tu captura)
const turnosEjemplo = [
    {
        nombre: "Dra. María Gómez",
        especialidad: "Cardiología",
        practica: "Ecocardiograma",
        sede: "Sede Belgrano",
        calificacion: 4.9,
        votos: 110,
        cobertura: "No cubierto",
        costo: 30000,
        turnos: [
            { id: 1, fecha: "4 Jun", hora: "08:00" },
            { id: 2, fecha: "4 Jun", hora: "08:30" },
            { id: 3, fecha: "7 Jun", hora: "14:00" },
            { id: 4, fecha: "7 Jun", hora: "14:30" }
        ]
    },
    {
        nombre: "Dra. Valentina Cruz",
        especialidad: "Cardiología",
        practica: "Electrocardiograma",
        sede: "Sede Belgrano",
        matricula: "MP 30090",
        calificacion: 4.7,
        votos: 126,
        cobertura: "Cobertura Parcial",
        costo: 15000,
        turnos: [
            { id: 5, fecha: "4 Jun", hora: "08:00" },
            { id: 6, fecha: "4 Jun", hora: "08:30" },
            { id: 7, fecha: "7 Jun", hora: "14:00" },
            { id: 8, fecha: "7 Jun", hora: "14:30" }
        ]
    },
    {
        nombre: "Dr. Juan Pérez",
        especialidad: "Cardiología",
        practica: null,
        sede: "Sede Belgrano",
        matricula: "MP 30721",
        calificacion: 4.8,
        votos: 304,
        cobertura: "Cobertura Total",
        costo: null,
        turnos: [
            { id: 9, fecha: "4 Jun", hora: "08:00" },
            { id: 10, fecha: "4 Jun", hora: "08:30" },
            { id: 11, fecha: "7 Jun", hora: "14:00" },
            { id: 12, fecha: "7 Jun", hora: "14:30" }
        ]
    }
];
const obrasSocialesEjemplo = [
    { id: 1, nombre: "OSDE" },
    { id: 2, nombre: "Swiss Medical" },
    { id: 3, nombre: "Galeno" },
    { id: 4, nombre: "Medifé" },
    { id: 5, nombre: "Omint" },
    { id: 6, nombre: "PAMI" }
];
const especialidadesEjemplo = [
    { id: 1, nombre: "Cardiología" },
    { id: 2, nombre: "Dermatología" },
    { id: 3, nombre: "Ginecología" },
    { id: 4, nombre: "Oftalmología" },
    { id: 5, nombre: "Pediatría" },
    { id: 6, nombre: "Traumatología" },
    { id: 7, nombre: "Clínica médica" },
    { id: 8, nombre: "Odontología" }
];
const practicasEjemplo = [
    { id: 0, nombre: "Consulta General", idEspecialidad: null },
    { id: 1, nombre: "Electrocardiograma", idEspecialidad: 1 },
    { id: 2, nombre: "Ecografia", idEspecialidad: 1 },
    { id: 3, nombre: "Chequeo Pedriatrico", idEspecialidad: 1 },
    { id: 4, nombre: "Extraccion de Sangre", idEspecialidad: 2 },
    { id: 5, nombre: "Radriografia", idEspecialidad: 2 },
    { id: 6, nombre: "Tratamiento de Piel", idEspecialidad: 8 }
];
const sedesEjemplo = [
    { id: 1, nombre: "Sede Belgrano" },
    { id: 2, nombre: "Sede Vicente López" },
    { id: 3, nombre: "Sede Avellandeda" },
    { id: 4, nombre: "Sede La Plata" },
    { id: 5, nombre: "Sede Recoleta" }
];

export default function BusquedaTurnos() {
    const [turnos, setTurnos] = useState(turnosEjemplo);
    const [loading, setLoading] = useState(true);

    const cargarTurnos = () => {        // 👈 fuera del useEffect
        setLoading(true);
        setTimeout(() => setLoading(false), 500);
        // const response = await obtenerTurnos(filtros);
        // setTurnos(response);
    };

    useEffect(() => {
        cargarTurnos();
    }, []);

    return (
        <div className="container-busqueda">

            {/* Sidebar de filtros desarrollado con Material UI */}
            <SidebarFiltros 
                sedes={sedesEjemplo} 
                especialidades={especialidadesEjemplo} 
                practicas={practicasEjemplo} 
                coberturas={obrasSocialesEjemplo} 
                nuevosFiltros={cargarTurnos}
                />

            {/* Contenedor de Resultados del lado derecho */}
            <main className="contenido-resultados">
                <header className="header-resultados">
                    <h3>{turnos.length} turnos disponibles</h3>
                    <div className="ordenar-por">
                        <label>Ordenar por:</label>
                        <select defaultValue="proximos">
                            <option value="proximos">Fecha (más próximos)</option>
                            <option value="rating">Mejor calificados</option>
                        </select>
                    </div>
                </header>

                {/* Listado dinámico de las tarjetas médicas */}
               <section className="lista-turno">
                    {loading
                        ? Array.from({ length: 10 }).map((_, i) => ( //que la cantidad de skeletons sea igual al tamaño de pagina
                              <TarjetaTurnoSkeleton key={i} />
                          ))
                        : turnos.map((turno) => (
                              <TarjetaTurno
                                  key={turno.id}
                                  turno={turno}
                              />
                          ))}
                </section>
            </main>

        </div>
    );
}