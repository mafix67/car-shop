import type { ButtonHTMLAttributes } from 'react';
import './Button.css';

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}

export const Button = ({
  children,
  variant = 'primary',
  ...props
}: ButtonProps) => {
  return (
    <button
      className={`button button--${variant}`}
      {...props}
    >
      {children}
    </button>
  );
};