# Design System: RoomConnect

## Overview

| 項目 | 内容 |
|------|------|
| Event ID | 20260330_114529_design_system |
| Created At | 2026-03-30T11:45:29 |
| Source | 初期デザインシステム生成: 貸し会議室マッチングSaaS |
| Portals | 3 |
| Components | 14 |
| Screens | 24 |

## Brand

- **Name**: RoomConnect
- **Primary Color**: Blue 600 (#2563EB)
- **Secondary Color**: Teal 600 (#0D9488)
- **Sans Font**: 'Noto Sans JP', 'Inter', system-ui, sans-serif
- **Mono Font**: 'JetBrains Mono', 'Fira Code', monospace
- **Type Scale**: xs, sm, base, lg, xl, 2xl, 3xl
- **Tone**: 信頼感のある親しみやすさ
- **Principles**: 明確で簡潔な表現, 専門用語を避けたわかりやすさ, 安心感を与える丁寧さ
- **Logo Variants**:
  - full: `assets/logo-full.svg`
  - icon: `assets/logo-icon.svg`
  - stacked: `assets/logo-stacked.svg`

## Portals

| ID | Name | Actor | Primary Color | Screen Count |
|-----|------|-------|:-------------:|:------------:|
| user | User (利用者) | 利用者 | #2563EB | 7 |
| owner | Owner (提供者) | 会議室オーナー | #0D9488 | 10 |
| admin | Admin (管理者) | サービス運営担当者 | #334155 | 7 |

## Design Tokens

### Primitive

- **Color Scales**: white, black, gray-50, gray-100, gray-200, gray-300, gray-400, gray-500, gray-600, gray-700, gray-800, gray-900, gray-950, blue-50, blue-100, blue-500, blue-600, blue-700, teal-50, teal-500, teal-600, teal-700, slate-500, slate-600, slate-700, green-500, green-600, orange-500, orange-600, red-500, red-600, amber-400, amber-500, violet-500, violet-600 (35 scales)
- **Spacing Scale**: 0: 0, 1: 0.25rem, 2: 0.5rem, 3: 0.75rem, 4: 1rem, 5: 1.25rem, 6: 1.5rem, 8: 2rem, 10: 2.5rem, 12: 3rem, 16: 4rem
- **Radius**: sm, md, lg, xl, full
- **Shadow**: sm, md, lg
- **Font Size**: xs, sm, base, lg, xl
- **Duration**: fast, normal, slow

### Semantic

- **background**: var(--color-white)
- **foreground**: var(--color-gray-900)
- **border**: var(--color-gray-200)
- **muted**: var(--color-gray-100)
- **success**: var(--color-green-600)
- **warning**: var(--color-orange-500)
- **destructive**: var(--color-red-600)
- **info**: var(--color-blue-600)
- **rating**: var(--color-amber-400)
- **virtual_accent**: var(--color-violet-500)

### Component

- **button**: height-sm, height-md, height-lg, padding-x, radius
- **input**: height, padding-x, radius, border
- **card**: padding, radius, shadow
- **badge**: height, padding-x, radius, font-size
- **sidebar**: width, item-height
- **table**: header-bg, row-height, cell-padding

### Dark Mode Overrides

**Semantic overrides:**

- **background**: var(--color-gray-950)
- **foreground**: var(--color-gray-100)
- **border**: var(--color-gray-800)
- **muted**: var(--color-gray-900)
- **success-light**: rgba(22, 163, 74, 0.15)
- **warning-light**: rgba(249, 115, 22, 0.15)
- **destructive-light**: rgba(220, 38, 38, 0.15)
- **info-light**: rgba(59, 130, 246, 0.15)
- **virtual-light**: rgba(139, 92, 246, 0.15)

**Component overrides:**

- **card-bg**: var(--color-gray-900)
- **card-border**: var(--color-gray-800)
- **card-shadow**: 0 4px 6px -1px rgba(0,0,0,0.3)
- **table-header-bg**: var(--color-gray-900)
- **hover-muted**: var(--color-gray-800)
- **rating-empty**: var(--color-gray-700)

## Components

### UI Components

| Name | Variants | Sizes |
|------|----------|-------|
| Button | default, secondary, outline, ghost, destructive | sm, md, lg |
| Badge | default, success, warning, destructive, info, outline | - |
| Card | default, hoverable | - |
| Input | default, error | - |
| Icon | default | - |

### Domain Components

| Name | Description | Screens |
|------|-------------|---------|
| RoomCard | 会議室情報カード (画像・名称・価格・評価・機能) | 会議室検索画面 |
| SearchFilter | 会議室検索フィルター (機能性・価格帯・評価) | 会議室検索画面 |
| StarRating | 評価表示・入力コンポーネント (SVG星) | 会議室評価登録画面, 会議室評価一覧画面, 会議室検索画面 |
| BookingCalendar | 予約日時選択カレンダー | 予約登録画面, 予約変更画面 |
| ReservationStatusBadge | 予約状態バッジ (仮予約/予約確定/変更中/取消済/完了) | 予約登録画面, 予約変更画面, 予約取消画面 |
| KeyStatusBadge | 鍵状態バッジ (貸出中/返却済) | 鍵管理画面, 鍵返却画面 |
| PriceDisplay | 金額表示コンポーネント (JPY フォーマット) | 会議室検索画面, 精算処理画面, 売上分析画面 |
| InquiryThread | 問合せスレッド表示 (メッセージ + 回答) | 問合せ回答画面, 問合せ対応画面 |
| SummaryCard | サマリーカード (KPI表示: 売上・利用状況等) | 売上分析画面, 利用状況分析画面 |

## Screen Mapping

### User (利用者) (user)

| Name | Route | Components |
|------|-------|------------|
| 会議室検索画面 | /rooms | SearchFilter, RoomCard, StarRating, PriceDisplay |
| 予約登録画面 | /rooms/:id/reserve | BookingCalendar, ReservationStatusBadge, PriceDisplay |
| 予約変更画面 | /reservations/:id/edit | BookingCalendar, ReservationStatusBadge |
| 予約取消画面 | /reservations/:id/cancel | ReservationStatusBadge |
| 鍵返却画面 | /reservations/:id/key-return | KeyStatusBadge |
| 会議室評価登録画面 | /reservations/:id/review | StarRating |
| 問合せ画面 | /inquiries | InquiryThread |

### Owner (提供者) (owner)

| Name | Route | Components |
|------|-------|------------|
| プロフィール登録画面 | /profile | Input, Button |
| オーナー申請画面 | /apply | Input, Button |
| 会議室登録画面 | /rooms/new | Input, Button |
| 運用ルール設定画面 | /rooms/:id/rules | Input, Button |
| 会議室評価一覧画面 | /rooms/:id/reviews | StarRating, Card |
| 利用者評価確認画面 | /reservations/:id/user-review | StarRating |
| 鍵管理画面 | /rooms/:id/keys | KeyStatusBadge |
| 利用者評価登録画面 | /reservations/:id/rate-user | StarRating |
| 問合せ回答画面 | /inquiries/:id | InquiryThread |
| 退会申請画面 | /withdraw | Button |

### Admin (管理者) (admin)

| Name | Route | Components |
|------|-------|------------|
| オーナー審査画面 | /admin/owners/:id/review | Badge, Button |
| 退会処理画面 | /admin/owners/:id/withdraw | Button |
| 売上分析画面 | /admin/analytics/revenue | SummaryCard, PriceDisplay |
| 利用状況分析画面 | /admin/analytics/usage | SummaryCard |
| 問合せ対応画面 | /admin/inquiries/:id | InquiryThread |
| 精算処理画面 | /admin/settlements | SummaryCard, PriceDisplay |
| 精算実行画面 | /admin/settlements/:id/execute | PriceDisplay, Button |

## State Mapping

### オーナー申請状態

| State | Label | Color | Actions |
|-------|-------|:-----:|---------|
| 申請中 | 申請中 | blue | - |
| 審査中 | 審査中 | orange | - |
| 承認 | 承認 | green | - |
| 却下 | 却下 | red | - |
| 退会 | 退会 | gray | - |

### 予約状態

| State | Label | Color | Actions |
|-------|-------|:-----:|---------|
| 仮予約 | 仮予約 | amber | - |
| 予約確定 | 予約確定 | green | - |
| 変更中 | 変更中 | orange | - |
| 取消済 | 取消済 | gray | - |
| 完了 | 完了 | blue | - |

### 会議室利用状態

| State | Label | Color | Actions |
|-------|-------|:-----:|---------|
| 利用前 | 利用前 | blue | - |
| 利用中 | 利用中 | green | - |
| 利用終了 | 利用終了 | gray | - |

### 鍵状態

| State | Label | Color | Actions |
|-------|-------|:-----:|---------|
| 貸出中 | 貸出中 | orange | - |
| 返却済 | 返却済 | green | - |

## NFR Design Decisions

| NFR | Decision |
|-----|----------|
| 可用性 (24h近い運用) | エラー状態・ローディング状態を全画面に実装。Skeleton UIで体感速度改善 |
| 性能 (同時100ユーザー) | ページネーション実装。仮想スクロールは不要 |
| セキュリティ (RBAC) | ポータル別ナビゲーション。data-portal属性でテーマ切替 |
| セキュリティ (MFA) | IdPマネージドUIを活用。カスタムログイン画面 |
| モバイル対応 (NFR F.1.1.3) | Userポータルをモバイルファースト設計。レスポンシブ対応 |
