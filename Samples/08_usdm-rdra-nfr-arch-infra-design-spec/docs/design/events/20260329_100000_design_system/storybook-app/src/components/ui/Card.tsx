import React from 'react'

export interface CardProps {
  children: React.ReactNode
  hoverable?: boolean
  className?: string
}

export const Card: React.FC<CardProps> = ({ children, hoverable = false, className = '' }) => (
  <div
    className={[
      'bg-[var(--card-bg)] border border-[var(--card-border)]',
      'rounded-[var(--card-radius)] p-[var(--card-padding)]',
      'shadow-[var(--card-shadow)]',
      hoverable && 'transition-shadow duration-[var(--duration-normal)] hover:shadow-[var(--card-shadow-hover)] cursor-pointer',
      className,
    ].filter(Boolean).join(' ')}
  >
    {children}
  </div>
)
