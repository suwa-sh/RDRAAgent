import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { OwnerLayout } from '@/components/layout/OwnerLayout'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'

/* ------------------------------------------------------------------ */
/* Types                                                                */
/* ------------------------------------------------------------------ */

type RoomType = 'physical' | 'virtual'
type WizardStep = 1 | 2 | 3 | 4

const EQUIPMENT_OPTIONS = [
  'プロジェクター',
  'ホワイトボード',
  'モニター',
  'Wi-Fi',
  '電話会議システム',
  'コーヒーメーカー',
  '冷蔵庫',
]

const MEETING_TOOLS = ['Zoom', 'Microsoft Teams', 'Google Meet']

const PRIMARY = '#0D9488'

/* ------------------------------------------------------------------ */
/* Sub-components                                                        */
/* ------------------------------------------------------------------ */

const FormField: React.FC<{
  label: string
  required?: boolean
  error?: string
  children: React.ReactNode
}> = ({ label, required, error, children }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
    <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', color: 'var(--foreground)' }}>
      {label}
      {required && <span style={{ color: '#DC2626', marginLeft: 4 }}>*</span>}
    </label>
    {children}
    {error && <span style={{ fontSize: 'var(--text-xs)', color: '#DC2626' }}>{error}</span>}
  </div>
)

const TextInput: React.FC<
  React.InputHTMLAttributes<HTMLInputElement> & { hasError?: boolean }
> = ({ hasError, style, ...props }) => (
  <input
    {...props}
    style={{
      height: 40,
      padding: '0 12px',
      border: `1px solid ${hasError ? '#DC2626' : 'var(--border)'}`,
      borderRadius: 'var(--radius-lg)',
      fontSize: 'var(--text-sm)',
      color: 'var(--foreground)',
      background: 'var(--card-bg)',
      outline: 'none',
      width: '100%',
      boxSizing: 'border-box',
      ...style,
    }}
  />
)

const SelectInput: React.FC<
  React.SelectHTMLAttributes<HTMLSelectElement> & { hasError?: boolean }
> = ({ hasError, style, ...props }) => (
  <select
    {...props}
    style={{
      height: 40,
      padding: '0 12px',
      border: `1px solid ${hasError ? '#DC2626' : 'var(--border)'}`,
      borderRadius: 'var(--radius-lg)',
      fontSize: 'var(--text-sm)',
      color: 'var(--foreground)',
      background: 'var(--card-bg)',
      outline: 'none',
      width: '100%',
      boxSizing: 'border-box',
      ...style,
    }}
  />
)

/* ------------------------------------------------------------------ */
/* Wizard step indicators                                               */
/* ------------------------------------------------------------------ */

const STEPS = ['基本情報', '設備', '画像', '確認']

const StepIndicator: React.FC<{ current: WizardStep }> = ({ current }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 24 }}>
    {STEPS.map((label, i) => {
      const stepNum = (i + 1) as WizardStep
      const isDone = stepNum < current
      const isActive = stepNum === current
      return (
        <React.Fragment key={label}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-semibold)',
                background: isDone ? '#16A34A' : isActive ? PRIMARY : 'var(--muted)',
                color: isDone || isActive ? '#fff' : 'var(--foreground-muted)',
                transition: 'background var(--duration-normal)',
              }}
            >
              {isDone ? (
                <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : (
                stepNum
              )}
            </div>
            <span
              style={{
                fontSize: 'var(--text-xs)',
                color: isActive ? PRIMARY : 'var(--foreground-muted)',
                fontWeight: isActive ? 'var(--font-medium)' : 'var(--font-normal)',
                whiteSpace: 'nowrap',
              }}
            >
              {label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div
              style={{
                flex: 1,
                height: 2,
                background: isDone ? '#16A34A' : 'var(--border)',
                marginBottom: 20,
                transition: 'background var(--duration-normal)',
              }}
            />
          )}
        </React.Fragment>
      )
    })}
  </div>
)

