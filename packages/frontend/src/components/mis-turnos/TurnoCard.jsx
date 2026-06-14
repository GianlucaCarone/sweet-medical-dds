import { useState } from "react";
import styled from "styled-components";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import CancelarTurnoModal from "./CancelarTurnoModal";
import ReprogramarTurnoModal from "./ReprogramarTurnoModal";
import MedicoCard from "../../shared/MedicoCard/MedicoCard";
import CardDivider from "../cards/CardDivider";

// --- 1. Styled Components ---
const TurnoFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CoberturaChip = styled.div`
  display: inline-flex;
  background: #e7f7f4;
  color: #087f73;
  border-radius: 999px;
  padding: 7px 12px;
  font-size: 14px;
  font-weight: 800;
`;

const TurnoActions = styled.div`
  display: flex;
  gap: 12px;
`;

// Pro-tip: Así se estilizan componentes de librerías externas (MUI) con styled-components
const BtnSecundario = styled(Button)`
  && {
    border-radius: 999px;
    border: 2px solid #bac4c2;
    color: #526173;
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
export default function TurnoCard({ turno, onCancelar }) {
  const [modalCancelarAbierto, setModalCancelarAbierto] = useState(false);
  const [modalReprogramarAbierto, setModalReprogramarAbierto] = useState(false);

  const confirmarReprogramacion = (turnoId, nuevoTurno) => {
    console.log("Reprogramando turno:", turnoId, "Nuevo horario:", nuevoTurno);
    setModalReprogramarAbierto(false);
  };

  const confirmarCancelacion = (motivo) => {
    if (onCancelar) onCancelar(turno.id, motivo);
    setModalCancelarAbierto(false);
  };

  return (
    <>
      <CardDivider>
        <CardDivider.Top>
          <MedicoCard turno={turno} />
        </CardDivider.Top>

        <CardDivider.Bottom>
          <TurnoFooter>
            <CoberturaChip>{turno.cobertura}</CoberturaChip>

            <TurnoActions>
              <BtnSecundario variant="outlined" onClick={() => setModalReprogramarAbierto(true)}>
                Cambiar fecha
              </BtnSecundario>

              <BtnCancelar variant="contained" onClick={() => setModalCancelarAbierto(true)}>
                Cancelar
              </BtnCancelar>
            </TurnoActions>
          </TurnoFooter>
        </CardDivider.Bottom>
      </CardDivider>

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