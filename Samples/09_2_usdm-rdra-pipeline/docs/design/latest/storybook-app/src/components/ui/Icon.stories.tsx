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
  'search', 'calendar', 'clock', 'key', 'star', 'star-filled',
  'user', 'users', 'shield-check', 'message', 'credit-card',
  'settings', 'chart', 'filter', 'map-pin', 'room',
  'arrow-up', 'arrow-down', 'check', 'x',
]

export const AllIcons: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1.5rem' }}>
      {iconNames.map(name => (
        <div key={name} style={{ textAlign: 'center', padding: '1rem' }}>
          <Icon name={name} size={32} />
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--foreground-secondary)', marginTop: '0.5rem' }}>
            {name}
          </div>
        </div>
      ))}
    </div>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <Icon name="room" size={16} />
        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--foreground-secondary)', marginTop: '0.25rem' }}>16px</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Icon name="room" size={24} />
        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--foreground-secondary)', marginTop: '0.25rem' }}>24px</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Icon name="room" size={32} />
        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--foreground-secondary)', marginTop: '0.25rem' }}>32px</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Icon name="room" size={48} />
        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--foreground-secondary)', marginTop: '0.25rem' }}>48px</div>
      </div>
    </div>
  ),
}
