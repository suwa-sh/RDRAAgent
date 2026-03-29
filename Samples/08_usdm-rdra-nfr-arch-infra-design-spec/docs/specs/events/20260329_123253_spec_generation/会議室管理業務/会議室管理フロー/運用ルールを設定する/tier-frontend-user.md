# 運用ルールを設定する - 利用者・オーナー向けフロントエンド仕様

## 変更概要

運用ルール設定画面を新規作成する。ログイン済みオーナーが会議室の利用可能時間帯・最低/最大利用時間・貸出可否を設定する画面。

## 画面仕様

### 運用ルール設定画面

- **URL**: `/owner/rooms/:room_id/operation-rules`
- **アクセス権**: ログイン済み会議室オーナー（対象会議室の所有者）
- **ポータル**: owner

#### 表示要素とコンポーネントマッピング

| 要素 | 種別 | デザインシステムコンポーネント | 説明 |
|------|------|------------------------------|------|
| 利用可能時間帯（開始時刻） | フォーム | Input（時刻選択） | 必須。HH:MM形式 |
| 利用可能時間帯（終了時刻） | フォーム | Input（時刻選択） | 必須。HH:MM形式 |
| 最低利用時間入力 | フォーム | Input (variant: default) | 必須。数値（時間） |
| 最大利用時間入力 | フォーム | Input (variant: default) | 必須。数値（時間） |
| 貸出可否選択 | フォーム | Input（ラジオボタン） | 「可」「不可」の選択 |
| 設定ボタン | ボタン | Button (variant: default, size: md) | 全必須項目入力後に活性化 |
| 設定完了メッセージ | テキスト | Badge (variant: success) | 保存成功時に表示 |
| 公開可能通知 | テキスト | Badge (variant: info) | キャンセルポリシーも設定済みで公開可能になった場合に表示 |

#### デザイントークン参照

| 用途 | トークン | 値 |
|------|---------|---|
| 背景色 | var(--semantic-background) | #FFFFFF |
| アクセント | var(--portal-primary) | #0D9488 (Teal 600) |
| 成功色 | var(--semantic-success) | #16A34A |
| 情報色 | var(--semantic-info) | #3B82F6 |

#### UIロジック

- **状態管理**: フォーム値、バリデーション状態、保存中フラグ、既存設定値のプリフィル
- **バリデーション**: 必須項目チェック。最低利用時間 ≤ 最大利用時間のクロスフィールドバリデーション。開始時刻 < 終了時刻チェック
- **ローディング**: 保存中はボタンにスピナー。初期表示時は既存設定値をプリフィル（Skeleton表示）
- **エラーハンドリング**: クロスフィールドバリデーションエラーはフォーム下部にまとめて表示

#### 操作フロー

1. `/owner/rooms/:room_id/operation-rules` を開く（既存値があればプリフィル）
2. 利用可能時間帯・最低/最大利用時間・貸出可否を入力する
3. 設定ボタンをクリックする
4. 成功時: 成功バナーを表示。公開可能条件達成時は追加で公開可能通知を表示
5. エラー時: エラーメッセージを表示する

## コンポーネント設計

### OperationRulesForm

- **ベースコンポーネント**: Input, Button, Badge
- **Props**:
  | Prop | 型 | 必須 | 説明 |
  |------|---|------|------|
  | roomId | string | Yes | 対象会議室ID |
  | initialValues | OperationRules \| null | No | 既存設定値（プリフィル用） |
  | onSave | (values: OperationRules) => Promise\<void\> | Yes | 保存処理 |
- **状態**:
  - `formValues`: OperationRules
  - `errors`: Record\<string, string\>
  - `isSaving`: boolean
- **イベント**: `onSubmit`

## ティア完了条件（BDD）

```gherkin
Feature: 運用ルールを設定する - フロントエンド

  Scenario: 既存の運用ルールがプリフィルされる
    Given 会議室「渋谷会議室A」に既存の運用ルール（開始9:00、終了21:00）が設定済みである
    When オーナー「田中一郎」が運用ルール設定画面を開く
    Then 開始時刻「9:00」、終了時刻「21:00」がフォームにプリフィルされている

  Scenario: 最低>最大の時間入力でクロスバリデーションエラーが表示される
    Given オーナー「田中一郎」が運用ルール設定画面を開いている
    When 最低利用時間「8」、最大利用時間「2」を入力する
    Then 「最低利用時間は最大利用時間以下に設定してください」のエラーが表示される

  Scenario: 設定成功後に成功バナーが表示される
    Given オーナー「田中一郎」が運用ルールを有効な値で入力した
    When 設定ボタンをクリックしAPIから200が返る
    Then 「運用ルールを設定しました」のバナー（Badge: success）が表示される
```

---

## 共通コンポーネント参照

以下の共通コンポーネント（`@/components/common/` 配下）を使用する。
詳細な設計は `_cross-cutting/ux-ui/common-components.md` を参照。

| 共通コンポーネント | インポートパス | 用途 | Props マッピング |
|------------------|--------------|------|----------------|
| `EntityEditForm` | `@/components/common/EntityEditForm` | フォーム全体（運用ルール設定） | `initialValues: OperationRulesValues, onSave: async(values) => PUT /owner/rooms/:id/operation-rules, onCancel: () => router.back()` |
| `LoadingSkeleton` | `@/components/common/LoadingSkeleton` | フォーム初期読み込み（プリフィル待ち） | `variant: "FormSkeleton"` |
| `ErrorBanner` | `@/components/common/ErrorBanner` | API エラー表示 | `status: 400/403/5xx, message: エラーメッセージ` |
