import React from 'react'

const GlassCard = ({ children, className = '', variant = 'default', hover = false, ...props }) => {
  const baseStyles = 'backdrop-blur-xl bg-white/70 border border-white/40 shadow-lg'
  
  const variants = {
    default: 'rounded-2xl',
    sm: 'rounded-xl',
    lg: 'rounded-3xl',
    pill: 'rounded-full'
  }

  const hoverStyles = hover
    ? 'hover:shadow-xl hover:bg-white/80 hover:-translate-y-1 transition-all duration-300 cursor-pointer'
    : ''

  return (
    <div
      className={`${baseStyles} ${variants[variant]} ${hoverStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

export default GlassCard
