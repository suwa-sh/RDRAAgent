# キャンセルポリシーを設定する - 利用者・オーナー向けフロントエンド仕様

## 変更概要

キャンセルポリシー設定画面を新規作成する。ログイン済みオーナーがキャンセル期限・キャンセル料率・返金ルールを設定する画面。

## 画面仕様

### キャンセルポリシー設定画面

- **URL**: `/owner/rooms/:room_id/cancel-policy`
- **アクセス権**: ログイン済み会議室オーナー（対象会議室の所有者）
- **ポータル**: owner

#### 表示要素とコンポーネントマッピング

| 要素 | 種別 | デザインシステムコンポーネント | 説明 |
|------|------|------------------------------|------|
| キャンセル期限入力 | フォーム | Input (variant: default) | 必須。利用日何日前まで無料キャンセル可能か（数値） |
| キャンセル料率入力 | フォーム | Input (variant: default) | 必須。0〜100の数値（%）。期限超過後の料率 |
| 返金ルール説明入力 | フォーム | Input (variant: default) | 返金条件の説明テキスト |
| 設定ボタン | ボタン | Button (variant: default, size: md) | 必須項目入力後に活性化 |
| 設定完了メッセージ | テキスト | Badge (variant: success) | 保存成功時に表示 |
| 公開可能通知 | テキスト | Badge (variant: info) | 運用ルールも設定済みで公開可能になった場合に表示 |

#### デザイントークン参照

| 用途 | トークン | 値 |
|------|---------|---|
| 背景色 | var(--semantic-background) | #FFFFFF |
| アクセント | var(--portal-primary) | #0D9488 (Teal 600) |
| 成功色 | var(--semantic-success) | #16A34A |
| 情報色 | var(--semantic-info) | #3B82F6 |

#### UIロジック

- **状態管理**: フォーム値、バリデーション状態、保存中フラグ、既存設定値のプリフィル
- **バリデーション**: キャンセル期限・料率は必須。料率は0〜100の範囲チェック
- **ローディング**: 初期表示時にSkeleton。保存中はスピナー
- **エラーハンドリング**: 料率範囲外はフィールド下にエラー表示

#### 操作フロー

1. `/owner/rooms/:room_id/cancel-policy` を開く（既存値があればプリフィル）
2. キャンセル期限・料率・返金ルールを入力する
3. 設定ボタンをクリックする
4. 成功時: 成功バナーを表示。公開可能条件達成時は追加で公開可能通知を表示

## コンポーネント設計

### CancelPolicyForm

- **ベースコンポーネント**: Input, Button, Badge
- **Props**:
  | Prop | 型 | 必須 | 説明 |
  |------|---|------|------|
  | roomId | string | Yes | 対象会議室ID |
  | initialValues | CancelPolicy \| null | No | 既存設定値 |
  | onSave | (values: CancelPolicy) => Promise\<void\> | Yes | 保存処理 |
- **状態**:
  - `formValues`: CancelPolicy
  - `errors`: Record\<string, string\>
  - `isSaving`: boolean
- **イベント**: `onSubmit`

## ティア完了条件（BDD）

```gherkin
Feature: キャンセルポリシーを設定する - フロントエンド

  Scenario: キャンセル料率に101%を入力するとバリデーションエラーが表示される
    Given オーナー「田中一郎」がキャンセルポリシー設定画面を開いている
    When キャンセル料率フィールドに「120」を入力してフォーカスを外す
    Then 「キャンセル料率は0〜100%の範囲で入力してください」のエラーが表示される

  Scenario: 設定成功後に成功バナーが表示される
    Given オーナー「田中一郎」がキャンセルポリシーを有効な値で入力した
    When 設定ボタンをクリックしAPIから200が返る
    Then 「キャンセルポリシーを設定しました」のバナー（Badge: success）が表示される
```

---

## 共通コンポーネント参照

以下の共通コンポーネント（`@/components/common/` 配下）を使用する。
詳細な設計は `_cross-cutting/ux-ui/common-components.md` を参照。

| 共通コンポーネント | インポートパス | 用途 | Props マッピング |
|------------------|--------------|------|----------------|
| `EntityEditForm` | `@/components/common/EntityEditForm` | フォーム全体（キャンセルポリシー設定） | `initialValues: CancelPolicyValues, onSave: async(values) => PUT /owner/rooms/:id/cancel-policy, onCancel: () => router.back()` |
| `LoadingSkeleton` | `@/components/common/LoadingSkeleton` | フォーム初期読み込み（プリフィル待ち） | `variant: "FormSkeleton"` |
| `ErrorBanner` | `@/components/common/ErrorBanner` | API エラー表示 | `status: 400/403/5xx, message: エラーメッセージ` |