/* ------------------------------------------------------------------ */
/* Main wizard component                                                 */
/* ------------------------------------------------------------------ */

const RoomRegistrationPage: React.FC<{ initialStep?: WizardStep }> = ({ initialStep = 1 }) => {
  const [step, setStep] = useState<WizardStep>(initialStep)
  const [roomType, setRoomType] = useState<RoomType>('physical')
  const [formValues, setFormValues] = useState({
    name: '',
    address: '',
    area: '',
    capacity: '',
    price: '',
    meetingTool: 'Zoom',
    maxConnections: '',
    recordingAllowed: false,
    equipment: [] as string[],
    imageNote: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const set = (key: keyof typeof formValues, value: string | boolean | string[]) => {
    setFormValues((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => { const next = { ...prev }; delete next[key]; return next })
  }

  const toggleEquipment = (item: string) => {
    setFormValues((prev) => ({
      ...prev,
      equipment: prev.equipment.includes(item)
        ? prev.equipment.filter((e) => e !== item)
        : [...prev.equipment, item],
    }))
  }

  const validateStep1 = () => {
    const e: Record<string, string> = {}
    if (!formValues.name.trim()) e.name = '会議室名は必須です'
    if (roomType === 'physical') {
      if (!formValues.address.trim()) e.address = '所在地は必須です'
      if (!formValues.capacity.trim()) e.capacity = '収容人数は必須です'
    }
    if (roomType === 'virtual') {
      if (!formValues.maxConnections.trim()) e.maxConnections = '同時接続数は必須です'
    }
    if (!formValues.price.trim()) e.price = '料金は必須です'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleNextStep1 = () => {
    if (validateStep1()) setStep(2)
  }

  const handleFinalSubmit = () => {
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      setSubmitted(true)
    }, 1200)
  }

  if (submitted) {
    return (
      <Card>
        <div style={{ textAlign: 'center', padding: '40px 0', maxWidth: 480 }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
            <svg width={56} height={56} viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" /><polyline points="9 12 11 14 15 10" />
            </svg>
          </div>
          <p style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-semibold)', color: 'var(--foreground)', marginBottom: 8 }}>
            登録が完了しました
          </p>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground-secondary)', marginBottom: 20 }}>
            運用ルールを設定して公開準備を進めてください。
          </p>
          <a
            href="/owner/rooms/ROOM-NEW/operation-rules"
            style={{ fontSize: 'var(--text-sm)', color: PRIMARY, textDecoration: 'underline' }}
          >
            運用ルール設定画面へ
          </a>
        </div>
      </Card>
    )
  }

  return (
    <div style={{ maxWidth: 640 }}>
      <h1 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-bold)', color: 'var(--foreground)', margin: '0 0 24px', display: 'flex', alignItems: 'center', gap: 8 }}>
        <Icon name="room" size={22} />
        会議室を登録する
      </h1>

      <StepIndicator current={step} />

      {/* Step 1: 基本情報 */}
      {step === 1 && (
        <Card>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <FormField label="会議室種別" required>
              <SelectInput
                value={roomType}
                onChange={(e) => setRoomType(e.target.value as RoomType)}
              >
                <option value="physical">物理（実会議室）</option>
                <option value="virtual">バーチャル（オンライン会議室）</option>
              </SelectInput>
            </FormField>

            <FormField label="会議室名" required error={errors.name}>
              <TextInput
                value={formValues.name}
                onChange={(e) => set('name', e.target.value)}
                placeholder="例: 渋谷スカイルーム A"
                maxLength={100}
                hasError={!!errors.name}
              />
            </FormField>

            {roomType === 'physical' && (
              <>
                <FormField label="所在地" required error={errors.address}>
                  <TextInput
                    value={formValues.address}
                    onChange={(e) => set('address', e.target.value)}
                    placeholder="例: 東京都渋谷区道玄坂1-2-3 ○○ビル5F"
                    hasError={!!errors.address}
                  />
                </FormField>
                <FormField label="広さ（㎡）">
                  <TextInput
                    type="number"
                    value={formValues.area}
                    onChange={(e) => set('area', e.target.value)}
                    placeholder="例: 30"
                    min={1}
                  />
                </FormField>
                <FormField label="収容人数（人）" required error={errors.capacity}>
                  <TextInput
                    type="number"
                    value={formValues.capacity}
                    onChange={(e) => set('capacity', e.target.value)}
                    placeholder="例: 10"
                    min={1}
                    hasError={!!errors.capacity}
                  />
                </FormField>
              </>
            )}

            {roomType === 'virtual' && (
              <>
                <FormField label="会議ツール">
                  <SelectInput
                    value={formValues.meetingTool}
                    onChange={(e) => set('meetingTool', e.target.value)}
                  >
                    {MEETING_TOOLS.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </SelectInput>
                </FormField>
                <FormField label="同時接続数（人）" required error={errors.maxConnections}>
                  <TextInput
                    type="number"
                    value={formValues.maxConnections}
                    onChange={(e) => set('maxConnections', e.target.value)}
                    placeholder="例: 50"
                    min={1}
                    hasError={!!errors.maxConnections}
                  />
                </FormField>
                <FormField label="録画">
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={formValues.recordingAllowed}
                      onChange={(e) => set('recordingAllowed', e.target.checked)}
                      style={{ width: 16, height: 16, accentColor: PRIMARY }}
                    />
                    <span style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground)' }}>録画を許可する</span>
                  </label>
                </FormField>
              </>
            )}

            <FormField label="利用料金（円/時間）" required error={errors.price}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <TextInput
                  type="number"
                  value={formValues.price}
                  onChange={(e) => set('price', e.target.value)}
                  placeholder="例: 2000"
                  min={0}
                  hasError={!!errors.price}
                />
                {formValues.price && !isNaN(Number(formValues.price)) && (
                  <div
                    style={{
                      fontSize: 'var(--text-sm)',
                      color: PRIMARY,
                      fontWeight: 'var(--font-medium)',
                      padding: '4px 8px',
                      background: '#F0FDFA',
                      borderRadius: 'var(--radius-md)',
                      display: 'inline-block',
                    }}
                  >
                    ¥{Number(formValues.price).toLocaleString()}/時間
                  </div>
                )}
              </div>
            </FormField>

            <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 8 }}>
              <Button variant="default" size="lg" onClick={handleNextStep1} style={{ background: PRIMARY }}>
                次へ（設備情報）
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Step 2: 設備 */}
      {step === 2 && (
        <Card>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <FormField label="設備・機能（複数選択可）">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
                {EQUIPMENT_OPTIONS.map((item) => (
                  <label key={item} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={formValues.equipment.includes(item)}
                      onChange={() => toggleEquipment(item)}
                      style={{ width: 16, height: 16, accentColor: PRIMARY }}
                    />
                    <span style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground)' }}>{item}</span>
                  </label>
                ))}
              </div>
            </FormField>

            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 8 }}>
              <Button variant="outline" size="lg" onClick={() => setStep(1)}>
                戻る
              </Button>
              <Button variant="default" size="lg" onClick={() => setStep(3)} style={{ background: PRIMARY }}>
                次へ（画像）
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Step 3: 画像 */}
      {step === 3 && (
        <Card>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <p style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', color: 'var(--foreground)', marginBottom: 12 }}>
                会議室の画像をアップロードしてください（最大5枚）
              </p>
              <div
                style={{
                  border: '2px dashed var(--border)',
                  borderRadius: 'var(--radius-xl)',
                  padding: '40px 24px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 12,
                  background: 'var(--background-secondary)',
                }}
              >
                <Icon name="room" size={40} />
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground-secondary)', textAlign: 'center', margin: 0 }}>
                  ここに画像をドロップするか、クリックして選択
                </p>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--foreground-muted)', margin: 0 }}>
                  JPG・PNG・WebP、各ファイル最大5MB
                </p>
                <Button variant="outline" size="sm">
                  ファイルを選択
                </Button>
              </div>
            </div>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--foreground-muted)', margin: 0 }}>
              ※ 画像は後からでも追加できます
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 8 }}>
              <Button variant="outline" size="lg" onClick={() => setStep(2)}>
                戻る
              </Button>
              <Button variant="default" size="lg" onClick={() => setStep(4)} style={{ background: PRIMARY }}>
                次へ（確認）
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Step 4: 確認 */}
      {step === 4 && (
        <Card>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <p style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-semibold)', color: 'var(--foreground)', marginBottom: 16 }}>
                入力内容の確認
              </p>
              <dl style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '10px 20px' }}>
                {[
                  ['種別', roomType === 'physical' ? '物理（実会議室）' : 'バーチャル（オンライン会議室）'],
                  ['会議室名', formValues.name || '（未入力）'],
                  ...(roomType === 'physical'
                    ? [
                        ['所在地', formValues.address || '（未入力）'],
                        ['広さ', formValues.area ? `${formValues.area} ㎡` : '（未設定）'],
                        ['収容人数', formValues.capacity ? `${formValues.capacity} 人` : '（未入力）'],
                      ]
                    : [
                        ['会議ツール', formValues.meetingTool],
                        ['同時接続数', formValues.maxConnections ? `${formValues.maxConnections} 人` : '（未入力）'],
                        ['録画', formValues.recordingAllowed ? '許可' : '不可'],
                      ]),
                  ['料金', formValues.price ? `¥${Number(formValues.price).toLocaleString()}/時間` : '（未入力）'],
                  ['設備', formValues.equipment.length > 0 ? formValues.equipment.join('、') : '（なし）'],
                ].map(([label, value]) => (
                  <React.Fragment key={label}>
                    <dt style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground-secondary)', whiteSpace: 'nowrap' }}>{label}</dt>
                    <dd style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground)', margin: 0 }}>{value}</dd>
                  </React.Fragment>
                ))}
              </dl>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 8 }}>
              <Button variant="outline" size="lg" onClick={() => setStep(3)}>
                戻る
              </Button>
              <Button
                variant="default"
                size="lg"
                loading={isSubmitting}
                onClick={handleFinalSubmit}
                style={{ background: PRIMARY }}
              >
                {isSubmitting ? '登録中...' : '登録する'}
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Story meta                                                            */
/* ------------------------------------------------------------------ */

