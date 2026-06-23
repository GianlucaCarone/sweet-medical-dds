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
  background: #e7f1ef;
  color: #087f73;
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
  border: 2px solid #bac4c2;
  color: #526173;
  background: transparent;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  width: fit-content;
  align-self: end;

  &:hover {
    background: #bcc5cfc7;
    transform: translateY(-1px);

  }
`;

export default function TurnoHistorialCard({ turno }) {
  const navigate = useNavigate();

  const transformarFecha = (fechaHora) => {
    const opciones = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(fechaHora).toLocaleDateString('es-AR', opciones);
  };

  const nombreMedico =
    typeof turno.medico === 'string' ? turno.medico : turno.medico?.nombre || 'Médico';

  const especialidad = turno.servicio?.nombre || turno.servicio?.tipo || 'Consulta';

  const fecha = transformarFecha(turno.fechaHora);

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
            {transformarFecha(fecha)} · {especialidad}
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
