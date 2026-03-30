import React from 'react'

export interface CardProps {
  children: React.ReactNode
  hoverable?: boolean
  className?: string
  style?: React.CSSProperties
}

export const Card: React.FC<CardProps> = ({
  children,
  hoverable = false,
  className = '',
  style,
}) => {
  return (
    <div
      className={`rounded-lg transition-shadow ${hoverable ? 'cursor-pointer' : ''} ${className}`}
      style={{
        backgroundColor: 'var(--card-bg)',
        border: '1px solid var(--card-border)',
        boxShadow: 'var(--card-shadow)',
        padding: 'var(--card-padding)',
        ...style,
      }}
      onMouseEnter={(e) => {
        if (hoverable) {
          (e.currentTarget as HTMLDivElement).style.boxShadow = 'var(--shadow-md)'
        }
      }}
      onMouseLeave={(e) => {
        if (hoverable) {
          (e.currentTarget as HTMLDivElement).style.boxShadow = 'var(--card-shadow)'
        }
      }}
    >
      {children}
    </div>
  )
}
