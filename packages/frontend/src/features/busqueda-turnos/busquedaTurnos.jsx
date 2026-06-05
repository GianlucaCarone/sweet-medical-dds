import React from 'react';
import { useEffect, useState } from "react";
import SidebarFiltros from './sidebarFiltros.jsx';
import TarjetaTurno from './tarjetaTurno.jsx';
import TarjetaTurnoSkeleton from './tarjetaTurnoSkeleton.jsx';
import Pagination from '@mui/material/Pagination';
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
            { id: 3, fecha: "5 Jun", hora: "14:00" },
            { id: 4, fecha: "5 Jun", hora: "14:30" }
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
            { id: 6, fecha: "5 Jun", hora: "08:30" },
            { id: 7, fecha: "6 Jun", hora: "14:00" },
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
            { id: 9, fecha: "9 Jun", hora: "08:00" },
            { id: 10, fecha: "9 Jun", hora: "08:30" },
            { id: 11, fecha: "9 Jun", hora: "14:00" },
            { id: 12, fecha: "9 Jun", hora: "14:30" },
            { id: 13, fecha: "10 Jun", hora: "08:00" },
            { id: 14, fecha: "10 Jun", hora: "08:30" },
            { id: 15, fecha: "10 Jun", hora: "14:00" },
            { id: 16, fecha: "10 Jun", hora: "14:30" },
            { id: 17, fecha: "11 Jun", hora: "08:00" },
            { id: 18, fecha: "11 Jun", hora: "08:30" },
            { id: 19, fecha: "11 Jun", hora: "14:00" },
            { id: 20, fecha: "11 Jun", hora: "14:30" },
            { id: 21, fecha: "12 Jun", hora: "08:00" },
            { id: 22, fecha: "12 Jun", hora: "08:30" },
            { id: 23, fecha: "12 Jun", hora: "14:00" },
            { id: 24, fecha: "12 Jun", hora: "14:30" },
            { id: 25, fecha: "13 Jun", hora: "08:00" },
            { id: 26, fecha: "13 Jun", hora: "08:30" },
            { id: 27, fecha: "13 Jun", hora: "14:00" },
            { id: 28, fecha: "13 Jun", hora: "14:30" },
            { id: 29, fecha: "14 Jun", hora: "08:00" },
            { id: 30, fecha: "14 Jun", hora: "08:30" },
            { id: 31, fecha: "14 Jun", hora: "14:00" },
            { id: 32, fecha: "14 Jun", hora: "14:30" }
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
    { id: null, nombre: "Consulta General", idEspecialidad: null },
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
const datosPaginacionEjemplo = {
    paginaActual: 1,
    limitePorPagina: 10,
    totalPaginas: 5,
    totalResultados: 3
};

export default function BusquedaTurnos() {
    const [turnos, setTurnos] = useState(turnosEjemplo);
    const [loading, setLoading] = useState(true);
    const [paginaActual, setPaginaActual] = useState(datosPaginacionEjemplo.paginaActual);
    const [filtros, setFiltros] = useState({
        sede: null,
        especialidad: null,
        practica: null,
        cobertura: null,
        fechaDesde: null,
        fechaHasta: null,
        pagina: datosPaginacionEjemplo.paginaActual,
        limite: datosPaginacionEjemplo.limitePorPagina
    });
    const [turno, setTurno] = useState(null);
    const [ordenarPor, setOrdenarPor] = useState("proximos");
    const [turnosPreseleccionados, setTurnosPreseleccionados] = useState([]);

    const cargarTurnos = () => {
        setLoading(true);
        setTimeout(() => setLoading(false), 500);
        // const response = await obtenerTurnos(filtros);
        // setTurnos(response);
    };

    useEffect(() => {
        cargarTurnos();
    }, [ordenarPor]);
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
                    <h3>{datosPaginacionEjemplo.totalResultados} turnos disponibles</h3>
                    <div className="ordenar-por">
                        <label>Ordenar por:</label>
                        <select defaultValue="proximos" onChange={(e) => setOrdenarPor(e.target.value)}>
                            <option value="proximos">Fecha (más próximos)</option>
                            <option value="calificacion">Mejor calificados</option>
                            <option value="costoAsc">Costo (más barato)</option>
                        </select>
                    </div>
                </header>

                {/* Listado dinámico de las tarjetas médicas */}
               <section className="lista-turno">
                    {loading
                        ? Array.from({ length: datosPaginacionEjemplo.limitePorPagina }).map((_, i) => ( //que la cantidad de skeletons sea igual al tamaño de pagina
                              <TarjetaTurnoSkeleton key={i} />
                          ))
                        : turnos.map((turno) => (
                              <TarjetaTurno
                                  key={turno.id}
                                  turno={turno}
                              />
                          ))}
                </section>
                <Pagination count={datosPaginacionEjemplo.totalPaginas} color="#137333" 
                    page={paginaActual}
                    onChange={(e, page) => {
                        setPaginaActual(page);
                        cargarTurnos();
                    }}
                />
            </main>

        </div>
    );
}