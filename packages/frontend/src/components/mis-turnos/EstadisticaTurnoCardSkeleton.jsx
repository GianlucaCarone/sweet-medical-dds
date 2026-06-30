import Skeleton from "@mui/material/Skeleton";
import styled from 'styled-components';

// --- Styled Components ---
const StatCardArticle = styled.article`
  background: white;
  border: 2px solid #bac4c2; /* Mantenemos la consistencia visual del sistema */
  border-radius: 20px;
  padding: 20px;

  /* Flexbox para asegurarnos de que el contenido fluya hacia abajo */
  display: flex;
  flex-direction: column;
  justify-content: center;

  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.03);
`;

// --- Componente ---
export default function EstadisticaTurnoCardSkeleton() {
    return (
      <StatCardArticle>
        {/* Ícono */}
        <Skeleton variant="rounded" width={38} height={38} />

        {/* Número grande */}
        <Skeleton width="45%" height={50} sx={{ marginTop: '12px' }} />

        {/* Texto descriptivo */}
        <Skeleton width="70%" height={25} />
      </StatCardArticle>
    );
}