import { useState } from 'react';
import styled from 'styled-components';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CancelarTurnoModal from '../../mis-turnos/CancelarTurnoModal.jsx';
import ReprogramarTurnoModal from '../../mis-turnos/ReprogramarTurnoModal.jsx';
import TurnoCardHeader from './TurnoCardHeader.jsx';
import CardDivider from '../CardDivider.jsx';
import CardBase from '../../../shared/CardBase/CardBase.jsx';

// --- 1. Styled Components ---
const TurnoFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CoberturaLabel = styled.div`
  display: inline-flex;
  color: #2d8077;
  padding: 4px;
  font-size: 14px;
  font-weight: 800;
  justify-content: space-between;
`;

const TurnoActions = styled.div`
  display: flex;
  gap: 12px;
`;

// Pro-tip: Así se estilizan componentes de librerías externas (MUI) con styled-components
const BtnSecundario = styled(Button)`
  && {
    border-radius: 999px;
   border: 2px solid #137333;
    color: #137333;
    transition: all 0.2s ease-in-out;
    text-transform: none;
    font-weight: 600;
    padding: 6px 18px;

    &:hover {
      background: #f8fafc;
      transform: translateY(-1px);
    }
  }
`;

const BtnCancelar = styled(Button)`
  && {
    border-radius: 999px;
    background-color: #f36969;
    color: white;
    text-transform: none;
    font-weight: 600;
    padding: 6px 18px;

    &:hover {
      background-color: #dc2626;
      transform: translateY(-1px);
    }
  }
`;

// --- 2. Componente Principal ---
export default function CardTurno({ turno, onCancelar }) {
  const [modalCancelarAbierto, setModalCancelarAbierto] = useState(false);
  const [modalReprogramarAbierto, setModalReprogramarAbierto] = useState(false);

  const confirmarReprogramacion = (turnoId, nuevoTurno) => {
    console.log('Reprogramando turno:', turnoId, 'Nuevo horario:', nuevoTurno);
    setModalReprogramarAbierto(false);
  };

  const confirmarCancelacion = (motivo) => {
    if (onCancelar) onCancelar(turno.id, motivo);
    setModalCancelarAbierto(false);
  };

  return (
    <>
      <CardBase>
        <TurnoCardHeader turno={turno} />

        <TurnoFooter>
          <CoberturaLabel>
            {'Cobertura: '}
            {turno.estadoCobertura}
          </CoberturaLabel>

          <TurnoActions>
            <BtnSecundario variant="outlined" onClick={() => setModalReprogramarAbierto(true)}>
              Cambiar fecha
            </BtnSecundario>

            <BtnCancelar variant="contained" onClick={() => setModalCancelarAbierto(true)}>
              Cancelar
            </BtnCancelar>
          </TurnoActions>
        </TurnoFooter>
      </CardBase>

      <ReprogramarTurnoModal
        abierto={modalReprogramarAbierto}
        turno={turno}
        onCerrar={() => setModalReprogramarAbierto(false)}
        onConfirmar={confirmarReprogramacion}
      />

      <CancelarTurnoModal
        abierto={modalCancelarAbierto}
        onCerrar={() => setModalCancelarAbierto(false)}
        onConfirmar={confirmarCancelacion}
      />
    </>
  );
}