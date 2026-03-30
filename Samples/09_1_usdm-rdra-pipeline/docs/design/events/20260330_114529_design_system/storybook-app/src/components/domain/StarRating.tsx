import React from 'react'

export interface StarRatingProps {
  value: number
  max?: number
  readonly?: boolean
  size?: number
  onChange?: (value: number) => void
}

const Star: React.FC<{ filled: boolean; size: number; onClick?: () => void; interactive: boolean }> = ({
  filled,
  size,
  onClick,
  interactive,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={filled ? 'var(--rating)' : 'none'}
    stroke={filled ? 'var(--rating)' : 'var(--rating-empty)'}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    onClick={onClick}
    style={{ cursor: interactive ? 'pointer' : 'default', transition: 'fill var(--duration-fast) ease' }}
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
)

export const StarRating: React.FC<StarRatingProps> = ({
  value,
  max = 5,
  readonly = false,
  size = 20,
  onChange,
}) => {
  return (
    <div style={{ display: 'inline-flex', gap: '2px', alignItems: 'center' }}>
      {Array.from({ length: max }, (_, i) => (
        <Star
          key={i}
          filled={i < value}
          size={size}
          interactive={!readonly}
          onClick={() => !readonly && onChange?.(i + 1)}
        />
      ))}
      <span
        style={{
          marginLeft: '0.5rem',
          fontSize: '0.875rem',
          fontWeight: 500,
          color: 'var(--foreground)',
        }}
      >
        {value.toFixed(1)}
      </span>
    </div>
  )
}
