import React from 'react';
import { useNavigate } from 'react-router-dom';
import BaseCard from '../../shared/BaseCard/BaseCard';
import styled from 'styled-components';

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

  &:hover {
    background: #bcc5cfc7;
    transform: translateY(-1px);

  }
`;

export default function TurnoHistorialCard({ turno }) {
  const navigate = useNavigate();

  return (
    <BaseCard>
      <HistorialInfo>
        <DoctorAvatar>
          {turno.foto ? (
            <img src={turno.foto} alt={turno.doctor} />
          ) : (
            <span>{turno.doctor.slice(0, 2).toUpperCase()}</span>
          )}
        </DoctorAvatar>

        <div>
          <h3>{turno.doctor}</h3>
          <p>
            {turno.fecha} · {turno.especialidad}
          </p>
        </div>
      </HistorialInfo>

      <BtnSecundario
        onClick={() =>
          navigate('/busqueda-turnos', {
            state: {
              doctor: turno.doctor,
              especialidad: turno.especialidad,
              sede: turno.sede,
            },
          })
        }
      >
        Volver a pedir
      </BtnSecundario>
    </BaseCard>
  );
}
