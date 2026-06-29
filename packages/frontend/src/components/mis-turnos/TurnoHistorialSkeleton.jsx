import Skeleton from "@mui/material/Skeleton";
import styled from 'styled-components';

// --- Styled Components ---
const HistorialArticle = styled.article`
  display: flex;
  justify-content: space-between;
  align-items: center;

  background: var(--color-surface);
  border: 2px solid var(--color-divider);
  border-radius: 18px;
  padding: 16px 20px;
  margin-bottom: 12px;
`;

const HistorialInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const TextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

// --- Componente ---
export default function TurnoHistorialSkeleton() {
  return (
    <HistorialArticle>
      <HistorialInfo>
        <Skeleton variant="rounded" width={52} height={52} />

        <TextWrapper>
          <Skeleton width={180} height={28} />
          <Skeleton width={220} height={20} />
        </TextWrapper>
      </HistorialInfo>

      {/* Skeleton simulando el botón/badge derecho */}
      <Skeleton variant="rounded" width={130} height={42} />
    </HistorialArticle>
  );
}