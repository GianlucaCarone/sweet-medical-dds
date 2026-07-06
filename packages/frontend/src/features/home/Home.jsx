import { useNavigate } from "react-router-dom";
import "./Home.css";
import { Button, CardContent, Chip, Typography, Box } from "@mui/material";
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import SearchIcon from '@mui/icons-material/Search';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TituloSeccion from "../../shared/TituloSeccion/TituloSeccion";
import CardBase from "../../shared/CardBase/CardBase";
import SidebarFiltros from "../../components/busqueda-turnos/sidebarFiltros";
import { useFilters } from "../../context/FilterContext";
import { useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import HomeMedico from "./HomeMedico";

const Home = () => {

  const { resetFilters } = useFilters();
  const { user } = useAuth();
  const navigate = useNavigate();
  const howItWorksCards = [
    {
      number: "01",
      icon: <SearchIcon fontSize="medium" />,
      title: "Buscá tu especialidad",
      description: "Filtrá por especialidad, práctica, sede o rango de fechas. El sistema muestra tu cobertura automáticamente."
    },
    {
      number: "02",
      icon: <EventAvailableIcon fontSize="medium" />,
      title: "Elegí tu turno",
      description: "Visualizá el costo estimado según tu plan de obra social antes de confirmar la reserva."
    },
    {
      number: "03",
      icon: <CheckCircleIcon fontSize="medium" />,
      title: "Confirmá y listo",
      description: "Recibís una notificación al instante. El día previo te enviamos un recordatorio automático."
    }
  ];

  const goToAppointments = (e) => {
    if (e) e.stopPropagation();
    navigate("/busqueda-turnos");
  };
  useEffect( () => {
    resetFilters();
  }, [resetFilters]);

  if (user?.rol === "MEDICO") {
    return <HomeMedico user={user} />;
  }

  return <>
    <div className="home-grid">
      <div className="banner p-3 p-md-5">
        <div className="d-flex flex-column p-3 p-md-4 banner-titulo">
          <Chip
            className="chip-cobertura"
            icon={<ShieldOutlinedIcon sx={{ color: "white" }}/>}
            label="Cobertura según tu obra social en tiempo real"
            sx={{ color: "white", "& .MuiChip-icon": { color: "white" } }}
          />
          <h2 className="fw-bold titulo">Tu salud, a un clic de distancia</h2>
          <h6 className="banner banner-subtitulo">Gestiona tus turnos médicos de manera fácil y rápida. Encontrá especialistas, revisá tu cobertura y agendá en segundos.</h6>
          <SidebarFiltros
            direction="horizontal"
            onSearch={goToAppointments}
          />
        </div>
      </div>

      <div className="funcionamiento">
        <div className="d-flex flex-column bg-surface p-4 p-md-5 text-center text-md-start">
          <TituloSeccion>¿Cómo funciona?</TituloSeccion>
          <h6 className="text-muted">Reservá tu turno en tres simples pasos</h6>
        </div>
        <div className="cards-container mt-2 p-3 p-md-5 gap-4 gap-md-5">
          {howItWorksCards.map((step, index) => (
            <CardBase key={index} className="step-card bg-surface">
              <CardContent>
                <Box sx={{ display: "inline-flex"}}>
                  <Typography sx={{ color: 'text.secondary', fontSize: 40 }}>
                    {step.number}
                  </Typography>
                  <Box
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'primary.main',
                      padding: '12px'
                    }}
                  >
                    {step.icon}
                  </Box>
                </Box>
                <Typography variant="h5" component="div">
                  {step.title}
                </Typography>
                <Typography sx={{ color: 'text.secondary', mb: 1.5 }}>
                  {step.description}
                </Typography>
              </CardContent>
            </CardBase>
          ))}
        </div>
      </div>

      <div className="tieneObraSocial text-white d-flex flex-column flex-md-row justify-content-around align-items-center m-3 m-md-4 p-4 rounded text-center text-md-start gap-4">
        <div>
          <h3>¿Tenés obra social?</h3>
          <h6 className="tieneObraSocialSubtitulo mb-0">Ingresá tus datos y consultá al instante qué está cubierto para vos.</h6>
        </div>
        <Button className="bg-neutral-light gap-3 py-2 px-4" onClick={goToAppointments}>
          <span>Ir a ver turnos</span>
          <ArrowForwardIcon />
        </Button>
      </div>
    </div>
  </>;
};

export default Home;
