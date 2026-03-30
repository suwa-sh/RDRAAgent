# 利用許諾を判定する - フロントエンド仕様

## 変更概要

利用許諾画面を実装し、会議室オーナーが利用者の過去評価を確認し使用許諾するための画面を提供する。

## 画面仕様

### 利用許諾画面

- **URL**: /owner/reservations/:id/approve
- **アクセス権**: 会議室オーナー
- **ポータル**: owner

#### 表示要素とコンポーネントマッピング

| 要素 | 種別 | デザインシステムコンポーネント | 説明 |
|------|------|------------------------------|------|
| ReservationStatusBadge | コンポーネント | ReservationStatusBadge | design-event.yaml定義済み |
| Button | コンポーネント | Button | design-event.yaml定義済み |

#### デザイントークン参照

| 用途 | トークン | 値 |
|------|---------|---|
| 背景色 | var(--semantic-background) | #FFFFFF |
| アクセント | var(--portal-primary) | #0D9488 |
| ボーダー | var(--semantic-border) | var(--color-gray-200) |

#### UIロジック

- **状態管理**: React Server Components + クライアント状態管理
- **バリデーション**: フロントエンドバリデーション（必須チェック、形式チェック）
- **ローディング**: Skeleton UIでパーシーブドパフォーマンス改善
- **エラーハンドリング**: ErrorBannerコンポーネントでエラーメッセージ表示、リトライボタン付き

#### 操作フロー

1. 会議室オーナーが利用許諾画面にアクセスする
2. ReservationStatusBadgeが表示される
3. 利用者の過去評価を確認し使用許諾する
4. 操作完了のフィードバックが表示される

## コンポーネント設計

### ReservationStatusBadge

- **ベースコンポーネント**: ReservationStatusBadge
- **Props**:
  | Prop | 型 | 必須 | 説明 |
  |------|---|------|------|
  | data | object | Yes | 表示データ |
- **状態**: ローディング、エラー、成功
- **イベント**: onChange, onSubmit

### Button

- **ベースコンポーネント**: Button
- **Props**:
  | Prop | 型 | 必須 | 説明 |
  |------|---|------|------|
  | data | object | Yes | 表示データ |
- **状態**: ローディング、エラー、成功
- **イベント**: onChange, onSubmit


## ティア完了条件（BDD）

```gherkin
Feature: 利用許諾を判定する - フロントエンド

  Scenario: 利用許諾画面の表示
    Given 会議室オーナー「鈴木一郎」がログイン済みである
    When 利用許諾画面にアクセスする
    Then ReservationStatusBadgeが表示される

  Scenario: ローディング表示
    Given 会議室オーナーがログイン済みである
    When 利用許諾画面のデータ取得中である
    Then Skeleton UIが表示される
```
