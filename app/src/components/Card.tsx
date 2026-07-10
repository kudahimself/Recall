import React from 'react';
import './Card.css';

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outline';
  accentBar?: boolean;
  className?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  accentBar = false,
  className = '',
  onClick,
}) => {
  const classes = [
    'card',
    `card-${variant}`,
    accentBar && 'card-accent-bar',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes} onClick={onClick}>
      {children}
    </div>
  );
};
