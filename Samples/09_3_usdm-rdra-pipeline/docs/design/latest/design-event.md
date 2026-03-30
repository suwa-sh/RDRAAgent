# Design System: RoomConnect

## Overview

| 項目 | 内容 |
|------|------|
| Event ID | 20260330_184257_design_system |
| Created At | 2026-03-30T18:42:57 |
| Source | 初期デザインシステム生成: 貸し会議室マッチングSaaS |
| Portals | 3 |
| Components | 16 |
| Screens | 33 |

## Brand

- **Name**: RoomConnect
- **Primary Color**: Blue 600 (#2563EB)
- **Secondary Color**: Teal 600 (#0D9488)
- **Sans Font**: Noto Sans JP, Inter, system-ui, sans-serif
- **Mono Font**: JetBrains Mono, Fira Code, monospace
- **Type Scale**: xs, sm, base, lg, xl, 2xl, 3xl
- **Tone**: 信頼性と親しみやすさを両立した丁寧な口調
- **Principles**: 明確で簡潔な日本語表現, 専門用語を避け、誰でも理解できる言葉を使う, 安心感を与える肯定的な表現
- **Logo Variants**:
  - full: `assets/logo-full.svg`
  - icon: `assets/logo-icon.svg`
  - stacked: `assets/logo-stacked.svg`

## Portals

| ID | Name | Actor | Primary Color | Screen Count |
|-----|------|-------|:-------------:|:------------:|
| user | 利用者ポータル | 利用者 | #2563EB | 9 |
| owner | オーナーポータル | 会議室オーナー | #0D9488 | 15 |
| admin | 管理者ポータル | サービス運営担当者 | #475569 | 9 |

## Design Tokens

### Primitive

- **Color Scales**: white, black, gray-50, gray-100, gray-200, gray-300, gray-400, gray-500, gray-600, gray-700, gray-800, gray-900, gray-950, blue-50, blue-100, blue-200, blue-500, blue-600, blue-700, teal-50, teal-100, teal-500, teal-600, teal-700, slate-500, slate-600, slate-700, green-50, green-500, green-600, amber-50, amber-500, amber-600, red-50, red-500, red-600, orange-50, orange-500, orange-600, violet-50, violet-500, violet-600 (42 scales)
- **Spacing Scale**: 0: 0px, 1: 4px, 2: 8px, 3: 12px, 4: 16px, 5: 20px, 6: 24px, 8: 32px, 10: 40px, 12: 48px, 16: 64px
- **Radius**: none, sm, md, lg, xl, full
- **Shadow**: sm, md, lg
- **Font Size**: xs, sm, base, lg, xl, 2xl, 3xl
- **Duration**: fast, normal, slow

### Semantic

- **background**: var(--color-white)
- **foreground**: var(--color-gray-900)
- **border**: var(--color-gray-200)
- **muted**: var(--color-gray-100)
- **muted_foreground**: var(--color-gray-500)
- **success**: var(--color-green-600)
- **success_light**: var(--color-green-50)
- **warning**: var(--color-amber-600)
- **warning_light**: var(--color-amber-50)
- **destructive**: var(--color-red-600)
- **destructive_light**: var(--color-red-50)
- **info**: var(--color-blue-600)
- **info_light**: var(--color-blue-50)
- **rating**: var(--color-amber-500)
- **virtual_accent**: var(--color-violet-600)

### Component

- **button**: height_sm, height_md, height_lg, padding_sm, padding_md, padding_lg, radius
- **input**: height, padding, radius, border
- **card**: bg, border, shadow, padding, radius
- **badge**: height, padding, radius, font_size
- **sidebar**: width, item_height
- **table**: header_bg, row_height, cell_padding

### Dark Mode Overrides

**Semantic overrides:**

- **background**: var(--color-gray-950)
- **foreground**: var(--color-gray-100)
- **border**: var(--color-gray-800)
- **muted**: var(--color-gray-900)
- **muted_foreground**: var(--color-gray-400)
- **success_light**: rgba(22, 163, 74, 0.15)
- **warning_light**: rgba(249, 115, 22, 0.15)
- **destructive_light**: rgba(220, 38, 38, 0.15)
- **info_light**: rgba(59, 130, 246, 0.15)

**Component overrides:**

- **card**: bg, border, shadow
- **table**: header_bg
- **sidebar**: bg

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
| RoomCard | 会議室情報をカード表示。画像・名前・広さ・価格・評価を表示 | 会議室検索画面 |
| SearchFilter | 会議室検索用フィルター。広さ・価格帯・機能性・評価で絞り込み | 会議室検索画面 |
| BookingCalendar | 予約日時選択カレンダー。利用開始/終了時刻を選択 | 予約申込画面, 予約変更画面 |
| StarRating | 星評価表示/入力。SVG ベースでインタラクティブ | 会議室評価画面, ホスト評価画面, 評価確認画面, 会議室検索画面 |
| PriceDisplay | 金額表示。通貨記号・桁区切り対応 | 会議室検索画面, 予約申込画面, 精算結果確認画面 |
| OwnerStatusBadge | オーナー申請状態を Badge で表示 | オーナー審査画面 |
| ReservationStatusBadge | 予約状態を Badge で表示 | 予約申込画面, 予約変更画面, 利用許諾画面 |
| InquiryStatusBadge | 問合せ状態を Badge で表示 | 問合せ送信画面, 問合せ回答画面 |
| InquiryThread | 問合せスレッド表示。送信/回答のメッセージ一覧 | 問合せ送信画面, 問合せ回答画面, サービス問合せ画面 |
| SettlementSummary | 精算サマリーカード。売上・手数料・支払額を表示 | 精算結果確認画面, 精算処理画面 |
| DashboardChart | ダッシュボード用チャート。利用状況・手数料分析 | 運用管理ダッシュボード, 手数料分析画面, 利用状況分析画面 |

## Screen Mapping

### 利用者ポータル (user)

| Name | Route | Components |
|------|-------|------------|
| 会議室検索画面 | /rooms | SearchFilter, RoomCard, StarRating, PriceDisplay |
| 予約申込画面 | /rooms/:id/book | BookingCalendar, PriceDisplay, ReservationStatusBadge |
| 予約変更画面 | /reservations/:id/edit | BookingCalendar, ReservationStatusBadge |
| 予約取消画面 | /reservations/:id/cancel | ReservationStatusBadge, Button |
| 鍵受取確認画面 | /reservations/:id/key | ReservationStatusBadge, Card |
| 問合せ送信画面 | /inquiries/new | InquiryThread, InquiryStatusBadge |
| 会議室評価画面 | /reservations/:id/review/room | StarRating, Input |
| ホスト評価画面 | /reservations/:id/review/host | StarRating, Input |
| サービス問合せ画面 | /support | InquiryThread, InquiryStatusBadge |

### オーナーポータル (owner)

| Name | Route | Components |
|------|-------|------------|
| 規約参照画面 | /owner/terms | Card |
| オーナー登録画面 | /owner/register | Input, Button |
| オーナー申請画面 | /owner/apply | OwnerStatusBadge, Button |
| 会議室登録画面 | /owner/rooms/new | Input, Button |
| 運用ルール設定画面 | /owner/rooms/:id/rules | Input, Button |
| 評価確認画面 | /owner/rooms/:id/reviews | StarRating, Card |
| プロフィール編集画面 | /owner/profile | Input, Button |
| 利用許諾画面 | /owner/reservations/:id/approve | ReservationStatusBadge, Button |
| 鍵貸出画面 | /owner/reservations/:id/key/lend | ReservationStatusBadge, Button |
| 鍵返却画面 | /owner/reservations/:id/key/return | ReservationStatusBadge, Button |
| 利用者評価画面 | /owner/reservations/:id/review | StarRating, Input |
| 問合せ回答画面 | /owner/inquiries/:id | InquiryThread, InquiryStatusBadge |
| 退会申請画面 | /owner/withdraw | Button, Card |
| 精算結果確認画面 | /owner/settlements | SettlementSummary, PriceDisplay |
| 評価結果一覧画面 | /owner/reviews | StarRating, Card |

### 管理者ポータル (admin)

| Name | Route | Components |
|------|-------|------------|
| オーナー審査画面 | /admin/owners/:id/review | OwnerStatusBadge, Button, Card |
| 退会処理画面 | /admin/owners/:id/withdraw | OwnerStatusBadge, Button |
| 手数料分析画面 | /admin/analytics/commission | DashboardChart, PriceDisplay |
| 運用管理ダッシュボード | /admin/dashboard | DashboardChart, Card |
| 利用履歴管理画面 | /admin/usage/history | Card, Badge |
| 利用状況分析画面 | /admin/analytics/usage | DashboardChart, Card |
| サービス問合せ回答画面 | /admin/inquiries/:id | InquiryThread, InquiryStatusBadge |
| 精算処理画面 | /admin/settlements/process | SettlementSummary, PriceDisplay |
| 精算実行画面 | /admin/settlements/execute | SettlementSummary, Button |

## State Mapping

### オーナー申請状態

| State | Label | Color | Actions |
|-------|-------|:-----:|---------|
| 未申請 | 未申請 | gray | - |
| 申請中 | 申請中 | blue | - |
| 審査中 | 審査中 | amber | - |
| 承認 | 承認 | green | - |
| 却下 | 却下 | red | - |
| 退会 | 退会 | gray | - |

### 予約状態

| State | Label | Color | Actions |
|-------|-------|:-----:|---------|
| 仮予約 | 仮予約 | amber | - |
| 確定 | 確定 | green | - |
| 変更 | 変更中 | blue | - |
| 利用中 | 利用中 | violet | - |
| 利用完了 | 利用完了 | green | - |
| 取消 | 取消 | red | - |

### 問合せ状態

| State | Label | Color | Actions |
|-------|-------|:-----:|---------|
| 受付 | 受付 | blue | - |
| 対応中 | 対応中 | amber | - |
| 回答済 | 回答済 | green | - |
| 完了 | 完了 | gray | - |

## NFR Design Decisions

| NFR | Decision |
|-----|----------|
| 可用性 A.1.1.1 (Lv3: 24h運用) | 全画面にエラー状態・ローディング状態・リトライUIを実装 |
| 性能 B.1.1.1 (Lv3: 同時1万) | 一覧画面にページネーション実装。仮想スクロールは不要（1ページ20件） |
| 性能 B.2.1.1 (Lv3: 5秒以内) | Skeleton UI でパーシーブドパフォーマンス改善。SSR 対応画面は初回表示を高速化 |
| セキュリティ E.5.2.1 (Lv2: RBAC) | ポータル別ナビゲーション。data-portal 属性でテーマ切替 |
| 運用 F.1.1.2 (Lv3: モバイル対応) | User ポータルをモバイルファースト設計。レスポンシブブレークポイント: 640/768/1024/1280px |
