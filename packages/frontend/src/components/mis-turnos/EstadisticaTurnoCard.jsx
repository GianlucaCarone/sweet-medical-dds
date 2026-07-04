import React from "react";
import styled, { keyframes } from "styled-components";
import CardBase from "../../shared/CardBase/CardBase";

const coloresConfig = {
  azul: { bg: "var(--color-info-light)", text: "var(--color-info)" },
  verde: { bg: "var(--color-success-light)", text: "var(--color-success)" },
  rojo: { bg: "var(--color-error-light)", text: "var(--color-error)" },
  naranja: { bg: "var(--color-warning-light)", text: "var(--color-warning-dark)" },
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
    color: var(--color-text-muted);
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
  background-color: ${({ $tipo }) => coloresConfig[$tipo]?.bg || "var(--color-divider)"};
  color: ${({ $tipo }) => coloresConfig[$tipo]?.text || "var(--color-text-muted)"};
`;

const StatNumero = styled.span`
  font-size: 42px;
  font-weight: 800;
  line-height: 1;
  padding-left: 2px;
  z-index: 1;
  
  color: ${({ $tipo }) => coloresConfig[$tipo]?.text || "var(--color-text)"};
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