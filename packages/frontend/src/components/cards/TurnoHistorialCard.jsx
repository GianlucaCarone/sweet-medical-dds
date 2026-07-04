import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import CardBase from '../../shared/CardBase/CardBase'
import { Box, Typography } from '@mui/material';

const HistorialInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const DoctorAvatar = styled.div`
  width: 52px;
  height: 52px;
  border-radius: 14px;
  background: var(--color-primary-light);
  color: var(--color-primary);
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  span {
    font-size: 18px;
  }
`;

const BtnSecundario = styled.button`
  height: 46px;
  padding: 0 18px;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid var(--color-divider);
  color: var(--color-text-muted);
  background: transparent;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  width: fit-content;
  align-self: end;

  &:hover {
    background: var(--color-divider);
    transform: translateY(-1px);

  }
`;

export default function TurnoHistorialCard({ turno }) {
  const navigate = useNavigate();

  const formatoFechaHora = (isoString) => {
  const fecha = new Date(isoString);
  const texto = fecha.toLocaleString("es-AR", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC"
  });
  return texto.charAt(0).toUpperCase() + texto.slice(1);
};

  const nombreMedico =
    typeof turno.medico === 'string' ? turno.medico : turno.medico?.nombre || 'Médico';

  const especialidad = turno.servicio?.nombre || turno.servicio?.tipo || 'Consulta';

  const fecha = formatoFechaHora(turno.fechaHora);

  return (
    <CardBase>
      <HistorialInfo>
        <DoctorAvatar>
          {turno.foto ? (
            <img src={turno.foto} alt={nombreMedico} />
          ) : (
            <span>{nombreMedico.slice(0, 2).toUpperCase()}</span>
          )}
        </DoctorAvatar>

        <Box>
          <Typography variant='h3'>{nombreMedico}</Typography>
          <Typography>
            {fecha} · {especialidad}
          </Typography>
        </Box>
      </HistorialInfo>

      <BtnSecundario
        onClick={() =>
          navigate('/busqueda-turnos', {
            state: {
              medico: turno.medico,
              especialidad: turno.especialidad,
              sede: turno.sede,
            },
          })
        }
      >
        Volver a pedir
      </BtnSecundario>
    </CardBase>
  );
}
