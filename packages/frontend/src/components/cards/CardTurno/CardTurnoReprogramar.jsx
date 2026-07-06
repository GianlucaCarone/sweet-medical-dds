import styled from 'styled-components';
import TurnoCardLayout from '../../../shared/TurnoCardLayout.jsx';
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";

// --- 1. Styled Components ---
const TurnoFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;


// --- 2. Componente Principal ---
export default function CardTurnoReprogramar({ turno }) {
  return (
    <>
      <TurnoCardLayout turno={turno}>
        <TurnoFooter>
          <div className="reprogramar-detalles">
            <span>
              <CalendarMonthRoundedIcon fontSize="small" />
              {new Date(turno.fechaHora).toLocaleDateString('es-AR', { day: 'numeric', month: 'short' })}
            </span>

            <span>
              <AccessTimeRoundedIcon fontSize="small" />
              {new Date(turno.fechaHora).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}
            </span>

            <span>
              <LocationOnRoundedIcon fontSize="small" />
              {turno.sede?.nombre}
            </span>
          </div>
        </TurnoFooter>
      </TurnoCardLayout>
    </>
  );
}