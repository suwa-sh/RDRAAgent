# オーナーを登録する - フロントエンド仕様

## 変更概要

オーナー登録画面を実装し、会議室オーナーがプロフィール情報を入力し登録できるようにする。

## 画面仕様

### オーナー登録画面

- **URL**: /register
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

- **状態管理**: OwnerRegistrationState で画面状態を管理
- **バリデーション**: 氏名必須、メールアドレス形式、電話番号形式
- **ローディング**: API呼び出し中はSkeleton UIを表示
- **エラーハンドリング**: APIエラー時はErrorBannerで通知

#### 操作フロー

1. オーナー登録画面を表示する
2. 氏名、メールアドレス、電話番号、プロフィールを入力する
3. 「登録する」ボタンをクリックする
4. 登録完了メッセージを確認する

## コンポーネント設計

### Input

- **ベースコンポーネント**: Input (design-event.yaml)
- **Props**: design-event.yaml の定義に従う
- **状態**: ローディング、エラー、成功
- **イベント**: onChange

### Button

- **ベースコンポーネント**: Button (design-event.yaml)
- **Props**: design-event.yaml の定義に従う
- **状態**: 通常、ローディング、無効
- **イベント**: onClick

### StepTracker

- **ベースコンポーネント**: StepTracker (design-event.yaml)
- **Props**: steps=["プロフィール入力","規約確認","申請"], currentStep=0
- **状態**: 各ステップの完了状態
- **イベント**: なし

## ティア完了条件（BDD）

```gherkin
Feature: オーナーを登録する - フロントエンド

  Scenario: オーナー登録画面が正常に表示される
    Given 会議室オーナーがログイン済みである
    When オーナー登録画面にアクセスする
    Then 画面が正常に表示されコンポーネントが配置される
```
