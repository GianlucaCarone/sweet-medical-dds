import React from 'react';
import { useEffect, useState, useCallback } from "react";
import SidebarFiltros from './sidebarFiltros.jsx';
import TarjetaTurno from './tarjetaTurno.jsx';
import TarjetaTurnoSkeleton from './tarjetaTurnoSkeleton.jsx';
import CarritoTurnos from './carritoTurnos.jsx';
import Drawer from '@mui/material/Drawer';
import Pagination from '@mui/material/Pagination';
import './busquedaTurnos.css';

// Mock de datos de ejemplo (Mapea 3 veces para rellenar la UI como en tu captura)
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
const medicosEjemplo = [
    { id: 1, nombre: "Dra. María Gómez"},
    { id: 2, nombre: "Dra. Valentina Cruz"},
    { id: 3, nombre: "Dr. Juan Perez"}
];
const especialidadesEjemplo = [
    { id: 1, nombre: "Cardiología" },
    { id: 2, nombre: "Dermatología" },
    { id: 3, nombre: "Neurología" }
];
const practicasEjemplo = [
    { id: 1, nombre: "Electrocardiograma", idEspecialidad: 1 },
    { id: 2, nombre: "Ecocardiograma", idEspecialidad: 1 },
    { id: 3, nombre: "Biopsia endomiocárdica", idEspecialidad: 2 },
    { id: 4, nombre: "Valvuloplastia percutánea", idEspecialidad: 2 },
    { id: 5, nombre: "Neurofisiología", idEspecialidad: 3 }
];
const sedesEjemplo = [
    { id: 1, nombre: "Sede Belgrano" },
    { id: 2, nombre: "Sede Vicente López" }
];
const datosPaginacionEjemplo = {
    paginaActual: 1,
    limitePorPagina: 10,
    totalPaginas: 4,
    totalResultados: 32
};

function agruparTurnos(turnos) {
    const mapa = new Map();

    turnos.forEach((turno) => {
        const clave = [
            turno.medico.nombre,
            turno.servicio.id,
            turno.sede.nombre,
            turno.costo,
            turno.estadoCobertura,
        ].join("|");

        if (!mapa.has(clave)) {
            mapa.set(clave, {
                medico: turno.medico,
                servicio: turno.servicio,
                sede: turno.sede,
                costo: turno.costo,
                estadoCobertura: turno.estadoCobertura,
                turnos: [],
            });
        }

        mapa.get(clave).turnos.push({
            id: turno.id,
            horario: turno.fechaHora,
        });
    });

    return Array.from(mapa.values());
}

export default function BusquedaTurnos({ carrito, agregarTurnoAlCarrito, eliminarTurnoDelCarrito }) {
    const [pacienteID, setPacienteID] = useState(1);
    const [turnos, setTurnos] = useState(turnosEjemplo);
    const [conjuntosTurnos, setConjuntosTurnos] = useState(agruparTurnos(turnosEjemplo));
    const [carritoAbierto, setCarritoAbierto] = useState(false);
    const [loading, setLoading] = useState(true);
    const [paginaActual, setPaginaActual] = useState(datosPaginacionEjemplo.paginaActual);
    const [ordenarPor, setOrdenarPor] = useState("proximos");
    //const [turnosPreseleccionados, setTurnosPreseleccionados] = useState([]);

    const cargarTurnos = useCallback(() => {
        setLoading(true);
        setTimeout(() => setLoading(false), 500);
        // const response = await obtenerTurnos(filtros);
        // setTurnos(response.data);
        // setPaginacion(response.paginacion);
        // setLoading(false);
    }, [ordenarPor]);

    const agregarAlCarrito = (id) => {
        const turno = turnos.find(t => t.id === id);
        agregarTurnoAlCarrito(turno);
        setCarritoAbierto(true);
    };
    const eliminarDelCarrito = (id) => {
        eliminarTurnoDelCarrito(id);
    };

    useEffect(() => {
        cargarTurnos();
    }, [cargarTurnos]);

    return (
        <div className="container-busqueda">

            {/* Sidebar de filtros desarrollado con Material UI */}
            <SidebarFiltros
                medicos={medicosEjemplo}
                sedes={sedesEjemplo}
                especialidades={especialidadesEjemplo}
                practicas={practicasEjemplo}
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
                        : conjuntosTurnos.map((turno) => (
                            <TarjetaTurno
                                key={turno.id}
                                turno={turno}
                                especialidades={especialidadesEjemplo}
                                practicas={practicasEjemplo}
                                carrito={carrito}
                                onReservar={agregarAlCarrito}
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
            
            <Drawer
                anchor="right"
                open={carritoAbierto}
                onClose={() => setCarritoAbierto(false)}
            >
                <CarritoTurnos
                    items={carrito}
                    onEliminar={eliminarDelCarrito}
                    onCerrar={() => setCarritoAbierto(false)}
                />
            </Drawer>
        </div>
    );
}