import Skeleton from "@mui/material/Skeleton";
import styled from 'styled-components';

// --- Styled Components ---
const SkeletonContainer = styled.div`
  background: white;
  border: 2px solid #bac4c2;
  border-radius: 22px;
  padding: 18px 24px;
  box-shadow: 0 6px 18px rgba(15, 23, 42, 0.05);
  position: relative;
  overflow: hidden;

  /* Reemplaza a .turno-card::before */
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 6px;
    height: 100%;
    background: #087f73;
    opacity: 0.9;
  }
`;

const SkeletonMain = styled.div`
  display: flex;
  gap: 20px;
`;

// Reemplaza al <div style={{ flex: 1 }}>
const SkeletonInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px; /* Le agregamos un gap para que las líneas de carga no queden pegadas */
`;

// --- Componente ---
export default function TurnoCardSkeleton() {
  return (
    <SkeletonContainer>
      <SkeletonMain>
        <Skeleton variant="rounded" width={72} height={72} />

        <SkeletonInfo>
          <Skeleton width="40%" height={35} />
          <Skeleton width="25%" height={25} />
          <Skeleton width="80%" height={30} />
          <Skeleton width="30%" height={35} />
        </SkeletonInfo>
      </SkeletonMain>
    </SkeletonContainer>
  );
}