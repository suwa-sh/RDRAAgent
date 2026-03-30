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
  'filter', 'map-pin', 'room', 'check', 'x', 'chevron-right',
]

export const AllIcons: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 24 }}>
      {iconNames.map((name) => (
        <div key={name} style={{ textAlign: 'center', padding: 12 }}>
          <Icon name={name} size={32} />
          <div style={{ fontSize: 11, color: 'var(--muted-foreground)', marginTop: 8 }}>{name}</div>
        </div>
      ))}
    </div>
  ),
}

export const Single: Story = { args: { name: 'search', size: 24 } }
