import React from 'react';
import styled from 'styled-components';
import CardBase from '../../../shared/CardBase/CardBase'

const StyledCardDivider = styled(CardBase)`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 20px;
`;

const TopSection = styled.div`
  width: 100%;
`;

const BottomSection = styled.div`
  width: 100%;
  border-top: 1px solid var(--color-divider);
  padding-top: 16px;
`;

export default function CardDivider({ children, className = '' }) {
  return <StyledCardDivider className={className}>{children}</StyledCardDivider>;
}

CardDivider.Top = TopSection;
CardDivider.Bottom = BottomSection;
