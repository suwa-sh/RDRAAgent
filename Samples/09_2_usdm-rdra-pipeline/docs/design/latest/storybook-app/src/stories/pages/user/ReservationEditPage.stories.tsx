import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import React from 'react'
import { UserPortalShell } from '@/components/layout/UserPortalShell'
import { ReservationCard } from '@/components/domain/ReservationCard'
import { BookingCalendar } from '@/components/domain/BookingCalendar'
import { Button } from '@/components/ui/Button'

const meta: Meta = {
  title: 'Pages/User/予約変更画面',
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
}
export default meta

type Story = StoryObj

export const Default: Story = {
  render: () => (
    <UserPortalShell currentPage="reservations">
      <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', color: 'var(--foreground)', marginBottom: 'var(--spacing-4)' }}>
        予約を変更する
      </h1>
      <div className="flex flex-col gap-6" style={{ maxWidth: '40rem' }}>
        <ReservationCard
          reservationId="RSV-2026-0001"
          roomName="コワーキングスペース渋谷A"
          dateTime="2026-04-15 10:00-12:00"
          status="予約確定"
          userName="田中太郎"
        />
        <div>
          <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-semibold)', color: 'var(--foreground)', marginBottom: 'var(--spacing-3)' }}>
            変更後の日時を選択
          </h2>
          <BookingCalendar />
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="outline">キャンセル</Button>
          <Button>変更を確定する</Button>
        </div>
      </div>
    </UserPortalShell>
  ),
}
