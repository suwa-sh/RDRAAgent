import React from 'react'

export interface StarRatingProps {
  value: number
  max?: number
  readonly?: boolean
  size?: number
  onRate?: (rating: number) => void
}

const StarIcon: React.FC<{ filled: boolean; size: number }> = ({ filled, size }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={filled ? 'var(--rating)' : 'none'}
    stroke={filled ? 'var(--rating)' : 'var(--rating-empty)'}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
)

export const StarRating: React.FC<StarRatingProps> = ({
  value,
  max = 5,
  readonly = false,
  size = 20,
  onRate,
}) => {
  const [hover, setHover] = React.useState<number | null>(null)

  return (
    <div
      className="inline-flex items-center gap-0.5"
      style={{ cursor: readonly ? 'default' : 'pointer' }}
    >
      {Array.from({ length: max }, (_, i) => {
        const starIndex = i + 1
        const isFilled = starIndex <= (hover ?? value)
        return (
          <span
            key={i}
            onClick={() => !readonly && onRate?.(starIndex)}
            onMouseEnter={() => !readonly && setHover(starIndex)}
            onMouseLeave={() => !readonly && setHover(null)}
          >
            <StarIcon filled={isFilled} size={size} />
          </span>
        )
      })}
      <span
        style={{
          marginLeft: '0.5rem',
          fontSize: 'var(--text-sm)',
          color: 'var(--foreground-secondary)',
        }}
      >
        {value.toFixed(1)}
      </span>
    </div>
  )
}
