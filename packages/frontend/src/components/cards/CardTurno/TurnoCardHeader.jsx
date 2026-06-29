import styled from 'styled-components';
import { Avatar, Typography } from '@mui/material';
import HealingRoundedIcon from '@mui/icons-material/HealingRounded';
import BusinessRoundedIcon from '@mui/icons-material/BusinessRounded';
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

// Estilizamos el Avatar nativo de MUI para que tenga los colores de tu marca
const StyledAvatar = styled(Avatar)`
  && {
    width: 56px;
    height: 56px;
    background-color: #f0fdf4; /* Un verde muy sutil */
    color: #16a34a; /* Verde principal para el texto */
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
    color: #1e293b;
    font-weight: 600;
  }
`;

// Usamos props transitorias ($muted) de styled-components para cambiar
// dinámicamente el estilo sin que React se queje en la consola.
const DetailRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: ${(props) => (props.$muted ? '#64748b' : '#334155')};
  font-weight: ${(props) => (props.$muted ? '400' : '500')};

  svg {
    font-size: 18px;
    color: #94a3b8;
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
  color: #1e293b;
  font-weight: 700;
`;

// --- Componente Principal ---

export default function TurnoCardHeader({ turno, especialidades = [], practicas = [] }) {
  const formatoServicio = (servicio = {}) => {
    const tipo = servicio?.tipo?.toLowerCase?.();
    if (tipo === 'especialidad') {
      return `${servicio?.nombre} • Consulta general`;
    }
    if (practicas.length > 0) {
      const practica = practicas.find((p) => p.id === servicio.id);
      if (practica) {
        const especialidad = especialidades.find((e) => e.id === practica.especialidadPadreId);
        return `${especialidad?.nombre || ''} • ${practica.nombre}`;
      }
    }
    return `${servicio?.nombre || 'Especialidad'} • ${servicio?.especialidadPadreId || 'Consulta'}`;
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
