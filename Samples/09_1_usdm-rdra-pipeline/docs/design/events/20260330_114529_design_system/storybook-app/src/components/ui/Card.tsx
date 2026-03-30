import React from 'react'

export interface CardProps {
  hoverable?: boolean
  children: React.ReactNode
  className?: string
}

export const Card: React.FC<CardProps> = ({
  hoverable = false,
  children,
  className = '',
}) => {
  return (
    <div
      className={`rounded-lg p-6 ${hoverable ? 'cursor-pointer' : ''} ${className}`}
      style={{
        backgroundColor: 'var(--card-bg)',
        border: '1px solid var(--card-border)',
        boxShadow: 'var(--card-shadow)',
        transition: hoverable ? 'box-shadow var(--duration-normal) ease, transform var(--duration-normal) ease' : undefined,
      }}
      onMouseEnter={(e) => {
        if (hoverable) {
          e.currentTarget.style.boxShadow = 'var(--shadow-md)'
          e.currentTarget.style.transform = 'translateY(-2px)'
        }
      }}
      onMouseLeave={(e) => {
        if (hoverable) {
          e.currentTarget.style.boxShadow = 'var(--card-shadow)'
          e.currentTarget.style.transform = 'translateY(0)'
        }
      }}
    >
      {children}
    </div>
  )
}
