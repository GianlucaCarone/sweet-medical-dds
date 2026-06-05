import React from 'react';
import SidebarFiltros from './sidebarFiltros.jsx';
import TarjetaTurno from './tarjetaTurno.jsx';
import './busquedaTurnos.css';

// Mock de datos de ejemplo (Mapea 3 veces para rellenar la UI como en tu captura)
const turnosEjemplo = [
    {
        id: 1,
        nombre: "Dra. María Gómez",
        especialidad: "Cardiología",
        practica: "Ecocardiograma",
        sede: "Sede Belgrano",
        calificacion: 4.9,
        votos: 110,
        cobertura: "No cubierto",
        costo: 30000,
        turnos: [
            { fecha: "4 Jun", hora: "08:00" },
            { fecha: "4 Jun", hora: "08:30" },
            { fecha: "7 Jun", hora: "14:00" },
            { fecha: "7 Jun", hora: "14:30" }
        ]
    },
    {
        id: 2,
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
            { fecha: "4 Jun", hora: "08:00" },
            { fecha: "4 Jun", hora: "08:30" },
            { fecha: "7 Jun", hora: "14:00" },
            { fecha: "7 Jun", hora: "14:30" }
        ]
    },
    {
        id: 3,
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
            { fecha: "4 Jun", hora: "08:00" },
            { fecha: "4 Jun", hora: "08:30" },
            { fecha: "7 Jun", hora: "14:00" },
            { fecha: "7 Jun", hora: "14:30" }
        ]
    }
];

export default function BusquedaTurnos() {
    return (
        <div className="container-busqueda">

            {/* Sidebar de filtros desarrollado con Material UI */}
            <SidebarFiltros />

            {/* Contenedor de Resultados del lado derecho */}
            <main className="contenido-resultados">
                <header className="header-resultados">
                    <h3>11 turnos disponibles</h3>
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
                    {turnosEjemplo.map((turno) => (
                        <TarjetaTurno key={turno.id} turno={turno} />
                    ))}
                </section>
            </main>

        </div>
    );
}