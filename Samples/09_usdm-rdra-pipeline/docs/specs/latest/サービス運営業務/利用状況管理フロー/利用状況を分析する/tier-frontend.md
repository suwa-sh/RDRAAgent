# 利用状況を分析する - フロントエンド仕様

## 変更概要

利用状況分析画面を実装し、サービス運営担当者が会議室の利用状況を統計的に分析するための画面を提供する。

## 画面仕様

### 利用状況分析画面

- **URL**: /admin/analytics/usage
- **アクセス権**: サービス運営担当者
- **ポータル**: admin

#### 表示要素とコンポーネントマッピング

| 要素 | 種別 | デザインシステムコンポーネント | 説明 |
|------|------|------------------------------|------|
| DashboardChart | コンポーネント | DashboardChart | design-event.yaml定義済み |
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

1. サービス運営担当者が利用状況分析画面にアクセスする
2. DashboardChartが表示される
3. 会議室の利用状況を統計的に分析する
4. 操作完了のフィードバックが表示される

## コンポーネント設計

### DashboardChart

- **ベースコンポーネント**: DashboardChart
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
Feature: 利用状況を分析する - フロントエンド

  Scenario: 利用状況分析画面の表示
    Given サービス運営担当者「山田花子」がログイン済みである
    When 利用状況分析画面にアクセスする
    Then DashboardChartが表示される

  Scenario: ローディング表示
    Given サービス運営担当者がログイン済みである
    When 利用状況分析画面のデータ取得中である
    Then Skeleton UIが表示される
```
