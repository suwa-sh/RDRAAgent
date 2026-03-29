import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Icon, ICON_NAMES } from './Icon'

const meta: Meta<typeof Icon> = {
  title: 'Brand/Icons',
  component: Icon,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Icon>

export const Default: Story = {
  args: {
    name: 'search',
    size: 24,
  },
}

export const Large: Story = {
  args: {
    name: 'room',
    size: 48,
  },
}

export const AllIcons: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', padding: '16px' }}>
      {ICON_NAMES.map((name) => (
        <div key={name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <Icon name={name} size={32} />
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--foreground-secondary)' }}>{name}</span>
        </div>
      ))}
    </div>
  ),
}
