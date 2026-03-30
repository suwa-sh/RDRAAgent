# サービス問合せに回答する - フロントエンド仕様

## 変更概要

サービス問合せ回答画面を実装し、サービス運営担当者が利用者からのサービス問合せに対応するための画面を提供する。

## 画面仕様

### サービス問合せ回答画面

- **URL**: /admin/inquiries/:id
- **アクセス権**: サービス運営担当者
- **ポータル**: admin

#### 表示要素とコンポーネントマッピング

| 要素 | 種別 | デザインシステムコンポーネント | 説明 |
|------|------|------------------------------|------|
| InquiryThread | コンポーネント | InquiryThread | design-event.yaml定義済み |
| InquiryStatusBadge | コンポーネント | InquiryStatusBadge | design-event.yaml定義済み |

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

1. サービス運営担当者がサービス問合せ回答画面にアクセスする
2. InquiryThreadが表示される
3. 利用者からのサービス問合せに対応する
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
Feature: サービス問合せに回答する - フロントエンド

  Scenario: サービス問合せ回答画面の表示
    Given サービス運営担当者「山田花子」がログイン済みである
    When サービス問合せ回答画面にアクセスする
    Then InquiryThreadが表示される

  Scenario: ローディング表示
    Given サービス運営担当者がログイン済みである
    When サービス問合せ回答画面のデータ取得中である
    Then Skeleton UIが表示される
```