const meta: Meta = {
  title: 'Pages/オーナー/会議室登録',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => {
      if (typeof document !== 'undefined') {
        document.documentElement.setAttribute('data-portal', 'owner')
      }
      return (
        <OwnerLayout
          breadcrumbs={[
            { label: 'ダッシュボード', href: '/owner' },
            { label: '会議室管理', href: '/owner/rooms' },
            { label: '会議室を登録する' },
          ]}
          notificationCount={2}
          userName="田中 一郎"
        >
          <Story />
        </OwnerLayout>
      )
    },
  ],
}

export default meta
type Story = StoryObj<typeof meta>

/* ------------------------------------------------------------------ */
/* Stories                                                              */
/* ------------------------------------------------------------------ */

export const Step1BasicInfo: Story = {
  name: 'Step1: 基本情報',
  render: () => <RoomRegistrationPage initialStep={1} />,
}

export const Step2Equipment: Story = {
  name: 'Step2: 設備',
  render: () => <RoomRegistrationPage initialStep={2} />,
}

export const Step3Images: Story = {
  name: 'Step3: 画像',
  render: () => <RoomRegistrationPage initialStep={3} />,
}

export const Step4Confirm: Story = {
  name: 'Step4: 確認',
  render: () => <RoomRegistrationPage initialStep={4} />,
}
