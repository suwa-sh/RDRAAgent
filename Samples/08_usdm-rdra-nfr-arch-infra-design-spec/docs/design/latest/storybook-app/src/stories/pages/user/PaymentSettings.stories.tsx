import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import React, { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Icon } from '@/components/ui/Icon'

// ---- 型定義 ----

type PaymentMethod = 'credit_card' | 'e_money'

// ---- ページコンポーネント ----

interface PaymentSettingsPageProps {
  initialMethod?: PaymentMethod
  loading?: boolean
  submitted?: boolean
  cardError?: boolean
}

const PaymentSettingsPage: React.FC<PaymentSettingsPageProps> = ({
  initialMethod = 'credit_card',
  loading = false,
  submitted = false,
  cardError = false,
}) => {
  const [method, setMethod] = useState<PaymentMethod>(initialMethod)
  const [cardNumber, setCardNumber] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvv, setCvv] = useState('')
  const [eMoneyId, setEMoneyId] = useState('')

  if (submitted) {
    return (
      <div style={{ maxWidth: 1280 }} className="mx-auto px-[var(--space-6)] py-[var(--space-8)]">
        <Card className="text-center py-[var(--space-12)]">
          <Icon name="credit-card" size={48} className="mx-auto mb-[var(--space-4)]" />
          <h2 className="text-[var(--text-xl)] font-[var(--font-semibold)] mb-[var(--space-2)]" style={{ color: 'var(--foreground)' }}>
            決済方法を設定しました
          </h2>
          <p className="text-[var(--text-sm)] mb-[var(--space-6)]" style={{ color: 'var(--foreground-secondary)' }}>
            設定が完了しました。元の画面に戻ります。
          </p>
          <Button variant="outline">戻る</Button>
        </Card>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 1280 }} className="mx-auto px-[var(--space-6)] py-[var(--space-8)]">
      <div className="flex flex-col gap-[var(--space-6)]" style={{ maxWidth: 560 }}>
        {/* ページタイトル */}
        <div className="flex items-center gap-[var(--space-3)]">
          <Button variant="ghost" size="sm">
            <Icon name="map-pin" size={14} />
            戻る
          </Button>
          <h1 className="text-[var(--text-2xl)] font-[var(--font-bold)]" style={{ color: 'var(--foreground)' }}>
            決済方法の設定
          </h1>
        </div>

        <Card>
          <div className="flex flex-col gap-[var(--space-6)]">
            {/* 決済方法選択 */}
            <div>
              <p className="text-[var(--text-sm)] font-[var(--font-medium)] mb-[var(--space-3)]" style={{ color: 'var(--foreground)' }}>
                決済方法を選択
              </p>
              <div className="flex gap-[var(--space-3)]">
                <Button
                  variant={method === 'credit_card' ? 'default' : 'outline'}
                  size="md"
                  onClick={() => setMethod('credit_card')}
                  className="flex-1"
                >
                  <Icon name="credit-card" size={16} />
                  クレジットカード
                </Button>
                <Button
                  variant={method === 'e_money' ? 'default' : 'outline'}
                  size="md"
                  onClick={() => setMethod('e_money')}
                  className="flex-1"
                >
                  <Icon name="shield-check" size={16} />
                  電子マネー
                </Button>
              </div>
            </div>

            {/* クレジットカード入力フォーム */}
            {method === 'credit_card' && (
              <div className="flex flex-col gap-[var(--space-4)]">
                <Input
                  label="カード番号"
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  error={cardError ? '正しいカード番号を入力してください' : undefined}
                  maxLength={19}
                />
                <div className="grid grid-cols-2 gap-[var(--space-3)]">
                  <Input
                    label="有効期限"
                    type="text"
                    placeholder="MM/YY"
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    maxLength={5}
                  />
                  <Input
                    label="CVV"
                    type="password"
                    placeholder="123"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    maxLength={4}
                  />
                </div>
                <div
                  className="flex items-center gap-[var(--space-2)] p-[var(--space-3)] rounded-[var(--radius-lg)]"
                  style={{ background: 'var(--muted)' }}
                >
                  <Icon name="shield-check" size={16} />
                  <p className="text-[var(--text-xs)]" style={{ color: 'var(--foreground-secondary)' }}>
                    カード情報はSSLで暗号化されて安全に送信されます
                  </p>
                </div>
              </div>
            )}

            {/* 電子マネー入力フォーム */}
            {method === 'e_money' && (
              <div className="flex flex-col gap-[var(--space-4)]">
                <Input
                  label="電子マネーID"
                  type="text"
                  placeholder="例: EM-1234567890"
                  value={eMoneyId}
                  onChange={(e) => setEMoneyId(e.target.value)}
                />
                <div
                  className="flex items-center gap-[var(--space-2)] p-[var(--space-3)] rounded-[var(--radius-lg)]"
                  style={{ background: 'var(--muted)' }}
                >
                  <Icon name="shield-check" size={16} />
                  <p className="text-[var(--text-xs)]" style={{ color: 'var(--foreground-secondary)' }}>
                    電子マネーカードに記載されたIDを入力してください
                  </p>
                </div>
              </div>
            )}

            {/* 操作ボタン */}
            <div className="flex gap-[var(--space-3)]">
              <Button variant="default" size="lg" loading={loading} className="flex-1">
                設定する
              </Button>
              <Button variant="ghost" size="lg">
                キャンセル
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

// ---- Meta ----

const meta: Meta<typeof PaymentSettingsPage> = {
  title: 'Pages/利用者/決済方法設定',
  component: PaymentSettingsPage,
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta
type Story = StoryObj<typeof PaymentSettingsPage>

// ---- Stories ----

export const CreditCard: Story = {
  args: {
    initialMethod: 'credit_card',
    loading: false,
    submitted: false,
    cardError: false,
  },
}

export const EMoney: Story = {
  args: {
    initialMethod: 'e_money',
    loading: false,
    submitted: false,
    cardError: false,
  },
}

export const WithValidationError: Story = {
  args: {
    initialMethod: 'credit_card',
    loading: false,
    submitted: false,
    cardError: true,
  },
}

export const Loading: Story = {
  args: {
    initialMethod: 'credit_card',
    loading: true,
    submitted: false,
    cardError: false,
  },
}

export const Submitted: Story = {
  args: {
    initialMethod: 'credit_card',
    loading: false,
    submitted: true,
    cardError: false,
  },
}
