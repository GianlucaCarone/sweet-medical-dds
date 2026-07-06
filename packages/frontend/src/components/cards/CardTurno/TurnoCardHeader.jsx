import styled from 'styled-components';
import { Avatar, Typography } from '@mui/material';
import HealingRoundedIcon from '@mui/icons-material/HealingRounded';
import BusinessRoundedIcon from '@mui/icons-material/BusinessRounded';
import EventRoundedIcon from '@mui/icons-material/EventRounded';
import AccessTimeFilledRoundedIcon from '@mui/icons-material/AccessTimeFilledRounded';
import BadgeEstado from '../../../shared/BadgeEstado';

// --- Styled Components ---

const CardHeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
`;

const InfoMedico = styled.div`
  display: flex;
  gap: 16px;
  flex: 1;
`;

const StyledAvatar = styled(Avatar)`
  && {
    width: 56px;
    height: 56px;
    background-color: var(--color-primary-light);
    color: var(--color-primary);
    font-size: 24px;
    font-weight: 600;
  }
`;

const DatosTurno = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;

  h4 {
    margin: 0;
    font-size: 20px;
    color: var(--color-text);
    font-weight: 600;
  }
`;

const DetailRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: ${(props) => (props.$muted ? 'var(--color-text-muted)' : 'var(--color-text)')};
  font-weight: ${(props) => (props.$muted ? '400' : '500')};

  svg {
    font-size: 18px;
    color: var(--color-text-muted);
  }
`;

const InfoLateral = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 12px;
`;

const CostoTurno = styled.span`
  font-size: 20px;
  color: var(--color-text);
  font-weight: 700;
`;

// --- Componente Principal ---

export default function TurnoCardHeader({ turno, especialidades = [], practicas = [] }) {
  const formatoServicio = (servicio = {}) => {
    const tipo = servicio?.tipo?.toLowerCase?.();
    const idServicio = servicio?.id || servicio?._id;

    if (tipo === 'especialidad') {
      return `${servicio?.nombre} • Consulta general`;
    }

    if (practicas.length > 0 && idServicio) {
      const practica = practicas.find((p) => p.id === idServicio || p._id === idServicio);
      if (practica) {
        const parentId = practica.especialidadPadreId?._id || practica.especialidadPadreId;
        const especialidad = especialidades.find((e) => e.id === parentId || e._id === parentId);
        return `${especialidad?.nombre || ''} • ${practica.nombre}`;
      }
    }
    return `${servicio?.nombre || 'Servicio'}`;
  };

  // Función helper para obtener la inicial del médico (ej: "Dr. Franco" -> "F")
  const getInicialMedico = (nombre) => {
    if (!nombre) return 'M';
    const nombreLimpio = nombre.replace('Dr. ', '').replace('Dra. ', '').trim();
    return nombreLimpio.charAt(0).toUpperCase();
  };

  return (
    <CardHeaderContainer>
      <InfoMedico>
        {/* Reemplazamos el PersonIcon por un Avatar moderno */}
        <StyledAvatar>{getInicialMedico(turno.medico?.nombre)}</StyledAvatar>

        <DatosTurno>
          <Typography variant='h4'>{turno.medico?.nombre}</Typography>

          <DetailRow>
            <HealingRoundedIcon />
            <span>{formatoServicio(turno.servicio)}</span>
          </DetailRow>

          <DetailRow $muted>
            <BusinessRoundedIcon />
            <span>{turno.sede?.nombre}</span>
          </DetailRow>
        {turno.fechaHora && turno.estado !== "DISPONIBLE" &&
            <DetailRow $muted>
              <EventRoundedIcon />
              <span>{new Date(turno.fechaHora).toLocaleDateString('es-AR')}</span>
            </DetailRow>
        }
        {turno.fechaHora && turno.estado !== "DISPONIBLE" &&
            <DetailRow $muted>
              <AccessTimeFilledRoundedIcon />
              <span>{new Date(turno.fechaHora).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })} hs</span>
            </DetailRow>
        }
        {turno.estado === "PENDIENTECAMBIO" && 
            <DetailRow >
              <EventRoundedIcon />
              <span>Fecha propuesta: {new Date(turno.fechaHoraPropuesta).toLocaleDateString('es-AR') + " a las " + new Date(turno.fechaHoraPropuesta).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }) + " hs"}</span>
            </DetailRow>
        }
        </DatosTurno>
      </InfoMedico>

      <InfoLateral>
        <BadgeEstado status={turno.estadoCobertura} />

        <CostoTurno>
          {turno.costo !== 0 ? `$${turno?.costo?.toLocaleString()} ` : 'Sin costo'}
        </CostoTurno>
      </InfoLateral>
    </CardHeaderContainer>
  );
}
