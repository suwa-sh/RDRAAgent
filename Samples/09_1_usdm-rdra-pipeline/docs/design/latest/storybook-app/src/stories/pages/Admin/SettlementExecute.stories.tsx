import type { Meta, StoryObj } from '@storybook/react'
import React, { useState } from 'react'
import { PriceDisplay } from '../../../components/domain/PriceDisplay'
import { ConfirmActionModal } from '../../../components/common/ConfirmActionModal'

const SettlementExecutePage: React.FC<{ showModal?: boolean }> = ({ showModal = false }) => {
  const [modalOpen, setModalOpen] = useState(showModal)

  return (
    <div style={{ backgroundColor: 'var(--background)', minHeight: '100vh' }}>
      {/* Admin Header */}
      <header
        className="flex items-center justify-between px-6 h-16"
        style={{
          backgroundColor: 'var(--card-bg)',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <span className="text-xl font-bold" style={{ color: 'var(--color-slate-700, #334155)' }}>
          RoomConnect Admin
        </span>
        <span className="text-sm" style={{ color: 'var(--foreground)' }}>管理太郎</span>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className="w-64 min-h-screen p-4"
          style={{
            backgroundColor: 'var(--card-bg)',
            borderRight: '1px solid var(--border)',
          }}
        >
          <nav className="space-y-1">
            {['ダッシュボード', 'オーナー管理', '分析', '問合せ', '精算'].map((item) => (
              <div
                key={item}
                className="px-3 py-2 rounded text-sm"
                style={{
                  color: item === '精算' ? 'var(--primary)' : 'var(--muted-foreground)',
                  backgroundColor: item === '精算' ? 'var(--muted)' : 'transparent',
                  fontWeight: item === '精算' ? 600 : 400,
                }}
              >
                {item}
              </div>
            ))}
          </nav>
        </aside>

        {/* Main */}
        <main className="flex-1 p-6">
          <h1 className="text-2xl font-bold mb-6" style={{ color: 'var(--foreground)' }}>
            精算実行
          </h1>

          <div
            className="rounded-lg p-6 max-w-lg"
            style={{
              backgroundColor: 'var(--card-bg)',
              border: '1px solid var(--card-border)',
              boxShadow: 'var(--card-shadow)',
            }}
          >
            <dl className="space-y-4">
              <div>
                <dt className="text-sm" style={{ color: 'var(--muted-foreground)' }}>オーナー</dt>
                <dd className="text-lg font-semibold" style={{ color: 'var(--foreground)' }}>鈴木花子</dd>
              </div>
              <div>
                <dt className="text-sm" style={{ color: 'var(--muted-foreground)' }}>対象月</dt>
                <dd className="text-lg" style={{ color: 'var(--foreground)' }}>2026年3月</dd>
              </div>
              <div>
                <dt className="text-sm" style={{ color: 'var(--muted-foreground)' }}>精算額</dt>
                <dd><PriceDisplay amount={150000} size="lg" /></dd>
              </div>
            </dl>

            <button
              onClick={() => setModalOpen(true)}
              className="mt-6 w-full px-4 py-3 rounded-md text-sm font-semibold"
              style={{
                backgroundColor: 'var(--primary)',
                color: 'var(--primary-foreground)',
              }}
            >
              精算を実行する
            </button>
          </div>

          <ConfirmActionModal
            open={modalOpen}
            title="精算を実行しますか？"
            message={'オーナー「鈴木花子」に150,000円を精算します。実行しますか？'}
            confirmLabel="精算を実行する"
            onConfirm={() => { setModalOpen(false); alert('精算実行開始') }}
            onCancel={() => setModalOpen(false)}
          />
        </main>
      </div>
    </div>
  )
}

const meta: Meta<typeof SettlementExecutePage> = {
  title: 'Pages/Admin/精算実行',
  component: SettlementExecutePage,
  parameters: {
    layout: 'fullscreen',
  },
}
export default meta
type Story = StoryObj<typeof SettlementExecutePage>

export const Default: Story = {
  args: {},
}

export const WithConfirmModal: Story = {
  args: {
    showModal: true,
  },
}
