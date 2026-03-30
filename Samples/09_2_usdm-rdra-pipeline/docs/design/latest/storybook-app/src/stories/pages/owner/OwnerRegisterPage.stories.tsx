import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import React from 'react'
import { OwnerPortalShell } from '@/components/layout/OwnerPortalShell'
import { StepTracker } from '@/components/domain/StepTracker'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

const meta: Meta = {
  title: 'Pages/Owner/オーナー登録画面',
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
}
export default meta

type Story = StoryObj

export const Default: Story = {
  render: () => (
    <OwnerPortalShell currentPage="settings" breadcrumbs={['設定', 'オーナー登録']}>
      <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', color: 'var(--foreground)', marginBottom: 'var(--spacing-6)' }}>
        オーナーを登録する
      </h1>
      <div style={{ maxWidth: '36rem' }}>
        <div style={{ marginBottom: 'var(--spacing-6)' }}>
          <StepTracker steps={['プロフィール入力', '規約確認', '申請']} currentStep={0} />
        </div>
        <Card>
          <div className="flex flex-col gap-4">
            <Input label="氏名" placeholder="山田 太郎" required />
            <Input label="メールアドレス" placeholder="taro@example.com" type="email" required />
            <Input label="電話番号" placeholder="090-1234-5678" type="tel" required />
            <Input label="プロフィール" placeholder="自己紹介や会社の情報を入力してください" />
            <div className="flex justify-end">
              <Button>次へ進む</Button>
            </div>
          </div>
        </Card>
      </div>
    </OwnerPortalShell>
  ),
}
