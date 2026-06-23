import React from "react";
import styled, { keyframes } from "styled-components";
import CardBase from "../../shared/CardBase/CardBase";

// 1. Diccionario de colores (Configuration Object)
// Esto es clave para escalar: si mañana te piden un nuevo tipo, solo lo agregás acá.
const coloresConfig = {
  azul: { bg: "#dbeafe", text: "#2563eb" },
  verde: { bg: "#dcfce7", text: "#059669" },
  rojo: { bg: "#fee2e2", text: "#dc2626" },
  naranja: { bg: "#ffedd5", text: "#ea580c" },
};

// 2. Animación definida con keyframes de styled-components
const slideFadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// 3. Definición de Styled Components
const StatCardWrapper = styled(CardBase)`
  min-height: 120px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 20px; 
  animation: ${slideFadeIn} 0.25s ease-out;
`;

const StatTop = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  p {
    margin: 0;
    color: #526173;
    font-size: 17px;
    padding-bottom: 15px;
    font-weight: 600;
  }
`;

const StatIcon = styled.div`
  width: 34px;
  height: 34px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  /* Buscamos el color en nuestro diccionario usando la prop $tipo */
  /* Si por algún motivo nos pasan un tipo que no existe, le damos un fallback gris */
  background-color: ${({ $tipo }) => coloresConfig[$tipo]?.bg || "#e2e8f0"};
  color: ${({ $tipo }) => coloresConfig[$tipo]?.text || "#64748b"};
`;

const StatNumero = styled.span`
  font-size: 42px;
  font-weight: 800;
  line-height: 1;
  padding-left: 2px;
  z-index: 1;
  
  color: ${({ $tipo }) => coloresConfig[$tipo]?.text || "#0f172a"};
`;

// 4. Componente Principal React
export default function EstadisticaTurnoCard({ numero, texto, tipo = "azul", icono }) {
  return (
    <StatCardWrapper>
      <StatTop>
        {/* Usamos $tipo (Transient Prop) para que no se filtre al HTML */}
        <StatIcon $tipo={tipo}>{icono}</StatIcon>
        <p>{texto}</p>
      </StatTop>

      <StatNumero $tipo={tipo}>{numero}</StatNumero>
    </StatCardWrapper>
  );
}