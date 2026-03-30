import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import React from 'react'
import { OwnerPortalShell } from '@/components/layout/OwnerPortalShell'
import { StepTracker } from '@/components/domain/StepTracker'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

const meta: Meta = {
  title: 'Pages/Owner/オーナー申請画面',
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
}
export default meta

type Story = StoryObj

export const Default: Story = {
  render: () => (
    <OwnerPortalShell currentPage="settings" breadcrumbs={['設定', 'オーナー登録', '申請']}>
      <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', color: 'var(--foreground)', marginBottom: 'var(--spacing-6)' }}>
        オーナー申請する
      </h1>
      <div style={{ maxWidth: '36rem' }}>
        <div style={{ marginBottom: 'var(--spacing-6)' }}>
          <StepTracker steps={['プロフィール入力', '規約確認', '申請']} currentStep={2} />
        </div>
        <Card>
          <div className="flex flex-col gap-4">
            <Input label="法人名/屋号" placeholder="株式会社サンプル" />
            <Input label="代表者名" placeholder="山田 太郎" required />
            <Input label="事業所住所" placeholder="東京都渋谷区..." required />
            <Input label="振込先口座情報" placeholder="銀行名・支店名・口座番号" required />
            <div className="flex justify-between">
              <Button variant="outline">戻る</Button>
              <Button>申請する</Button>
            </div>
          </div>
        </Card>
      </div>
    </OwnerPortalShell>
  ),
}
