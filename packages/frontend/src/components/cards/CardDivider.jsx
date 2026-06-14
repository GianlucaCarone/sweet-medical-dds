import React from 'react';
import styled from 'styled-components';
import BaseCard from '../../shared/BaseCard/BaseCard';

const StyledCardDivider = styled(BaseCard)`
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
  border-top: 1px solid #e2e8f0;
  padding-top: 16px;
`;

export default function CardDivider({ children, className = '' }) {
  return <StyledCardDivider className={className}>{children}</StyledCardDivider>;
}

CardDivider.Top = TopSection;
CardDivider.Bottom = BottomSection;
