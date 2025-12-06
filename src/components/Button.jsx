import React from 'react';
import './Button.css';

/**
 * Componente de botón reutilizable
 * @param {Object} props
 * @param {'primary' | 'secondary' | 'danger' | 'success'} props.variant - Variante del botón
 * @param {'small' | 'medium' | 'large'} props.size - Tamaño del botón
 * @param {boolean} props.disabled - Si el botón está deshabilitado
 * @param {boolean} props.loading - Si el botón está en estado de carga
 * @param {boolean} props.fullWidth - Si el botón ocupa todo el ancho
 * @param {Function} props.onClick - Función a ejecutar al hacer clic
 * @param {React.ReactNode} props.children - Contenido del botón
 * @param {string} props.type - Tipo de botón (button, submit, reset)
 * @param {React.ReactNode} props.icon - Icono opcional
 * @param {'left' | 'right'} props.iconPosition - Posición del icono
 */
const Button = ({
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  fullWidth = false,
  onClick,
  children,
  type = 'button',
  icon,
  iconPosition = 'left',
  className = '',
  ...rest
}) => {
  const buttonClasses = [
    'btn',
    `btn-${variant}`,
    `btn-${size}`,
    fullWidth && 'btn-full-width',
    loading && 'btn-loading',
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled || loading}
      {...rest}
    >
      {loading && (
        <span className="btn-spinner"></span>
      )}
      {!loading && icon && iconPosition === 'left' && (
        <span className="btn-icon btn-icon-left">{icon}</span>
      )}
      <span className="btn-text">{children}</span>
      {!loading && icon && iconPosition === 'right' && (
        <span className="btn-icon btn-icon-right">{icon}</span>
      )}
    </button>
  );
};

export default Button;
