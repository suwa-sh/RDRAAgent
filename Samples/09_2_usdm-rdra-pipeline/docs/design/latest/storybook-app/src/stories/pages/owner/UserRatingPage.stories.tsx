import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import React from 'react'
import { OwnerPortalShell } from '@/components/layout/OwnerPortalShell'
import { StarRating } from '@/components/domain/StarRating'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Icon } from '@/components/ui/Icon'

const meta: Meta = {
  title: 'Pages/Owner/利用者評価登録画面',
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
}
export default meta

type Story = StoryObj

export const Default: Story = {
  render: () => (
    <OwnerPortalShell currentPage="reservations" breadcrumbs={['予約管理', '利用者評価']}>
      <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', color: 'var(--foreground)', marginBottom: 'var(--spacing-6)' }}>
        利用者評価を登録する
      </h1>
      <div style={{ maxWidth: '32rem' }}>
        <Card>
          <div className="flex items-center gap-3" style={{ marginBottom: 'var(--spacing-4)' }}>
            <Icon name="user" size={24} />
            <div>
              <div style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-semibold)', color: 'var(--foreground)' }}>
                田中太郎
              </div>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground-secondary)' }}>
                コワーキングスペース渋谷A / 2026-04-20 10:00-12:00
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div>
              <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', color: 'var(--foreground)', display: 'block', marginBottom: 'var(--spacing-2)' }}>
                利用者評価
              </label>
              <StarRating value={4} size={28} />
            </div>
            <Input label="コメント" placeholder="利用者のマナーや退室状態について入力してください" />
            <div className="flex justify-end gap-3">
              <Button variant="outline">スキップ</Button>
              <Button>送信する</Button>
            </div>
          </div>
        </Card>
      </div>
    </OwnerPortalShell>
  ),
}
