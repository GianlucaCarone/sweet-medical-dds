import "./Home.css";
import Chip from "@mui/material/Chip";
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import BuscadorTurnos from "../../components/buscadorTurnos/BuscadorTurnos";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SearchIcon from '@mui/icons-material/Search';
import Box from '@mui/material/Box';

const Home = () => {
  return <>
  <div className="home-grid">
    <div className="banner">
      <div className="d-flex flex-column w-50 p-4 banner-titulo">
        <Chip
          className="w-50"
          icon={ <ShieldOutlinedIcon sx={{ color: "white" }}/> }
          label="Cobertura según tu obra social en tiempo real"
          sx={{ color: "white", "& .MuiChip-icon": { color: "white" } }}
        />
        <h2 className="fw-bold fs-1">Tu salud, a un clic de distancia</h2>
        <h6 className="banner banner-subtitulo">Gestiona tus turnos médicos de manera fácil y rápida. Encontrá especialistas, revisá tu cobertura y agendá en segundos.</h6>
        {/* <BuscadorTurnos/> */}
      </div>
    </div>
    
    <div className="infoEstadistica">  
      <div className="d-flex justify-content-around align-items-center">
        <div className="d-flex flex-column">
          <span className="spanEstadistica">500+</span>
          <span>Profesionales</span>
        </div>
        <div className="d-flex flex-column">
          <span className="spanEstadistica">35+</span>
          <span>Obras Sociales</span>
        </div>
        <div className="d-flex flex-column">
          <span className="spanEstadistica">12.000+</span>
          <span>Turnos reservados</span>
        </div>
        <div className="d-flex flex-column">
          <span className="spanEstadistica">+18</span>
          <span>Sedes en AMBA</span>
        </div>
      </div>
    </div>

    <div className="profesionales">
      <div className="d-flex justify-content-between">
        <div className="d-flex flex-column">
          <h3>Profesionales</h3>
          <h6 className="text-muted">Los mejores valorados por nuestros pacientes</h6>
        </div>
        <Button/>
      </div>
      {/* <CardDeMedico/> */}
    </div>

    <div className="funcionamiento">
      <div className="d-flex flex-column">
        <h3>¿Cómo funciona?</h3>
        <h6 className="text-muted">Reservá tu turno en tres simples pasos</h6>
      </div>
      <Card className="d-flex">
        <CardContent>
          <Typography sx={{ color: 'text.secondary', fontSize: 40 }}>
            01
          </Typography>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'primary.main', // Color del tema (puedes usar un hex de tu paleta, ej: '#1976d2')
              color: '#white',                // Color del icono blanco para que contraste
              borderRadius: '12px',            // Bordes rounded (usa '50%' si quieres un círculo perfecto)
              padding: '12px',                 // Espaciado interno para darle tamaño al bloque
              boxShadow: 2                     // Sombra sutil opcional de MUI
            }}
          >
            <SearchIcon fontSize="medium" />
          </Box>
          <Typography variant="h5" component="div">
            benevolent
          </Typography>
          <Typography sx={{ color: 'text.secondary', mb: 1.5 }}>adjective</Typography>
          <Typography variant="body2">
            well meaning and kindly.
            <br />
            {'"a benevolent smile"'}
          </Typography>
        </CardContent>

        <CardContent>
          <Typography sx={{ color: 'text.secondary', fontSize: 40 }}>
            02
          </Typography>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'primary.main', // Color del tema (puedes usar un hex de tu paleta, ej: '#1976d2')
              color: '#white',                // Color del icono blanco para que contraste
              borderRadius: '12px',            // Bordes rounded (usa '50%' si quieres un círculo perfecto)
              padding: '12px',                 // Espaciado interno para darle tamaño al bloque
              boxShadow: 2                     // Sombra sutil opcional de MUI
            }}
          >
            <EventAvailableIcon fontSize="medium" />
          </Box>
          <Typography variant="h5" component="div">
            benevolent
          </Typography>
          <Typography sx={{ color: 'text.secondary', mb: 1.5 }}>adjective</Typography>
          <Typography variant="body2">
            well meaning and kindly.
            <br />
            {'"a benevolent smile"'}
          </Typography>
        </CardContent>

        <CardContent>
          <Typography sx={{ color: 'text.secondary', fontSize: 40 }}>
            03
          </Typography>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'primary.main', // Color del tema (puedes usar un hex de tu paleta, ej: '#1976d2')
              color: '#white',                // Color del icono blanco para que contraste
              borderRadius: '12px',            // Bordes rounded (usa '50%' si quieres un círculo perfecto)
              padding: '12px',                 // Espaciado interno para darle tamaño al bloque
              boxShadow: 2                     // Sombra sutil opcional de MUI
            }}
          >
            <CheckCircleIcon fontSize="medium" />
          </Box>
          <Typography variant="h5" component="div">
            benevolent
          </Typography>
          <Typography sx={{ color: 'text.secondary', mb: 1.5 }}>adjective</Typography>
          <Typography variant="body2">
            well meaning and kindly.
            <br />
            {'"a benevolent smile"'}
          </Typography>
        </CardContent>
      </Card>
    </div>

    <div className="tieneObraSocial">
      <div>
        <h3>¿Tenés obra social?</h3>
        <h6 className="text-muted">Ingresá tus datos y consultá al instante qué está cubierto para vos.</h6>
      </div>
      <Button/>
    </div>
  </div>
  </>;
};

export default Home;
