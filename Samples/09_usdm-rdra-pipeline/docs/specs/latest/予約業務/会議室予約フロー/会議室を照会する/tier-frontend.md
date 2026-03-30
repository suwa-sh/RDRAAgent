# 会議室を照会する - フロントエンド仕様

## 変更概要

会議室検索画面を実装し、利用者が広さ・価格・機能性・評価で会議室を検索するための画面を提供する。

## 画面仕様

### 会議室検索画面

- **URL**: /rooms
- **アクセス権**: 利用者
- **ポータル**: user

#### 表示要素とコンポーネントマッピング

| 要素 | 種別 | デザインシステムコンポーネント | 説明 |
|------|------|------------------------------|------|
| SearchFilter | コンポーネント | SearchFilter | design-event.yaml定義済み |
| RoomCard | コンポーネント | RoomCard | design-event.yaml定義済み |
| StarRating | コンポーネント | StarRating | design-event.yaml定義済み |
| PriceDisplay | コンポーネント | PriceDisplay | design-event.yaml定義済み |

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

1. 利用者が会議室検索画面にアクセスする
2. SearchFilterが表示される
3. 広さ・価格・機能性・評価で会議室を検索する
4. 操作完了のフィードバックが表示される

## コンポーネント設計

### SearchFilter

- **ベースコンポーネント**: SearchFilter
- **Props**:
  | Prop | 型 | 必須 | 説明 |
  |------|---|------|------|
  | data | object | Yes | 表示データ |
- **状態**: ローディング、エラー、成功
- **イベント**: onChange, onSubmit

### RoomCard

- **ベースコンポーネント**: RoomCard
- **Props**:
  | Prop | 型 | 必須 | 説明 |
  |------|---|------|------|
  | data | object | Yes | 表示データ |
- **状態**: ローディング、エラー、成功
- **イベント**: onChange, onSubmit

### StarRating

- **ベースコンポーネント**: StarRating
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


## ティア完了条件（BDD）

```gherkin
Feature: 会議室を照会する - フロントエンド

  Scenario: 会議室検索画面の表示
    Given 利用者「田中太郎」がログイン済みである
    When 会議室検索画面にアクセスする
    Then SearchFilterが表示される

  Scenario: ローディング表示
    Given 利用者がログイン済みである
    When 会議室検索画面のデータ取得中である
    Then Skeleton UIが表示される
```
