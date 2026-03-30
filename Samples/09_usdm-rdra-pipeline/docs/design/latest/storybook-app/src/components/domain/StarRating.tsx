import React from 'react'

export interface StarRatingProps {
  value: number
  max?: number
  readonly?: boolean
  onChange?: (value: number) => void
  size?: number
}

export const StarRating: React.FC<StarRatingProps> = ({
  value,
  max = 5,
  readonly = false,
  onChange,
  size = 24,
}) => {
  const [hoverValue, setHoverValue] = React.useState(0)
  const displayValue = hoverValue || value

  return (
    <div className="inline-flex items-center gap-0.5">
      {Array.from({ length: max }, (_, i) => {
        const starIndex = i + 1
        const filled = starIndex <= displayValue
        return (
          <svg
            key={i}
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill={filled ? 'var(--rating)' : 'none'}
            stroke={filled ? 'var(--rating)' : 'var(--rating-empty-color)'}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ cursor: readonly ? 'default' : 'pointer', transition: 'fill var(--duration-fast)' }}
            onMouseEnter={() => !readonly && setHoverValue(starIndex)}
            onMouseLeave={() => !readonly && setHoverValue(0)}
            onClick={() => !readonly && onChange?.(starIndex)}
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        )
      })}
      <span className="ml-1 text-sm font-medium" style={{ color: 'var(--foreground)' }}>
        {value.toFixed(1)}
      </span>
    </div>
  )
}
