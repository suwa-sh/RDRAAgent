# 精算内容を確認する - フロントエンド仕様

## 変更概要

精算確認画面を実装し、会議室オーナーが精算内容を確認する操作を行えるようにする。

## 画面仕様

### 精算確認画面

- **URL**: /settlements
- **アクセス権**: 会議室オーナー
- **ポータル**: owner

#### 表示要素とコンポーネントマッピング

| 要素 | 種別 | デザインシステムコンポーネント | 説明 |
|------|------|------------------------------|------|
| PriceDisplay | UIコンポーネント | PriceDisplay | design-event.yaml 定義済み |
| StatusBadge | UIコンポーネント | StatusBadge | design-event.yaml 定義済み |
| Card | UIコンポーネント | Card | design-event.yaml 定義済み |

#### デザイントークン参照

| 用途 | トークン | 値 |
|------|---------|---|
| 背景色 | var(--semantic-background) | #FFFFFF |
| アクセント | var(--portal-primary) | #0D9488 |

#### UIロジック

- **状態管理**: 精算内容を確認するState で画面状態を管理
- **バリデーション**: 必須項目チェック、形式チェック（メール、電話番号等）
- **ローディング**: API呼び出し中はSkeleton UIを表示
- **エラーハンドリング**: APIエラー時はErrorBannerで通知

#### 操作フロー

1. 画面を表示する
2. 必要な情報を入力/確認する
3. アクションボタンをクリックする
4. 処理結果を確認する

## コンポーネント設計

### PriceDisplay

- **ベースコンポーネント**: PriceDisplay (design-event.yaml)
- **Props**: design-event.yaml の定義に従う
- **状態**: ローディング、エラー、成功
- **イベント**: onClick, onChange

### StatusBadge

- **ベースコンポーネント**: StatusBadge (design-event.yaml)
- **Props**: design-event.yaml の定義に従う
- **状態**: ローディング、エラー、成功
- **イベント**: onClick, onChange

### Card

- **ベースコンポーネント**: Card (design-event.yaml)
- **Props**: design-event.yaml の定義に従う
- **状態**: ローディング、エラー、成功
- **イベント**: onClick, onChange

## ティア完了条件（BDD）

```gherkin
Feature: 精算内容を確認する - フロントエンド

  Scenario: 精算確認画面が正常に表示される
    Given 会議室オーナーがログイン済みである
    When 精算確認画面にアクセスする
    Then 画面が正常に表示されコンポーネントが配置される
```
