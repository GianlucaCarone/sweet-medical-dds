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

const HistorialActions = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 100%;
  margin-top: 16px;
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

const BtnVolverAPedir = styled.button`
  height: 42px;
  padding: 0 20px;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  width: fit-content;

  border: none;
  border-radius: 999px;

  background: var(--color-text-muted);
  color: white;

  font-size: 14px;
  font-weight: 600;

  cursor: pointer;
  transition: all .2s ease;

  box-shadow: 0 4px 10px rgba(0,0,0,.12);

  &:hover {
    filter: brightness(.9);
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
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

      <HistorialActions>
        <BtnVolverAPedir
            onClick={() =>
                navigate("/busqueda-turnos", {
                    state: {
                        medico: turno.medico,
                        especialidad: turno.especialidad,
                        sede: turno.sede,
                    },
                })
            }
        >
            Volver a pedir
        </BtnVolverAPedir>
      </HistorialActions>
    </CardBase>
  );
}
