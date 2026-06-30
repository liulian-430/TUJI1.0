import React, { useState } from 'react'

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  onClick,
  disabled = false,
  loading = false,
  icon: Icon,
  iconPosition = 'left',
  fullWidth = false,
  rounded = 'full',
  ...props
}) => {
  const [isPressed, setIsPressed] = useState(false)

  const baseStyles = 'relative inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 overflow-hidden'

  const variants = {
    primary: 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white hover:shadow-lg hover:shadow-purple-500/30 focus:ring-purple-500/50 active:scale-95',
    secondary: 'bg-white/80 text-gray-800 border border-gray-200 hover:bg-white hover:shadow-md focus:ring-gray-400/50 active:scale-95 backdrop-blur-sm',
    outline: 'bg-transparent border-2 border-indigo-500 text-indigo-600 hover:bg-indigo-50 focus:ring-indigo-500/30 active:scale-95',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100/80 focus:ring-gray-400/30 active:scale-95',
    danger: 'bg-gradient-to-r from-red-500 to-rose-500 text-white hover:shadow-lg hover:shadow-red-500/30 focus:ring-red-500/50 active:scale-95',
    success: 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:shadow-lg hover:shadow-emerald-500/30 focus:ring-emerald-500/50 active:scale-95'
  }

  const sizes = {
    xs: 'text-xs px-3 py-1.5 gap-1',
    sm: 'text-sm px-4 py-2 gap-1.5',
    md: 'text-base px-6 py-3 gap-2',
    lg: 'text-lg px-8 py-4 gap-2.5',
    xl: 'text-xl px-10 py-5 gap-3'
  }

  const roundedStyles = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    full: 'rounded-full'
  }

  const handleClick = (e) => {
    if (disabled || loading) return
    setIsPressed(true)
    setTimeout(() => setIsPressed(false), 200)
    onClick?.(e)
  }

  return (
    <button
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${roundedStyles[rounded]}
        ${fullWidth ? 'w-full' : ''}
        ${disabled || loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      onClick={handleClick}
      disabled={disabled || loading}
      {...props}
    >
      {isPressed && (
        <span className="absolute inset-0 bg-white/30 animate-ripple rounded-full" />
      )}
      
      {loading && (
        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      
      {!loading && Icon && iconPosition === 'left' && <Icon size={size === 'sm' ? 16 : size === 'lg' ? 24 : 20} />}
      
      {children}
      
      {!loading && Icon && iconPosition === 'right' && <Icon size={size === 'sm' ? 16 : size === 'lg' ? 24 : 20} />}
    </button>
  )
}

export default Button
