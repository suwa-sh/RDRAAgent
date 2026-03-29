# Design System: RoomConnect

## Overview

| 項目 | 内容 |
|------|------|
| Event ID | 20260329_100000_design_system |
| Created At | 2026-03-29T10:00:00+09:00 |
| Source | 初期デザインシステム生成: 貸し会議室マッチングSaaS |
| Portals | 3 |
| Components | 14 |
| Screens | 43 |

## Brand

- **Name**: RoomConnect
- **Primary Color**: Blue 600 (#2563EB)
- **Secondary Color**: Teal 600 (#0D9488)
- **Sans Font**: Noto Sans JP, Inter, system-ui, sans-serif
- **Mono Font**: JetBrains Mono, Fira Code, monospace
- **Type Scale**: xs, sm, base, lg, xl, 2xl, 3xl
- **Tone**: professional-friendly
- **Principles**: 信頼性, 明快さ, 親しみやすさ
- **Logo Variants**:
  - full: `assets/logo-full.svg`
  - icon: `assets/logo-icon.svg`
  - stacked: `assets/logo-stacked.svg`

## Portals

| ID | Name | Actor | Primary Color | Screen Count |
|-----|------|-------|:-------------:|:------------:|
| user | 利用者 | 利用者 | #2563EB | 15 |
| owner | オーナー | 会議室オーナー | #0D9488 | 20 |
| admin | 管理者 | サービス運営担当者 | #334155 | 8 |

## Design Tokens

### Primitive

- **Color Scales**: gray, blue, teal, green, red, amber, orange, violet, white (9 scales)
- **Spacing Scale**: 1: 0.25rem, 2: 0.5rem, 3: 0.75rem, 4: 1rem, 5: 1.25rem, 6: 1.5rem, 8: 2rem, 12: 3rem, 16: 4rem
- **Radius**: sm, md, lg, xl, full
- **Shadow**: sm, md, lg, xl
- **Font Size**: xs, sm, base, lg, xl
- **Duration**: fast, normal, slow

### Semantic

- **background**: {primitive.colors.white}
- **foreground**: {primitive.colors.gray.900}
- **border**: {primitive.colors.gray.200}
- **success**: #16A34A
- **warning**: #F97316
- **destructive**: #DC2626
- **info**: #3B82F6
- **rating**: #FBBF24
- **virtual_accent**: #8B5CF6

### Component

- **button**: height_md, radius, font_size
- **card**: padding, radius, shadow
- **input**: height, radius
- **badge**: height, radius
- **room_card**: image_height, price_font_size
- **rating**: star_size
- **calendar**: cell_size
- **sidebar**: width
- **table**: row_height
- **modal**: width_md

### Dark Mode Overrides

**Semantic overrides:**

- **background**: {primitive.colors.gray.950}
- **foreground**: {primitive.colors.gray.50}
- **border**: {primitive.colors.gray.800}

**Component overrides:**

- **card**: bg

## Components

### UI Components

| Name | Variants | Sizes |
|------|----------|-------|
| Button | default, secondary, outline, ghost, destructive | sm, md, lg |
| Badge | default, success, warning, destructive, info, virtual, outline | - |
| Card | default, hoverable | - |
| Input | default, error, disabled | - |

### Domain Components

| Name | Description | Screens |
|------|-------------|---------|
| RoomCard | 会議室一覧カード（物理/バーチャル） | 会議室検索画面, 会議室詳細画面 |
| BookingCalendar | 予約カレンダー（空き状況表示・日時選択） | 予約申請画面, バーチャル会議室予約画面, 予約変更画面 |
| ReservationStatusBadge | 予約ステータスバッジ | 予約審査画面, 予約許諾画面 |
| StarRating | 星評価（表示・入力） | 会議室評価登録画面, 会議室評価一覧画面, 会議室詳細画面 |
| OwnerVerificationBadge | オーナー審査状態バッジ | オーナー審査画面, オーナー審査管理画面 |
| PriceDisplay | 料金表示（¥/時間） | 会議室検索画面, 会議室詳細画面, 予約申請画面 |
| KeyHandoverTracker | 鍵貸出・返却ステッパー | 鍵貸出記録画面, 鍵返却記録画面 |
| SettlementSummaryCard | 精算情報サマリーカード | 精算結果確認画面, 精算額計算画面 |
| InquiryThread | 問合せ会話スレッド | 問合せ送信画面, 問合せ回答画面, 問合せ対応画面 |
| SearchFilter | 会議室検索フィルター | 会議室検索画面 |

## Screen Mapping

### 利用者 (user)

| Name | Route | Components |
|------|-------|------------|
| 会議室検索画面 | /rooms | SearchFilter, RoomCard |
| 会議室詳細画面 | /rooms/:id | StarRating, BookingCalendar, PriceDisplay |
| 予約申請画面 | /rooms/:id/book | BookingCalendar, PriceDisplay |
| バーチャル会議室予約画面 | /rooms/:id/book | BookingCalendar |
| 予約変更画面 | /reservations/:id/edit | BookingCalendar |
| 予約取消画面 | /reservations/:id/cancel | PriceDisplay, Button |
| 会議室評価登録画面 | /reservations/:id/review | StarRating |
| 問合せ送信画面 | /inquiries/new | InquiryThread |
| 予約変更画面 | /reservations/:id/edit | BookingCalendar, ReservationStatusBadge, Button |
| 決済方法設定画面 | /payment/settings | Input, Button |
| バーチャル会議室予約画面 | /rooms/:id/book/virtual | BookingCalendar, Button |
| オーナー問合せ画面 | /inquiries/owner/new | InquiryThread, Input, Button |
| サービス問合せ画面 | /inquiries/service/new | InquiryThread, Input, Button |
| オーナー評価登録画面 | /reservations/:id/review/owner | StarRating, Input, Button |
| オーナー登録申請画面 | /owner/register | Input, Button |

### 管理者 (admin)

| Name | Route | Components |
|------|-------|------------|
| オーナー審査画面 | /admin/owners/:id/review | OwnerVerificationBadge |
| オーナー審査管理画面 | /admin/owners/reviews | OwnerVerificationBadge |
| 精算額計算画面 | /admin/settlements/calculate | SettlementSummaryCard |
| 問合せ対応画面 | /admin/inquiries/:id | InquiryThread |
| オーナー審査詳細画面 | /admin/owners/:id/review | OwnerVerificationBadge, Button |
| 利用履歴管理画面 | /admin/usage | Badge, Input, Button |
| 利用状況分析画面 | /admin/analytics | Card, Badge |
| 精算実行画面 | /admin/settlements/:id/execute | SettlementSummaryCard, Button |

### オーナー (owner)

| Name | Route | Components |
|------|-------|------------|
| 予約審査画面 | /owner/reservations/:id/review | ReservationStatusBadge, StarRating |
| 鍵貸出記録画面 | /owner/rentals/:id/key-out | KeyHandoverTracker |
| 鍵返却記録画面 | /owner/rentals/:id/key-return | KeyHandoverTracker |
| 精算結果確認画面 | /owner/settlements | SettlementSummaryCard |
| 問合せ回答画面 | /owner/inquiries/:id | InquiryThread |
| 会議室評価一覧画面 | /owner/rooms/:id/reviews | StarRating |
| 予約許諾画面 | /owner/reservations/:id/approve | ReservationStatusBadge, Button |
| 運用ルール設定画面 | /owner/rooms/:id/rules | Input, Button |
| キャンセルポリシー設定画面 | /owner/rooms/:id/cancel-policy | Input, PriceDisplay, Button |
| 会議室公開管理画面 | /owner/rooms/:id/publish | Badge, Button |
| 会議室情報編集画面 | /owner/rooms/:id/edit | Input, Button |
| バーチャル会議室登録画面 | /owner/rooms/new/virtual | Input, Button |
| 鍵返却記録画面 | /owner/rentals/:id/key-return | KeyHandoverTracker, Button |
| 利用者評価確認画面 | /owner/user-reviews/:id | StarRating, Card |
| 利用者評価登録画面 | /owner/user-reviews/new | StarRating, Input, Button |
| オーナー情報編集画面 | /owner/profile/edit | Input, Button |
| 退会申請画面 | /owner/withdraw | Button |
| 売上実績確認画面 | /owner/sales | PriceDisplay, Card |
| 利用回数確認画面 | /owner/usage | Card |
| 利用者評価一覧画面 | /owner/user-reviews | StarRating, Card |

## State Mapping

### オーナー

| State | Label | Color | Actions |
|-------|-------|:-----:|---------|
| 申請中 | 未審査 | amber | admin: 審査（承認/却下） |
| 承認済 | 認証済 | green | - |
| 却下 | 却下 | red | - |
| 退会 | 退会 | gray | - |

### 予約

| State | Label | Color | Actions |
|-------|-------|:-----:|---------|
| 申請中 | 申請中 | amber | user: 取消可, owner: 審査（承認/拒否） |
| 確定 | 確定 | green | user: 変更/取消可, owner: 鍵貸出 |
| 利用中 | 利用中 | blue | owner: 鍵返却 |
| 完了 | 完了 | gray | user: 評価登録, owner: 利用者評価 |
| 取消 | 取消 | red | - |
| 拒否 | 拒否 | red | - |

### 鍵

| State | Label | Color | Actions |
|-------|-------|:-----:|---------|
| 保管中 | 保管中 | gray | - |
| 貸出中 | 貸出中 | blue | - |
| 返却済 | 返却済 | green | - |

### 決済

| State | Label | Color | Actions |
|-------|-------|:-----:|---------|
| 未決済 | 未決済 | gray | - |
| 決済中 | 処理中 | amber | - |
| 決済完了 | 決済済 | green | - |
| 決済失敗 | 失敗 | red | - |

### 精算

| State | Label | Color | Actions |
|-------|-------|:-----:|---------|
| 計算中 | 計算中 | amber | - |
| 確定 | 確定 | blue | - |
| 支払済 | 支払済 | green | - |
| 支払失敗 | 失敗 | red | - |

## NFR Design Decisions

| NFR | Decision |
|-----|----------|
| 可用性 24h運用 | エラー/ローディング状態を全画面に定義 |
| 性能 ~10,000同時ユーザー | 検索結果にページネーション・仮想スクロール |
| 性能 p99 500ms | Skeleton UI でパーシーブドパフォーマンス改善 |
| セキュリティ RBAC 3ロール | ポータル別ナビゲーション・権限ベース表示切替 |
| セキュリティ PII | マスク表示、オートコンプリート制御 |
| 運用 モバイル対応 | 利用者ポータルはモバイルファースト設計 |
