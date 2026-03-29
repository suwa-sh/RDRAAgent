import type { Meta, StoryObj } from '@storybook/nextjs-vite'

const meta: Meta = {
  title: 'Brand/Logo',
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '48px', padding: '24px' }}>
      <div>
        <h3 style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground-secondary)', marginBottom: '12px' }}>Full (横長)</h3>
        <img src="/assets/logo-full.svg" alt="RoomConnect Full Logo" style={{ height: 48 }} />
      </div>
      <div>
        <h3 style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground-secondary)', marginBottom: '12px' }}>Icon (正方形)</h3>
        <img src="/assets/logo-icon.svg" alt="RoomConnect Icon Logo" style={{ height: 48 }} />
      </div>
      <div>
        <h3 style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground-secondary)', marginBottom: '12px' }}>Stacked (縦)</h3>
        <img src="/assets/logo-stacked.svg" alt="RoomConnect Stacked Logo" style={{ height: 80 }} />
      </div>
    </div>
  ),
}

export const SizeComparison: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '32px', padding: '24px' }}>
      <img src="/assets/logo-full.svg" alt="Full" style={{ height: 32 }} />
      <img src="/assets/logo-icon.svg" alt="Icon" style={{ height: 32 }} />
      <img src="/assets/logo-stacked.svg" alt="Stacked" style={{ height: 48 }} />
    </div>
  ),
}
