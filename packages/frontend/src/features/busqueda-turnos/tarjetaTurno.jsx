import React from 'react';
import LocationPinIcon from '@mui/icons-material/LocationPin';
import StarIcon from '@mui/icons-material/Star';
import EventNoteIcon from '@mui/icons-material/EventNote';
import PersonIcon from '@mui/icons-material/Person';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import './tarjetaTurno.css';

export default function TarjetaTurno({ turno }) {
    return (
        <div className="tarjeta-turno">

            <div className="info-principal">
                <div className="info-medico">
                    <div className="avatar-placeholder">
                        <PersonIcon fontSize="24px" />
                    </div>

                    <div className="datos-turno">
                        <h4>{turno.nombre}</h4>

                        <p className="especialidad-practica">
                            <MedicalServicesIcon fontSize="15px" />
                            {turno.especialidad} • {turno.practica || "Consulta general"}
                        </p>

                        <p className="detalles">
                            <LocationPinIcon fontSize="15px" />
                            {turno.sede}
                        </p>
                    </div>
                </div>

                <div className="info-lateral">
                    <div className="calificacion">
                        <StarIcon fontSize="15px" />
                        {turno.calificacion}
                        <span className="votos">({turno.votos})</span>
                    </div>

                    <span className="badge-cobertura">
                        {turno.cobertura}
                    </span>

                    <span className="costo-turno">
                        {turno.costo !== null
                            ? `$${turno.costo.toLocaleString()}`
                            : "Sin costo"}
                    </span>
                </div>
            </div>

            {/* Grid de Turnos inferiores */}
            <div className="seccion-turnos">
                <p className="titulo-turnos">Próximos turnos disponibles</p>
                <div className="grid-turnos">
                    {turno.turnos.map((turno, index) => (
                        <button key={index} className="boton-turno">
                            <EventNoteIcon fontSize="15px" />
                            <span className="fecha-turno">{turno.fecha}</span>
                            <span className="hora-turno">{turno.hora}</span>
                        </button>
                    ))}
                </div>
            </div>

        </div>
    );
}