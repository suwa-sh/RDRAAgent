# 会議室を予約する - フロントエンド仕様

## 変更概要

予約申込画面を実装し、利用者が会議室の予約と決済方法の設定を行うための画面を提供する。

## 画面仕様

### 予約申込画面

- **URL**: /rooms/:id/book
- **アクセス権**: 利用者
- **ポータル**: user

#### 表示要素とコンポーネントマッピング

| 要素 | 種別 | デザインシステムコンポーネント | 説明 |
|------|------|------------------------------|------|
| BookingCalendar | コンポーネント | BookingCalendar | design-event.yaml定義済み |
| PriceDisplay | コンポーネント | PriceDisplay | design-event.yaml定義済み |
| ReservationStatusBadge | コンポーネント | ReservationStatusBadge | design-event.yaml定義済み |

#### デザイントークン参照

| 用途 | トークン | 値 |
|------|---------|---|
| 背景色 | var(--semantic-background) | #FFFFFF |
| アクセント | var(--portal-primary) | #2563EB |
| ボーダー | var(--semantic-border) | var(--color-gray-200) |

#### UIロジック

- **状態管理**: React Server Components + クライアント状態管理
- **バリデーション**: フロントエンドバリデーション（必須チェック、形式チェック）
- **ローディング**: Skeleton UIでパーシーブドパフォーマンス改善
- **エラーハンドリング**: ErrorBannerコンポーネントでエラーメッセージ表示、リトライボタン付き

#### 操作フロー

1. 利用者が予約申込画面にアクセスする
2. BookingCalendarが表示される
3. 会議室の予約と決済方法の設定を行う
4. 操作完了のフィードバックが表示される

## コンポーネント設計

### BookingCalendar

- **ベースコンポーネント**: BookingCalendar
- **Props**:
  | Prop | 型 | 必須 | 説明 |
  |------|---|------|------|
  | data | object | Yes | 表示データ |
- **状態**: ローディング、エラー、成功
- **イベント**: onChange, onSubmit

### PriceDisplay

- **ベースコンポーネント**: PriceDisplay
- **Props**:
  | Prop | 型 | 必須 | 説明 |
  |------|---|------|------|
  | data | object | Yes | 表示データ |
- **状態**: ローディング、エラー、成功
- **イベント**: onChange, onSubmit

### ReservationStatusBadge

- **ベースコンポーネント**: ReservationStatusBadge
- **Props**:
  | Prop | 型 | 必須 | 説明 |
  |------|---|------|------|
  | data | object | Yes | 表示データ |
- **状態**: ローディング、エラー、成功
- **イベント**: onChange, onSubmit


## ティア完了条件（BDD）

```gherkin
Feature: 会議室を予約する - フロントエンド

  Scenario: 予約申込画面の表示
    Given 利用者「田中太郎」がログイン済みである
    When 予約申込画面にアクセスする
    Then BookingCalendarが表示される

  Scenario: ローディング表示
    Given 利用者がログイン済みである
    When 予約申込画面のデータ取得中である
    Then Skeleton UIが表示される
```
