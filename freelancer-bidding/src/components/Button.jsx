import React from 'react';

const Button = ({
  children,
  type = 'button',
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  disabled = false,
  onClick,
  className = '',
  icon = null,
  iconPosition = 'left',
}) => {
  // Base styles
  const baseStyles = 'font-medium rounded-md focus:outline-none transition-colors duration-200';
  
  // Size styles
  const sizeStyles = {
    small: 'py-1 px-3 text-sm',
    medium: 'py-2 px-4 text-base',
    large: 'py-3 px-6 text-lg',
  };
  
  // Variant styles
  const variantStyles = {
    primary: 'bg-blueeclipse-100 hover:bg-blueeclipse-300 text-blueeclipse-700 focus:ring-2 focus:ring-blueeclipse-100 focus:ring-offset-2',
    secondary: 'bg-blueeclipse-50 hover:bg-blueeclipse-100 text-blueeclipse-700 focus:ring-2 focus:ring-blueeclipse-100 focus:ring-offset-2',
    success: 'bg-blueeclipse-100 hover:bg-blueeclipse-300 text-blueeclipse-700 focus:ring-2 focus:ring-blueeclipse-100 focus:ring-offset-2',
    danger: 'bg-blueeclipse-700 hover:bg-blueeclipse-300 text-white focus:ring-2 focus:ring-blueeclipse-100 focus:ring-offset-2',
    outline: 'bg-transparent border border-blueeclipse-700 text-blueeclipse-700 hover:bg-blueeclipse-50 focus:ring-2 focus:ring-blueeclipse-100 focus:ring-offset-2',
    text: 'bg-transparent text-blueeclipse-700 hover:text-blueeclipse-300 hover:underline',
  };
  
  // Width styles
  const widthStyles = fullWidth ? 'w-full' : '';
  
  // Disabled styles
  const disabledStyles = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';
  
  // Combine all styles
  const buttonStyles = `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${widthStyles} ${disabledStyles} ${className}`;
  
  return (
    <button
      type={type}
      className={buttonStyles}
      onClick={onClick}
      disabled={disabled}
    >
      {icon && iconPosition === 'left' && (
        <span className="mr-2 inline-flex items-center">{icon}</span>
      )}
      {children}
      {icon && iconPosition === 'right' && (
        <span className="ml-2 inline-flex items-center">{icon}</span>
      )}
    </button>
  );
};
export default Button;
