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


export default function SidebarFiltros() {
    // Estados para controlar los filtros (puedes pasarlos como props más adelante)
    const [cobertura, setCobertura] = useState('OSDE');
    const [especialidad, setEspecialidad] = useState('Todas');
    const [practica, setPractica] = useState('Todas');
    const [sede, setSede] = useState('Todas');
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
                        onChange={(e) => setCobertura(e.target.value)}
                    >
                        <MenuItem value="OSDE">OSDE</MenuItem>
                        <MenuItem value="SMG">Swiss Medical</MenuItem>
                        <MenuItem value="GALENO">Galeno</MenuItem>
                    </Select>
                </FormControl>

                {/* Profesional */}
                <TextField
                    fullWidth
                    size="small"
                    label="Profesional"
                    placeholder="Nombre del médico..."
                    InputLabelProps={{ shrink: true }}
                />

                {/* Especialidad */}
                <FormControl fullWidth size="small">
                    <InputLabel id="especialidad-label">Especialidad</InputLabel>
                    <Select
                        labelId="especialidad-label"
                        value={especialidad}
                        label="Especialidad"
                        onChange={(e) => setEspecialidad(e.target.value)}
                    >
                        <MenuItem value="Todas">Todas</MenuItem>
                        <MenuItem value="Cardiologia">Cardiología</MenuItem>
                        <MenuItem value="Pediatria">Pediatría</MenuItem>
                    </Select>
                </FormControl>

                {/* Práctica */}
                <FormControl fullWidth size="small">
                    <InputLabel id="practica-label">Práctica</InputLabel>
                    <Select
                        labelId="practica-label"
                        value={practica}
                        label="Práctica"
                        onChange={(e) => setPractica(e.target.value)}
                    >
                        <MenuItem value="Todas">Todas</MenuItem>
                    </Select>
                </FormControl>

                {/* Sede de atención */}
                <FormControl fullWidth size="small">
                    <InputLabel id="sede-label">Sede de atención</InputLabel>
                    <Select
                        labelId="sede-label"
                        value={sede}
                        label="Sede de atención"
                        onChange={(e) => setSede(e.target.value)}
                    >
                        <MenuItem value="Todas">Todas</MenuItem>
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
                            value={fechaDesde}
                            onChange={(e) => setFechaDesde(e.target.value)}
                            fullWidth
                        />
                        <TextField
                            size="small"
                            type="date"
                            value={fechaHasta}
                            onChange={(e) => setFechaHasta(e.target.value)}
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