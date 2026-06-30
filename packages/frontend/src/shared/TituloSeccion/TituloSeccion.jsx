import { Typography } from "@mui/material";
import styled from "styled-components";

// =========================================================
// 1. STYLED COMPONENTS
// =========================================================

// Usamos styled() para heredar y extender un componente de una librería externa (MUI)
const StyledTypography = styled(Typography)`
  // El && aumenta la especificidad para asegurar que nuestros estilos 
  // pisen a los estilos por defecto que trae Material UI
  && {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: 10px;
  }

  /* El pseudo-elemento ::before se anida directamente con el & */
  &::before {
    content: "";
    width: 6px;
    height: 26px;
    border-radius: 999px;
    background: var(--color-primary);
  }
`;

// =========================================================
// 2. COMPONENTE PRINCIPAL
// =========================================================

export default function TituloSeccion({ children }) {
  return (
    // Conservamos las props originales de MUI (variant y sx)
    <StyledTypography variant="h1" sx={{ mb: 2 }}>
      {children}
    </StyledTypography>
  );
}