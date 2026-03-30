import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import React from 'react'
import { UserPortalShell } from '@/components/layout/UserPortalShell'
import { ReservationCard } from '@/components/domain/ReservationCard'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

const meta: Meta = {
  title: 'Pages/User/予約取消画面',
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
}
export default meta

type Story = StoryObj

export const Default: Story = {
  render: () => (
    <UserPortalShell currentPage="reservations">
      <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', color: 'var(--foreground)', marginBottom: 'var(--spacing-4)' }}>
        予約を取消する
      </h1>
      <div className="flex flex-col gap-6" style={{ maxWidth: '32rem' }}>
        <ReservationCard
          reservationId="RSV-2026-0002"
          roomName="新宿ミーティングルームB"
          dateTime="2026-04-20 14:00-16:00"
          status="予約確定"
          userName="田中太郎"
        />
        <Card>
          <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-semibold)', color: 'var(--destructive)', marginBottom: 'var(--spacing-2)' }}>
            取消に関する注意事項
          </h3>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground-secondary)', marginBottom: 'var(--spacing-4)' }}>
            予約を取り消すと、再予約は空き状況によります。取消後のキャンセル料は発生しません。
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="outline">戻る</Button>
            <Button variant="destructive">予約を取消する</Button>
          </div>
        </Card>
      </div>
    </UserPortalShell>
  ),
}
