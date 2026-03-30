# オーナーに問合せる - フロントエンド仕様

## 変更概要

問合せ送信画面を実装し、利用者が会議室オーナーに質問を送信するための画面を提供する。

## 画面仕様

### 問合せ送信画面

- **URL**: /inquiries/new
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

1. 利用者が問合せ送信画面にアクセスする
2. InquiryThreadが表示される
3. 会議室オーナーに質問を送信する
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
Feature: オーナーに問合せる - フロントエンド

  Scenario: 問合せ送信画面の表示
    Given 利用者「田中太郎」がログイン済みである
    When 問合せ送信画面にアクセスする
    Then InquiryThreadが表示される

  Scenario: ローディング表示
    Given 利用者がログイン済みである
    When 問合せ送信画面のデータ取得中である
    Then Skeleton UIが表示される
```
