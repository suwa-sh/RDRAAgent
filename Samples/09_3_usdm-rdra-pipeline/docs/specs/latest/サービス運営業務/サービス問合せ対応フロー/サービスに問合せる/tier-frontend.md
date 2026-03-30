# サービスに問合せる - フロントエンド仕様

## 変更概要

サービス問合せ画面を実装し、利用者がサービス運営への問合せを送信するための画面を提供する。

## 画面仕様

### サービス問合せ画面

- **URL**: /support
- **アクセス権**: 利用者
- **ポータル**: user

#### 表示要素とコンポーネントマッピング

| 要素 | 種別 | デザインシステムコンポーネント | 説明 |
|------|------|------------------------------|------|
| InquiryThread | コンポーネント | InquiryThread | design-event.yaml定義済み |
| InquiryStatusBadge | コンポーネント | InquiryStatusBadge | design-event.yaml定義済み |

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

1. 利用者がサービス問合せ画面にアクセスする
2. InquiryThreadが表示される
3. サービス運営への問合せを送信する
4. 操作完了のフィードバックが表示される

## コンポーネント設計

### InquiryThread

- **ベースコンポーネント**: InquiryThread
- **Props**:
  | Prop | 型 | 必須 | 説明 |
  |------|---|------|------|
  | data | object | Yes | 表示データ |
- **状態**: ローディング、エラー、成功
- **イベント**: onChange, onSubmit

### InquiryStatusBadge

- **ベースコンポーネント**: InquiryStatusBadge
- **Props**:
  | Prop | 型 | 必須 | 説明 |
  |------|---|------|------|
  | data | object | Yes | 表示データ |
- **状態**: ローディング、エラー、成功
- **イベント**: onChange, onSubmit


## ティア完了条件（BDD）

```gherkin
Feature: サービスに問合せる - フロントエンド

  Scenario: サービス問合せ画面の表示
    Given 利用者「田中太郎」がログイン済みである
    When サービス問合せ画面にアクセスする
    Then InquiryThreadが表示される

  Scenario: ローディング表示
    Given 利用者がログイン済みである
    When サービス問合せ画面のデータ取得中である
    Then Skeleton UIが表示される
```
