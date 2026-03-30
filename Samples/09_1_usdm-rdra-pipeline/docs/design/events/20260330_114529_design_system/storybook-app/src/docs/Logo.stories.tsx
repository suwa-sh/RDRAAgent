import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import React from 'react'

const LogoDisplay: React.FC = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', padding: '2rem' }}>
    <div>
      <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--foreground-secondary)', marginBottom: '0.75rem' }}>
        Full (横長)
      </h3>
      <img src="/assets/logo-full.svg" alt="RoomConnect Full Logo" style={{ height: 48 }} />
    </div>
    <div>
      <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--foreground-secondary)', marginBottom: '0.75rem' }}>
        Icon (正方形)
      </h3>
      <img src="/assets/logo-icon.svg" alt="RoomConnect Icon Logo" style={{ height: 48 }} />
    </div>
    <div>
      <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--foreground-secondary)', marginBottom: '0.75rem' }}>
        Stacked (縦)
      </h3>
      <img src="/assets/logo-stacked.svg" alt="RoomConnect Stacked Logo" style={{ height: 80 }} />
    </div>
  </div>
)

const meta: Meta = {
  title: 'Brand/Logo',
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj

export const AllVariants: Story = {
  render: () => <LogoDisplay />,
}
