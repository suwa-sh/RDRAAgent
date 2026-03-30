# オーナー登録を審査する - フロントエンド仕様

## 変更概要

オーナー審査画面を実装し、サービス運営担当者がオーナー申請を審査し承認または却下するための画面を提供する。

## 画面仕様

### オーナー審査画面

- **URL**: /admin/owners/:id/review
- **アクセス権**: サービス運営担当者
- **ポータル**: admin

#### 表示要素とコンポーネントマッピング

| 要素 | 種別 | デザインシステムコンポーネント | 説明 |
|------|------|------------------------------|------|
| OwnerStatusBadge | コンポーネント | OwnerStatusBadge | design-event.yaml定義済み |
| Button | コンポーネント | Button | design-event.yaml定義済み |
| Card | コンポーネント | Card | design-event.yaml定義済み |

#### デザイントークン参照

| 用途 | トークン | 値 |
|------|---------|---|
| 背景色 | var(--semantic-background) | #FFFFFF |
| アクセント | var(--portal-primary) | #475569 |
| ボーダー | var(--semantic-border) | var(--color-gray-200) |

#### UIロジック

- **状態管理**: React Server Components + クライアント状態管理
- **バリデーション**: フロントエンドバリデーション（必須チェック、形式チェック）
- **ローディング**: Skeleton UIでパーシーブドパフォーマンス改善
- **エラーハンドリング**: ErrorBannerコンポーネントでエラーメッセージ表示、リトライボタン付き

#### 操作フロー

1. サービス運営担当者がオーナー審査画面にアクセスする
2. OwnerStatusBadgeが表示される
3. オーナー申請を審査し承認または却下する
4. 操作完了のフィードバックが表示される

## コンポーネント設計

### OwnerStatusBadge

- **ベースコンポーネント**: OwnerStatusBadge
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

### Card

- **ベースコンポーネント**: Card
- **Props**:
  | Prop | 型 | 必須 | 説明 |
  |------|---|------|------|
  | data | object | Yes | 表示データ |
- **状態**: ローディング、エラー、成功
- **イベント**: onChange, onSubmit


## ティア完了条件（BDD）

```gherkin
Feature: オーナー登録を審査する - フロントエンド

  Scenario: オーナー審査画面の表示
    Given サービス運営担当者「山田花子」がログイン済みである
    When オーナー審査画面にアクセスする
    Then OwnerStatusBadgeが表示される

  Scenario: ローディング表示
    Given サービス運営担当者がログイン済みである
    When オーナー審査画面のデータ取得中である
    Then Skeleton UIが表示される
```
