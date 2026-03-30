import React from 'react'

export interface IconProps {
  name: string
  size?: number
  className?: string
}

export const Icon: React.FC<IconProps> = ({ name, size = 24, className = '' }) => (
  <img
    src={`/assets/icons/${name}.svg`}
    alt={name}
    width={size}
    height={size}
    className={className}
    style={{ display: 'inline-block' }}
  />
)
