import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import {
    Box,
    Button,
    Card,
    Typography,
    TextField,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    Stack
} from '@mui/material';


export default function SidebarFiltros({ sedes, especialidades, practicas, coberturas, nuevosFiltros }) {
    // Estados para controlar los filtros (puedes pasarlos como props más adelante)
    const [cobertura, setCobertura] = useState('');
    const [profesional, setProfesional] = useState('');
    const [especialidad, setEspecialidad] = useState('');
    const [practica, setPractica] = useState('');
    const [sede, setSede] = useState('');
    const [fechaDesde, setFechaDesde] = useState('');
    const [fechaHasta, setFechaHasta] = useState('');

    return (
        <Box
            component="aside"
            sx={{
                width: 280,
                backgroundColor: '#ffffff',
                borderRadius: 3,
                padding: 3,
                border: '1px solid #e2e8f0',
                boxShadow: '0 4px 6px rgba(0,0,0,0.01)'
            }}
        >
            {/* Título de la sección */}
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
                <FilterAltIcon sx={{ color: '#475569', fontSize: 20 }} />
                <Typography variant="h6" sx={{ fontSize: 16, fontWeight: 700, color: '#1e293b' }}>
                    Búsqueda de Turnos
                </Typography>
            </Stack>

            {/* Contenedor vertical de los formularios */}
            <Stack spacing={2.5}>

                {/* Mi Cobertura */}
                <FormControl fullWidth size="small">
                    <InputLabel id="cobertura-label">Mi Cobertura</InputLabel>
                    <Select
                        labelId="cobertura-label"
                        value={cobertura}
                        label="Mi Cobertura"
                        onChange={(e) => {
                            setCobertura(e.target.value)
                            nuevosFiltros();    
                        }}
                    >
                        {coberturas.map((cobertura) => (
                            <MenuItem key={cobertura.id} value={cobertura.nombre}>
                                {cobertura.nombre}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {/* Profesional */}
                <TextField
                    fullWidth
                    size="small"
                    label="Profesional"
                    placeholder="Nombre del médico..."
                    InputLabelProps={{ shrink: true }}
                    value={profesional}
                    onChange={(e) => setProfesional(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") nuevosFiltros();
                    }}
                />

                {/* Especialidad */}
                <FormControl fullWidth size="small">
                    <InputLabel id="especialidad-label">Especialidad</InputLabel>
                    <Select
                        labelId="especialidad-label"
                        value={especialidad?.id ?? ""}
                        label="Especialidad"
                        onChange={(e) => {
                            const espSeleccionada = especialidades.find(
                                esp => esp.id === e.target.value
                            );

                            setEspecialidad(espSeleccionada);
                            setPractica("");
                            nuevosFiltros();
                        }}
                    >
                        {especialidades.map((esp) => (
                            <MenuItem key={esp.id} value={esp.id}>
                                {esp.nombre}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {/* Práctica */}
                <FormControl fullWidth size="small">
                    <InputLabel id="practica-label">Práctica</InputLabel>
                    <Select
                        labelId="practica-label"
                        value={practica}
                        label="Práctica"
                        onChange={(e) => {
                            setPractica(e.target.value);
                            nuevosFiltros();
                        }}
                    >
                        {practicas
                            .filter((practica) => practica.idEspecialidad === especialidad?.id || practica.idEspecialidad === null)
                            .map((practica) => (
                                <MenuItem key={practica.id} value={practica.id}>
                                    {practica.nombre}
                                </MenuItem>
                            ))}
                    </Select>
                </FormControl>

                {/* Sede de atención */}
                <FormControl fullWidth size="small">
                    <InputLabel id="sede-label">Sede de atención</InputLabel>
                    <Select
                        labelId="sede-label"
                        value={sede}
                        label="Sede de atención"
                        onChange={(e) => {
                            setSede(e.target.value);
                            nuevosFiltros();
                        }}
                    >
                        {sedes.map((sede) => (
                            <MenuItem key={sede.id} value={sede.nombre}>
                                {sede.nombre}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {/* Rango de Fechas */}
                <Box>
                    <Typography variant="caption" sx={{ display: 'block', fontWeight: 600, mb: 1, color: '#1e293b' }}>
                        Rango de Fechas
                    </Typography>
                    <Stack direction="row" spacing={1}>
                        <TextField
                            size="small"
                            type="date"
                            //label="Desde"
                            //InputLabelProps={{ shrink: true }}
                            helperText="Desde"
                            value={fechaDesde}
                            onChange={(e) => {
                                const fechaSeleccionada = new Date(e.target.value);
                                const hoy = new Date().setHours(0, 0, 0, 0);
                                if(fechaSeleccionada < hoy) {
                                    alert("La fecha desde no puede ser anterior a hoy.");
                                    return;
                                }
                                if(fechaHasta && e.target.value > fechaHasta) {
                                    alert("La fecha desde no puede ser posterior a la fecha hasta.");
                                    return;
                                }
                                setFechaDesde(e.target.value);
                                nuevosFiltros();
                            }}
                            fullWidth
                        />
                        <TextField
                            size="small"
                            type="date"
                            //label="Hasta"
                            //InputLabelProps={{ shrink: true }}
                            helperText="Hasta"
                            value={fechaHasta}
                            onChange={(e) => {
                                const fechaSeleccionada = new Date(e.target.value);
                                const hoy = new Date().setHours(0, 0, 0, 0);
                                if(fechaSeleccionada <= hoy) {
                                    alert("La fecha hasta no puede ser anterior a hoy.");
                                    return;
                                }
                                if(fechaDesde && e.target.value < fechaDesde) {
                                    alert("La fecha hasta no puede ser anterior a la fecha desde.");
                                    return;
                                }
                                setFechaHasta(e.target.value);
                                nuevosFiltros();
                            }}
                            fullWidth
                        />
                    </Stack>
                </Box>

            </Stack>
        </Box>
    );
}

export function BusquedaTurnos() {
    return (
        <div className="container-busqueda">

            {/* SECCIÓN DERECHA: RESULTADOS */}
            <main className="contenido-resultados">
                <header className="header-resultados">
                    <h3>11 turnos disponibles</h3>
                    <div className="ordenar-por">
                        <label>Ordenar por:</label>
                        <select>
                            <option>Fecha (más próximos)</option>
                            <option>Mejor calificados</option>
                        </select>
                    </div>
                </header>

                <section className="lista-medicos">
                    {medicosEjemplo.map((medico) => (
                        <div key={medico.id} className="tarjeta-medico">

                            {/* Info principal del médico */}
                            <div className="info-principal">
                                <div className="avatar-placeholder">👩‍⚕️</div>
                                <div className="datos-medico">
                                    <h4>{medico.nombre}</h4>
                                    <p className="especialidad">{medico.especialidad}</p>
                                    <p className="detalles">{medico.sede} • {medico.matricula}</p>
                                    <div className="tags-practicas">
                                        <span>Ecocardiograma</span>
                                        <span>Stress Test</span>
                                    </div>
                                </div>
                                <div className="calificacion">
                                    ⭐ {medico.calificacion} <span className="votos">({medico.votos})</span>
                                </div>
                            </div>

                            {/* Cobertura y Link */}
                            <div className="cobertura-perfil">
                                <span className="badge-cobertura">{medico.cobertura}</span>
                                <a href="#perfil" className="link-perfil">Ver perfil &gt;</a>
                            </div>

                            {/* Selector de Turnos */}
                            <div className="seccion-turnos">
                                <p className="titulo-turnos">Próximos turnos disponibles</p>
                                <div className="grid-turnos">
                                    {medico.turnos.map((turno, index) => (
                                        <button key={index} className="boton-turno">
                                            <span className="fecha-turno">{turno.fecha}</span>
                                            <span className="hora-turno">{turno.hora}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                        </div>
                    ))}
                </section>
            </main>

        </div>
    );
}