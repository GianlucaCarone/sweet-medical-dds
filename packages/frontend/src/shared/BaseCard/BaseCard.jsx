import React from 'react';
import styled from 'styled-components';

const StyledArticle = styled.article`
  background: white;
  border: 2px solid #bac4c2;
  border-radius: 18px;
  padding: 18px 22px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.04);
  position: relative;
  overflow: hidden;
  gap: 16px;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 5px;
    height: 100%;
  }

  h3 {
    margin: 0;
    font-size: 18px;
    color: #0f172a;
  }
  p {
    margin: 4px 0 0;
    color: #64748b;
    font-size: 14px;
  }
`;

const InfoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1 1 auto;
  min-width: 0;
`;

const ActionsContainer = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  margin-left: auto;
`;

export default function BaseCard({ children, className = '' }) {
  return <StyledArticle className={className}>{children}</StyledArticle>;
}
