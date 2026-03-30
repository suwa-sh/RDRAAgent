# 精算結果を確認する - フロントエンド仕様

## 変更概要

精算結果確認画面を実装し、会議室オーナーが精算額と支払い状況を確認するための画面を提供する。

## 画面仕様

### 精算結果確認画面

- **URL**: /owner/settlements
- **アクセス権**: 会議室オーナー
- **ポータル**: owner

#### 表示要素とコンポーネントマッピング

| 要素 | 種別 | デザインシステムコンポーネント | 説明 |
|------|------|------------------------------|------|
| SettlementSummary | コンポーネント | SettlementSummary | design-event.yaml定義済み |
| PriceDisplay | コンポーネント | PriceDisplay | design-event.yaml定義済み |

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

1. 会議室オーナーが精算結果確認画面にアクセスする
2. SettlementSummaryが表示される
3. 精算額と支払い状況を確認する
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
Feature: 精算結果を確認する - フロントエンド

  Scenario: 精算結果確認画面の表示
    Given 会議室オーナー「鈴木一郎」がログイン済みである
    When 精算結果確認画面にアクセスする
    Then SettlementSummaryが表示される

  Scenario: ローディング表示
    Given 会議室オーナーがログイン済みである
    When 精算結果確認画面のデータ取得中である
    Then Skeleton UIが表示される
```
