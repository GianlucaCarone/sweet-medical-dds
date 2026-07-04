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

const Home = () => {

  const { resetFilters } = useFilters();
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
  }, []);

  return <>
    <div className="home-grid">
      <div className="banner p-5">
        <div className="d-flex flex-column w-50 p-4 banner-titulo">
          <Chip
            className="w-50"
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
        <div className="d-flex flex-column bg-surface p-5">
          <TituloSeccion>¿Cómo funciona?</TituloSeccion>
          <h6 className="text-muted">Reservá tu turno en tres simples pasos</h6>
        </div>
        <div className="d-flex justify-content-around w-100 mt-2 p-5 gap-5">
          {howItWorksCards.map((step, index) => (
            <CardBase key={index} className="w-25 bg-surface">
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

      <div className="tieneObraSocial text-white d-flex justify-content-around align-items-center m-4 rounded">
        <div className="p-3">
          <h3>¿Tenés obra social?</h3>
          <h6 className="tieneObraSocialSubtitulo">Ingresá tus datos y consultá al instante qué está cubierto para vos.</h6>
        </div>
        <Button className="bg-neutral-light gap-3 h-50" onClick={goToAppointments}>
          <span>Ir a ver turnos</span>
          <ArrowForwardIcon />
        </Button>
      </div>
    </div>
  </>;
};

export default Home;
