import React from 'react'

export interface StarRatingProps {
  value: number
  count?: number
  readOnly?: boolean
  size?: 'sm' | 'md' | 'lg'
  onChange?: (value: number) => void
}

const sizeMap = { sm: 16, md: 20, lg: 28 }
const textSizeMap = { sm: 'var(--text-xs)', md: 'var(--text-sm)', lg: 'var(--text-base)' }

export const StarRating: React.FC<StarRatingProps> = ({
  value,
  count,
  readOnly = true,
  size = 'md',
  onChange,
}) => {
  const starSize = sizeMap[size]

  return (
    <div className="inline-flex items-center" style={{ gap: 'var(--rating-star-gap)' }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          width={starSize}
          height={starSize}
          viewBox="0 0 24 24"
          fill={star <= Math.round(value) ? 'var(--rating-star-color)' : 'var(--rating-empty-color)'}
          className={readOnly ? '' : 'cursor-pointer hover:scale-110 transition-transform'}
          onClick={() => !readOnly && onChange?.(star)}
          role={readOnly ? 'img' : 'button'}
          aria-label={readOnly ? undefined : `${star}星`}
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
      <span className="text-[color:var(--foreground)]" style={{ fontSize: textSizeMap[size], fontWeight: 'var(--font-semibold)' }}>
        {value.toFixed(1)}
      </span>
      {count !== undefined && (
        <span className="text-[color:var(--foreground-muted)]" style={{ fontSize: textSizeMap[size] }}>
          ({count}件)
        </span>
      )}
    </div>
  )
}
