import React from 'react'

export const ICON_NAMES = [
  'calendar', 'chart', 'clock', 'credit-card', 'filter',
  'key', 'map-pin', 'message', 'room', 'search',
  'settings', 'shield-check', 'star', 'user', 'users', 'virtual-room',
] as const

export type IconName = typeof ICON_NAMES[number]

export interface IconProps {
  name: IconName
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
