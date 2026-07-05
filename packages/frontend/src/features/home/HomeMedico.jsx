import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, CardContent, Typography, Box } from "@mui/material";
import EventNoteIcon from '@mui/icons-material/EventNote';
import PersonIcon from '@mui/icons-material/Person';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import CardBase from "../../shared/CardBase/CardBase";
import TituloSeccion from "../../shared/TituloSeccion/TituloSeccion";
import "./Home.css"; 

const HomeMedico = ({ user }) => {
  const navigate = useNavigate();

  const doctorActions = [
    {
      icon: <EventNoteIcon fontSize="large" />,
      title: "Mi Agenda y Turnos",
      description: "Revisá tus turnos del día, confirmá asistencias y gestioná tu disponibilidad horaria.",
      path: "/mi-agenda"
    },
    {
      icon: <LocalHospitalIcon fontSize="large" />,
      title: "Servicios y Sedes",
      description: "Administrá las prácticas que ofreces y las sedes donde atendés a tus pacientes.",
      path: "/mi-agenda"
    },
    {
      icon: <PersonIcon fontSize="large" />,
      title: "Mi Perfil",
      description: "Actualizá tus datos personales, honorarios y credenciales de acceso.",
      path: "/mi-perfil"
    }
  ];

  return (
    <div className="home-grid">
      <div className="banner p-4 p-md-5" style={{ minHeight: '300px', display: 'flex', alignItems: 'center' }}>
        <div className="d-flex flex-column w-100 w-md-75 banner-titulo" style={{ padding: '0 5%' }}>
          <h2 className="fw-bold titulo text-white" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)' }}>
            ¡Bienvenido a SweetMedical!
          </h2>
          <h6 className="banner banner-subtitulo text-white mt-3" style={{ fontSize: 'clamp(1rem, 3vw, 1.25rem)' }}>
            Desde acá vas a poder gestionar toda tu actividad profesional en la plataforma.
          </h6>
        </div>
      </div>

      <div className="funcionamiento w-100">
        <div className="d-flex flex-column bg-surface p-4 p-md-5">
          <TituloSeccion>¿Qué querés hacer hoy?</TituloSeccion>
          <h6 className="text-muted">Accesos rápidos a tu gestión diaria</h6>
        </div>
        
        <div className="d-flex justify-content-around w-100 mt-2 p-4 p-md-5 gap-4 flex-wrap">
          {doctorActions.map((action, index) => (
            <CardBase 
              key={index}
              className="bg-surface flex-grow-1" 
              style={{ minWidth: '280px', maxWidth: '350px', cursor: 'pointer', display: 'flex', flexDirection: 'column' }} 
              onClick={() => navigate(action.path)}
            >
              <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', p: 4, flex: 1 }}>
                <Box
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--color-primary)',
                    bgcolor: 'var(--color-primary-light)',
                    borderRadius: '50%',
                    padding: '16px',
                    mb: 2
                  }}
                >
                  {action.icon}
                </Box>
                <Typography variant="h5" component="div" sx={{ mb: 2, fontWeight: 'bold' }}>
                  {action.title}
                </Typography>
                <Typography sx={{ color: 'text.secondary', mb: 3 }}>
                  {action.description}
                </Typography>
                <Box sx={{ mt: 'auto' }}>
                  <Button variant="outlined" color="primary" sx={{ borderRadius: '20px' }}>
                    Ingresar
                  </Button>
                </Box>
              </CardContent>
            </CardBase>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomeMedico;
