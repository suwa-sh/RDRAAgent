import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import React from 'react'
import { OwnerPortalShell } from '@/components/layout/OwnerPortalShell'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Icon } from '@/components/ui/Icon'

const meta: Meta = {
  title: 'Pages/Owner/オーナー退会画面',
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
}
export default meta

type Story = StoryObj

export const Default: Story = {
  render: () => (
    <OwnerPortalShell currentPage="settings" breadcrumbs={['設定', '退会']}>
      <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', color: 'var(--foreground)', marginBottom: 'var(--spacing-6)' }}>
        オーナー退会する
      </h1>
      <div style={{ maxWidth: '32rem' }}>
        <Card>
          <div
            className="flex items-start gap-3"
            style={{
              padding: 'var(--spacing-3)',
              backgroundColor: 'var(--destructive-light)',
              borderRadius: 'var(--radius-md)',
              marginBottom: 'var(--spacing-4)',
            }}
          >
            <Icon name="shield-check" size={20} />
            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--destructive)' }}>
              退会すると、登録済みの会議室情報、予約データ、評価データがすべて削除されます。この操作は取り消せません。
            </div>
          </div>
          <div className="flex flex-col gap-2" style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground-secondary)', marginBottom: 'var(--spacing-6)' }}>
            <p>退会前にご確認ください:</p>
            <ul style={{ paddingLeft: 'var(--spacing-4)', listStyleType: 'disc' }}>
              <li>未精算の売上がある場合、精算完了後に退会してください</li>
              <li>有効な予約がある場合、予約期間終了後に退会してください</li>
              <li>退会後のデータ復元はできません</li>
            </ul>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline">キャンセル</Button>
            <Button variant="destructive">退会する</Button>
          </div>
        </Card>
      </div>
    </OwnerPortalShell>
  ),
}
