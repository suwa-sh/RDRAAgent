# Design System: RoomConnect

## Overview

| 項目 | 内容 |
|------|------|
| Event ID | 20260330_154625_design_system |
| Created At | 2026-03-30T15:46:25 |
| Source | 初期デザインシステム生成: 貸し会議室マッチングSaaS |
| Portals | 3 |
| Components | 15 |
| Screens | 28 |

## Brand

- **Name**: RoomConnect
- **Primary Color**: Blue 600 (#2563EB)
- **Secondary Color**: Teal 600 (#0D9488)
- **Sans Font**: 'Noto Sans JP', 'Inter', system-ui, sans-serif
- **Mono Font**: 'JetBrains Mono', 'Fira Code', monospace
- **Type Scale**: xs, sm, base, lg, xl, 2xl, 3xl
- **Tone**: 信頼感のある、親しみやすいトーン
- **Principles**: 簡潔で分かりやすい表現, 専門用語を避ける, ポジティブな表現を優先する
- **Logo Variants**:
  - full: `assets/logo-full.svg`
  - icon: `assets/logo-icon.svg`
  - stacked: `assets/logo-stacked.svg`

## Portals

| ID | Name | Actor | Primary Color | Screen Count |
|-----|------|-------|:-------------:|:------------:|
| user | 利用者ポータル | 利用者 | #2563EB | 7 |
| owner | オーナーポータル | 会議室オーナー | #0D9488 | 15 |
| admin | 管理者ポータル | サービス運営担当者 | #334155 | 6 |

## Design Tokens

### Primitive

- **Color Scales**: white, black, gray-50, gray-100, gray-200, gray-300, gray-400, gray-500, gray-600, gray-700, gray-800, gray-900, gray-950, blue-50, blue-100, blue-200, blue-500, blue-600, blue-700, teal-50, teal-100, teal-500, teal-600, teal-700, slate-500, slate-600, slate-700, green-50, green-500, green-600, amber-50, amber-400, amber-500, amber-600, orange-50, orange-500, orange-600, red-50, red-500, red-600, violet-50, violet-500, violet-600 (43 scales)
- **Spacing Scale**: 0: 0, 1: 0.25rem, 2: 0.5rem, 3: 0.75rem, 4: 1rem, 5: 1.25rem, 6: 1.5rem, 8: 2rem, 10: 2.5rem, 12: 3rem, 16: 4rem
- **Radius**: none, sm, md, lg, xl, full
- **Shadow**: sm, md, lg
- **Font Size**: xs, sm, base, lg, xl, 2xl, 3xl
- **Duration**: fast, normal, slow

### Semantic

- **background**: #FFFFFF
- **foreground**: #0F172A
- **border**: #E2E8F0
- **muted**: #F1F5F9
- **muted-foreground**: #64748B
- **success**: #16A34A
- **success-light**: #F0FDF4
- **warning**: #EA580C
- **warning-light**: #FFF7ED
- **destructive**: #DC2626
- **destructive-light**: #FEF2F2
- **info**: #2563EB
- **info-light**: #EFF6FF
- **rating**: #D97706
- **virtual_accent**: #7C3AED

### Component

- **button**: height-sm, height-md, height-lg, padding-x, radius
- **input**: height, padding-x, radius
- **card**: padding, radius, shadow
- **badge**: height, padding-x, radius, font-size
- **sidebar**: width, item-height
- **table**: header-bg, row-height, cell-padding

### Dark Mode Overrides

**Semantic overrides:**

- **background**: #0F172A
- **foreground**: #F8FAFC
- **border**: #334155
- **muted**: #1E293B
- **muted-foreground**: #94A3B8
- **success-light**: rgba(22, 163, 74, 0.15)
- **warning-light**: rgba(234, 88, 12, 0.15)
- **destructive-light**: rgba(220, 38, 38, 0.15)
- **info-light**: rgba(37, 99, 235, 0.15)

**Component overrides:**

- **card**: bg, border, shadow
- **table**: header-bg

## Components

### UI Components

| Name | Variants | Sizes |
|------|----------|-------|
| Button | default, secondary, outline, ghost, destructive | sm, md, lg |
| Badge | default, success, warning, destructive, info, outline | - |
| Card | default, hoverable | - |
| Input | default, error | - |
| Icon | - | - |

### Domain Components

| Name | Description | Screens |
|------|-------------|---------|
| RoomCard | 会議室情報をカード形式で表示。画像、名前、所在地、価格、評価を含む | 会議室検索画面 |
| SearchFilter | 会議室検索用フィルター。所在地、価格帯、収容人数、設備で絞り込む | 会議室検索画面 |
| BookingCalendar | 予約日時を選択するカレンダー。空き状況を表示 | 会議室予約画面 |
| ReservationCard | 予約情報を表示するカード。予約状態、日時、会議室名を含む | 利用者許諾画面, 予約変更画面, 予約取消画面 |
| StarRating | 星評価の表示と入力。SVGベースで1〜5の評価をサポート | 評価登録画面, 会議室評価一覧画面, 会議室検索画面 |
| StatusBadge | 各種ステータスをBadge形式で表示。状態モデルと色のマッピングを内包 | 全画面で横断利用 |
| StepTracker | 状態遷移のステップ表示。現在のステップを強調表示 | 予約詳細, オーナー詳細 |
| PriceDisplay | 金額を日本円形式でフォーマット表示。割引価格の打ち消し線表示に対応 | 会議室予約画面, 精算確認画面, 売上実績確認画面 |
| InquiryThread | 問合せのスレッド表示。送信者と回答をタイムライン形式で表示 | 問合せ送信画面, 問合せ回答画面, サービス問合せ画面, サービス問合せ対応画面 |
| SummaryCard | 集計データをサマリー表示。指標名、値、前期比を含む | 手数料売上分析画面, 利用実績確認画面, 売上実績確認画面, 利用状況分析画面 |

## Screen Mapping

### 利用者ポータル (user)

| Name | Route | Components |
|------|-------|------------|
| 会議室検索画面 | /rooms/search | SearchFilter, RoomCard, StarRating |
| 会議室予約画面 | /rooms/:id/reserve | BookingCalendar, PriceDisplay, Button |
| 予約変更画面 | /reservations/:id/edit | ReservationCard, BookingCalendar, Button |
| 予約取消画面 | /reservations/:id/cancel | ReservationCard, Button |
| 評価登録画面 | /reservations/:id/review | StarRating, Input, Button |
| 問合せ送信画面 | /inquiries/new | InquiryThread, Input, Button |
| サービス問合せ画面 | /support/new | InquiryThread, Input, Button |

### オーナーポータル (owner)

| Name | Route | Components |
|------|-------|------------|
| オーナー登録画面 | /register | Input, Button, StepTracker |
| 規約確認画面 | /register/terms | Card, Button |
| オーナー申請画面 | /register/apply | Input, Button, StepTracker |
| オーナー退会画面 | /settings/withdraw | Card, Button |
| 会議室登録画面 | /rooms/new | Input, Button |
| 運用ルール設定画面 | /rooms/:id/rules | Input, Button, Card |
| 会議室評価一覧画面 | /rooms/:id/reviews | StarRating, Card |
| 利用者許諾画面 | /reservations/:id/approve | ReservationCard, StarRating, StatusBadge, Button |
| 鍵管理画面 | /reservations/:id/key | StatusBadge, Button |
| 鍵返却画面 | /reservations/:id/key-return | StatusBadge, Button |
| 利用者評価登録画面 | /reservations/:id/rate-user | StarRating, Input, Button |
| 問合せ回答画面 | /inquiries/:id/reply | InquiryThread, Input, Button |
| 利用実績確認画面 | /analytics/usage | SummaryCard, Card |
| 売上実績確認画面 | /analytics/revenue | SummaryCard, PriceDisplay |
| 精算確認画面 | /settlements | PriceDisplay, StatusBadge, Card |

### 管理者ポータル (admin)

| Name | Route | Components |
|------|-------|------------|
| オーナー審査画面 | /owners/:id/review | StatusBadge, StepTracker, Card, Button |
| 手数料売上分析画面 | /analytics/commission | SummaryCard, PriceDisplay |
| 利用履歴管理画面 | /analytics/history | Card, StatusBadge |
| 利用状況分析画面 | /analytics/usage | SummaryCard, Card |
| サービス問合せ対応画面 | /inquiries/:id | InquiryThread, Input, Button |
| 精算実行画面 | /settlements/execute | PriceDisplay, StatusBadge, Button |

## State Mapping

### オーナー状態

| State | Label | Color | Actions |
|-------|-------|:-----:|---------|
| 未登録 | 未登録 | gray | - |
| 申請中 | 申請中 | blue | - |
| 審査中 | 審査中 | amber | - |
| 承認済 | 承認済 | green | - |
| 却下 | 却下 | red | - |
| 退会 | 退会 | gray | - |

### 予約状態

| State | Label | Color | Actions |
|-------|-------|:-----:|---------|
| 予約申請中 | 予約申請中 | blue | - |
| 予約確定 | 予約確定 | green | - |
| 変更中 | 変更中 | amber | - |
| 取消済 | 取消済 | red | - |
| 利用済 | 利用済 | gray | - |

### 鍵状態

| State | Label | Color | Actions |
|-------|-------|:-----:|---------|
| 保管中 | 保管中 | gray | - |
| 貸出中 | 貸出中 | amber | - |
| 返却済 | 返却済 | green | - |

### 会議室利用状態

| State | Label | Color | Actions |
|-------|-------|:-----:|---------|
| 利用前 | 利用前 | gray | - |
| 利用中 | 利用中 | blue | - |
| 利用終了 | 利用終了 | green | - |

### 会議室状態

| State | Label | Color | Actions |
|-------|-------|:-----:|---------|
| 未公開 | 未公開 | gray | - |
| 公開中 | 公開中 | green | - |
| 貸出停止 | 貸出停止 | red | - |

## NFR Design Decisions

| NFR | Decision |
|-----|----------|
| 可用性 A.1.1.1 (9時〜翌8時運用) | 全画面にエラー状態・ローディング状態（Skeleton UI）を実装 |
| 性能 B.2.1.1 (レスポンスタイム) | Skeleton UI でパーシーブドパフォーマンス改善、ページネーション対応 |
| セキュリティ E.5.2.1 (RBAC) | ポータル別ナビゲーション・権限ベース表示切替 |
| セキュリティ E.6.1.1 (暗号化) | PII マスク表示（カード番号、電話番号） |
| 運用 F.1.1.2 (モバイル対応) | User ポータルをモバイルファースト設計、レスポンシブ対応 |
