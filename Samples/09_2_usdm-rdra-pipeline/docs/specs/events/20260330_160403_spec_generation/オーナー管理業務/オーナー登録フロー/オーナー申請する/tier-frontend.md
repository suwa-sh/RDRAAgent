# オーナー申請する - フロントエンド仕様

## 変更概要

オーナー申請画面を実装し、会議室オーナーがオーナー申請する操作を行えるようにする。

## 画面仕様

### オーナー申請画面

- **URL**: /register/apply
- **アクセス権**: 会議室オーナー
- **ポータル**: owner

#### 表示要素とコンポーネントマッピング

| 要素 | 種別 | デザインシステムコンポーネント | 説明 |
|------|------|------------------------------|------|
| Input | UIコンポーネント | Input | design-event.yaml 定義済み |
| Button | UIコンポーネント | Button | design-event.yaml 定義済み |
| StepTracker | UIコンポーネント | StepTracker | design-event.yaml 定義済み |

#### デザイントークン参照

| 用途 | トークン | 値 |
|------|---------|---|
| 背景色 | var(--semantic-background) | #FFFFFF |
| アクセント | var(--portal-primary) | #0D9488 |

#### UIロジック

- **状態管理**: オーナー申請するState で画面状態を管理
- **バリデーション**: 必須項目チェック、形式チェック（メール、電話番号等）
- **ローディング**: API呼び出し中はSkeleton UIを表示
- **エラーハンドリング**: APIエラー時はErrorBannerで通知

#### 操作フロー

1. 画面を表示する
2. 必要な情報を入力/確認する
3. アクションボタンをクリックする
4. 処理結果を確認する

## コンポーネント設計

### Input

- **ベースコンポーネント**: Input (design-event.yaml)
- **Props**: design-event.yaml の定義に従う
- **状態**: ローディング、エラー、成功
- **イベント**: onClick, onChange

### Button

- **ベースコンポーネント**: Button (design-event.yaml)
- **Props**: design-event.yaml の定義に従う
- **状態**: ローディング、エラー、成功
- **イベント**: onClick, onChange

### StepTracker

- **ベースコンポーネント**: StepTracker (design-event.yaml)
- **Props**: design-event.yaml の定義に従う
- **状態**: ローディング、エラー、成功
- **イベント**: onClick, onChange

## ティア完了条件（BDD）

```gherkin
Feature: オーナー申請する - フロントエンド

  Scenario: オーナー申請画面が正常に表示される
    Given 会議室オーナーがログイン済みである
    When オーナー申請画面にアクセスする
    Then 画面が正常に表示されコンポーネントが配置される
```
