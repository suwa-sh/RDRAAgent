import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import React from 'react'
import { UserPortalShell } from '@/components/layout/UserPortalShell'
import { BookingCalendar } from '@/components/domain/BookingCalendar'
import { PriceDisplay } from '@/components/domain/PriceDisplay'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Icon } from '@/components/ui/Icon'

const meta: Meta = {
  title: 'Pages/User/会議室予約画面',
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
}
export default meta

type Story = StoryObj

export const Default: Story = {
  render: () => (
    <UserPortalShell currentPage="search">
      <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', color: 'var(--foreground)', marginBottom: 'var(--spacing-4)' }}>
        会議室を予約する
      </h1>
      <div className="grid gap-6" style={{ gridTemplateColumns: '1fr 20rem' }}>
        <div>
          <Card>
            <div className="flex items-center gap-3" style={{ marginBottom: 'var(--spacing-4)' }}>
              <div
                style={{
                  width: '5rem', height: '5rem',
                  backgroundColor: 'var(--muted)',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <Icon name="room" size={32} />
              </div>
              <div>
                <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-semibold)', color: 'var(--foreground)' }}>
                  コワーキングスペース渋谷A
                </h2>
                <div className="inline-flex items-center gap-1" style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground-secondary)' }}>
                  <Icon name="map-pin" size={14} /> 東京都渋谷区道玄坂1-2-3
                </div>
              </div>
            </div>
            <BookingCalendar />
          </Card>
        </div>
        <div>
          <Card>
            <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-semibold)', color: 'var(--foreground)', marginBottom: 'var(--spacing-3)' }}>
              予約内容
            </h3>
            <div className="flex flex-col gap-2" style={{ marginBottom: 'var(--spacing-4)' }}>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground-secondary)' }}>
                利用料金
              </div>
              <PriceDisplay amount={3000} size="lg" />
            </div>
            <Button className="w-full">予約を確定する</Button>
          </Card>
        </div>
      </div>
    </UserPortalShell>
  ),
}
