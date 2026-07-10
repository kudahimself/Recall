import React from 'react';
import './StyledButton.css';

interface Props {
  onClick?: () => void;
  type?: 'button' | 'submit';
  variant?: 'primary' | 'secondary' | 'ghost' | 'warning' | 'danger';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  shortcut?: string;
  children: React.ReactNode;
  className?: string;
}

export const StyledButton: React.FC<Props> = ({
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  leftIcon,
  rightIcon,
  loading = false,
  disabled = false,
  shortcut,
  children,
  className = '',
}) => {
  const classes = [
    'styled-button',
    `styled-button-${variant}`,
    `styled-button-${size}`,
    loading && 'styled-button-loading',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      className={classes}
      onClick={onClick}
      type={type}
      disabled={disabled || loading}
    >
      {loading && (
        <span className="button-spinner">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle
              cx="8"
              cy="8"
              r="6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="28"
              strokeDashoffset="14"
            >
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 8 8"
                to="360 8 8"
                dur="0.8s"
                repeatCount="indefinite"
              />
            </circle>
          </svg>
        </span>
      )}
      {!loading && leftIcon && <span className="button-icon">{leftIcon}</span>}
      <span className="button-content">{children}</span>
      {!loading && rightIcon && <span className="button-icon">{rightIcon}</span>}
      {shortcut && !loading && (
        <kbd className="button-shortcut">{shortcut}</kbd>
      )}
    </button>
  );
};
