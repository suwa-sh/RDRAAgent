import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import React from 'react'
import { OwnerPortalShell } from '@/components/layout/OwnerPortalShell'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

const meta: Meta = {
  title: 'Pages/Owner/会議室登録画面',
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
}
export default meta

type Story = StoryObj

export const Default: Story = {
  render: () => (
    <OwnerPortalShell currentPage="rooms" breadcrumbs={['会議室管理', '新規登録']}>
      <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', color: 'var(--foreground)', marginBottom: 'var(--spacing-6)' }}>
        会議室を登録する
      </h1>
      <div style={{ maxWidth: '40rem' }}>
        <Card>
          <div className="flex flex-col gap-4">
            <Input label="会議室名" placeholder="例: 渋谷カンファレンスルームA" required />
            <Input label="所在地" placeholder="東京都渋谷区..." required />
            <div className="grid gap-4" style={{ gridTemplateColumns: '1fr 1fr' }}>
              <Input label="収容人数" placeholder="20" type="number" required />
              <Input label="利用料金 (円/時間)" placeholder="3000" type="number" required />
            </div>
            <Input label="設備" placeholder="例: プロジェクター、ホワイトボード、Wi-Fi" />
            <Input label="説明" placeholder="会議室の特徴や注意事項を入力してください" />
            <div className="flex justify-end gap-3">
              <Button variant="outline">キャンセル</Button>
              <Button>登録する</Button>
            </div>
          </div>
        </Card>
      </div>
    </OwnerPortalShell>
  ),
}
