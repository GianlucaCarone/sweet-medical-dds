import React from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";
import { useAuth } from "../../context/AuthContext.jsx";

// Importamos los íconos específicos de Material UI
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import FormatListBulletedRoundedIcon from "@mui/icons-material/FormatListBulletedRounded";
import EventNoteIcon from "@mui/icons-material/EventNote";

const Navbar = () => {
  const { user } = useAuth();
  const rol = user?.rol;

  return (
    <nav className="navbar-menu">
      <ul className="nav-list">
        {/* Inicio — visible para todos */}
        <li className="nav-item">
          <NavLink to="/" className="nav-link" end>
            <span className="nav-icon"><HomeRoundedIcon fontSize="small" /></span>
            Inicio
          </NavLink>
        </li>

        {/* Solo para PACIENTE */}
        {rol === "PACIENTE" && (
          <>
            <li className="nav-item">
              <NavLink to="/busqueda-turnos" className="nav-link">
                <span className="nav-icon"><CalendarMonthRoundedIcon fontSize="small" /></span>
                Reservar Turno
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/mis-turnos" className="nav-link">
                <span className="nav-icon"><FormatListBulletedRoundedIcon fontSize="small" /></span>
                Mis Turnos
              </NavLink>
            </li>
          </>
        )}

        {/* Solo para MEDICO */}
        {rol === "MEDICO" && (
          <li className="nav-item">
            <NavLink to="/perfil-medico" className="nav-link">
              <span className="nav-icon"><EventNoteIcon fontSize="small" /></span>
              Mi Agenda
            </NavLink>
          </li>
        )}

        {/* Si no está logueado, mostrar Reservar Turno para que pueda ver (sin proteger) */}
        {!user && (
          <li className="nav-item">
            <NavLink to="/busqueda-turnos" className="nav-link">
              <span className="nav-icon"><CalendarMonthRoundedIcon fontSize="small" /></span>
              Buscar Turnos
            </NavLink>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;

