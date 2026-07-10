import React from 'react';
import './StyledBadge.css';

interface Props {
  variant: 'difficulty' | 'topic' | 'language';
  children: React.ReactNode;
}

export const StyledBadge: React.FC<Props> = ({ variant, children }) => {
  return (
    <div className={`styled-badge styled-badge-${variant}`}>
      {children}
    </div>
  );
};
