import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Icon } from './Icon'

const meta: Meta<typeof Icon> = {
  title: 'Brand/Icons',
  component: Icon,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Icon>

const iconNames = [
  'search', 'calendar', 'clock', 'key', 'star', 'user', 'users',
  'shield-check', 'message', 'credit-card', 'settings', 'chart',
  'filter', 'map-pin', 'room', 'chevron-right', 'x', 'check',
  'arrow-up', 'arrow-down',
]

export const AllIcons: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1.5rem' }}>
      {iconNames.map(name => (
        <div key={name} style={{ textAlign: 'center', padding: '1rem' }}>
          <Icon name={name} size={32} />
          <div style={{ fontSize: '0.75rem', color: 'var(--foreground-secondary)', marginTop: '0.5rem' }}>
            {name}
          </div>
        </div>
      ))}
    </div>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
      <Icon name="search" size={16} />
      <Icon name="search" size={24} />
      <Icon name="search" size={32} />
      <Icon name="search" size={48} />
    </div>
  ),
}
