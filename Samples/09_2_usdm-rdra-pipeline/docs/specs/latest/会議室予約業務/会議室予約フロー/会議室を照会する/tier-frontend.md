# 会議室を照会する - フロントエンド仕様

## 変更概要

会議室検索画面を実装し、利用者が会議室を照会する操作を行えるようにする。

## 画面仕様

### 会議室検索画面

- **URL**: /rooms/search
- **アクセス権**: 利用者
- **ポータル**: user

#### 表示要素とコンポーネントマッピング

| 要素 | 種別 | デザインシステムコンポーネント | 説明 |
|------|------|------------------------------|------|
| SearchFilter | UIコンポーネント | SearchFilter | design-event.yaml 定義済み |
| RoomCard | UIコンポーネント | RoomCard | design-event.yaml 定義済み |
| StarRating | UIコンポーネント | StarRating | design-event.yaml 定義済み |

#### デザイントークン参照

| 用途 | トークン | 値 |
|------|---------|---|
| 背景色 | var(--semantic-background) | #FFFFFF |
| アクセント | var(--portal-primary) | #2563EB |

#### UIロジック

- **状態管理**: 会議室を照会するState で画面状態を管理
- **バリデーション**: 必須項目チェック、形式チェック（メール、電話番号等）
- **ローディング**: API呼び出し中はSkeleton UIを表示
- **エラーハンドリング**: APIエラー時はErrorBannerで通知

#### 操作フロー

1. 画面を表示する
2. 必要な情報を入力/確認する
3. アクションボタンをクリックする
4. 処理結果を確認する

## コンポーネント設計

### SearchFilter

- **ベースコンポーネント**: SearchFilter (design-event.yaml)
- **Props**: design-event.yaml の定義に従う
- **状態**: ローディング、エラー、成功
- **イベント**: onClick, onChange

### RoomCard

- **ベースコンポーネント**: RoomCard (design-event.yaml)
- **Props**: design-event.yaml の定義に従う
- **状態**: ローディング、エラー、成功
- **イベント**: onClick, onChange

### StarRating

- **ベースコンポーネント**: StarRating (design-event.yaml)
- **Props**: design-event.yaml の定義に従う
- **状態**: ローディング、エラー、成功
- **イベント**: onClick, onChange

## ティア完了条件（BDD）

```gherkin
Feature: 会議室を照会する - フロントエンド

  Scenario: 会議室検索画面が正常に表示される
    Given 利用者がログイン済みである
    When 会議室検索画面にアクセスする
    Then 画面が正常に表示されコンポーネントが配置される
```
