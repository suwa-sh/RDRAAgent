import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import React from 'react'
import { OwnerPortalShell } from '@/components/layout/OwnerPortalShell'
import { StepTracker } from '@/components/domain/StepTracker'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

const meta: Meta = {
  title: 'Pages/Owner/規約確認画面',
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
}
export default meta

type Story = StoryObj

export const Default: Story = {
  render: () => (
    <OwnerPortalShell currentPage="settings" breadcrumbs={['設定', 'オーナー登録', '規約確認']}>
      <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', color: 'var(--foreground)', marginBottom: 'var(--spacing-6)' }}>
        規約を参照する
      </h1>
      <div style={{ maxWidth: '36rem' }}>
        <div style={{ marginBottom: 'var(--spacing-6)' }}>
          <StepTracker steps={['プロフィール入力', '規約確認', '申請']} currentStep={1} />
        </div>
        <Card>
          <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-semibold)', color: 'var(--foreground)', marginBottom: 'var(--spacing-3)' }}>
            利用規約
          </h2>
          <div
            style={{
              maxHeight: '20rem',
              overflowY: 'auto',
              padding: 'var(--spacing-4)',
              backgroundColor: 'var(--muted)',
              borderRadius: 'var(--radius-md)',
              fontSize: 'var(--text-sm)',
              color: 'var(--foreground-secondary)',
              marginBottom: 'var(--spacing-4)',
              lineHeight: '1.6',
            }}
          >
            <p style={{ marginBottom: 'var(--spacing-3)' }}>第1条（総則）</p>
            <p style={{ marginBottom: 'var(--spacing-3)' }}>
              本規約は、RoomConnect（以下「本サービス」）の利用条件を定めるものです。
              オーナーとして登録するすべての方は、本規約に同意したものとみなされます。
            </p>
            <p style={{ marginBottom: 'var(--spacing-3)' }}>第2条（サービス内容）</p>
            <p style={{ marginBottom: 'var(--spacing-3)' }}>
              本サービスは、会議室の貸し出しマッチングプラットフォームを提供します。
              オーナーは所有する会議室を登録し、利用者に貸し出すことができます。
            </p>
            <p style={{ marginBottom: 'var(--spacing-3)' }}>第3条（手数料）</p>
            <p>
              本サービスの利用にあたり、利用料金の10%を手数料として徴収します。
              精算は月次で行い、翌月末までにオーナー指定の口座に振り込みます。
            </p>
          </div>
          <div className="flex justify-between">
            <Button variant="outline">戻る</Button>
            <Button>同意して次へ</Button>
          </div>
        </Card>
      </div>
    </OwnerPortalShell>
  ),
}
