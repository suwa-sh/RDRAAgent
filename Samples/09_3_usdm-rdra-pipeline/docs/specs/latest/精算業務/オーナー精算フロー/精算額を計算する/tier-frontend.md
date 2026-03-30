# 精算額を計算する - フロントエンド仕様

## 変更概要

精算処理画面を実装し、サービス運営担当者が会議室別の利用履歴から精算額を算出するための画面を提供する。

## 画面仕様

### 精算処理画面

- **URL**: /admin/settlements/process
- **アクセス権**: サービス運営担当者
- **ポータル**: admin

#### 表示要素とコンポーネントマッピング

| 要素 | 種別 | デザインシステムコンポーネント | 説明 |
|------|------|------------------------------|------|
| SettlementSummary | コンポーネント | SettlementSummary | design-event.yaml定義済み |
| PriceDisplay | コンポーネント | PriceDisplay | design-event.yaml定義済み |

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

1. サービス運営担当者が精算処理画面にアクセスする
2. SettlementSummaryが表示される
3. 会議室別の利用履歴から精算額を算出する
4. 操作完了のフィードバックが表示される

## コンポーネント設計

### SettlementSummary

- **ベースコンポーネント**: SettlementSummary
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
Feature: 精算額を計算する - フロントエンド

  Scenario: 精算処理画面の表示
    Given サービス運営担当者「山田花子」がログイン済みである
    When 精算処理画面にアクセスする
    Then SettlementSummaryが表示される

  Scenario: ローディング表示
    Given サービス運営担当者がログイン済みである
    When 精算処理画面のデータ取得中である
    Then Skeleton UIが表示される
```
