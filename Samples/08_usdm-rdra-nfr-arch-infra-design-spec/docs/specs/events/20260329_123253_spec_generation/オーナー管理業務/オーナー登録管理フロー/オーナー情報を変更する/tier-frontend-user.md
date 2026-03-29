# オーナー情報を変更する - 利用者・オーナー向けフロントエンド仕様

## 変更概要

オーナー情報編集画面を新規作成する。ログイン済みオーナーが自身の登録情報（氏名・連絡先・メールアドレス）を編集して保存できる画面。

## 画面仕様

### オーナー情報編集画面

- **URL**: `/owner/profile/edit`
- **アクセス権**: ログイン済み会議室オーナー
- **ポータル**: owner

#### 表示要素とコンポーネントマッピング

| 要素 | 種別 | デザインシステムコンポーネント | 説明 |
|------|------|------------------------------|------|
| 現在の登録情報表示 | カード | Card (variant: default) | 氏名・連絡先・メールアドレスの現在値を表示 |
| 氏名入力フィールド | フォーム | Input (variant: default) | 現在値をプリフィル。最大50文字 |
| 連絡先入力フィールド | フォーム | Input (variant: default) | 現在値をプリフィル。電話番号形式 |
| メールアドレス入力フィールド | フォーム | Input (variant: default) | 現在値をプリフィル。メール形式バリデーション |
| 保存ボタン | ボタン | Button (variant: default, size: md) | 変更がある場合のみ活性化 |
| キャンセルボタン | ボタン | Button (variant: outline, size: md) | 変更を破棄して前の画面に戻る |
| 保存完了バナー | テキスト | Badge (variant: success) | 保存成功後に上部に表示 |

#### デザイントークン参照

| 用途 | トークン | 値 |
|------|---------|---|
| 背景色 | var(--semantic-background) | #FFFFFF |
| アクセント | var(--portal-primary) | #0D9488 (Teal 600) |
| 成功色 | var(--semantic-success) | #16A34A |
| エラー色 | var(--semantic-destructive) | #DC2626 |

#### UIロジック

- **状態管理**: フォーム初期値（現在の登録情報）、変更値、ダーティフラグ（変更検知）、保存中フラグ
- **バリデーション**: メールアドレスはRFC 5322形式チェック。連絡先は電話番号形式。変更がない場合は保存ボタンをdisabled
- **ローディング**: 初期表示時にSkeletonで現在値をローディング表示。保存中はボタンにスピナー
- **エラーハンドリング**: 409（重複メール）は「このメールアドレスは既に使用されています」をフィールド下に表示

#### 操作フロー

1. `/owner/profile/edit` を開く（現在の登録情報をプリフィル）
2. 変更したいフィールドを編集する
3. フィールド変更を検知し保存ボタンが活性化される
4. 保存ボタンをクリックする
5. ローディングスピナーが表示される
6. 成功時: 成功バナー（Badge: success）が表示される
7. キャンセルボタンで変更を破棄して前の画面に戻る

## コンポーネント設計

### OwnerProfileEditForm

- **ベースコンポーネント**: Input, Button, Card, Badge
- **Props**:
  | Prop | 型 | 必須 | 説明 |
  |------|---|------|------|
  | initialValues | OwnerProfile | Yes | 現在の登録情報 |
  | onSave | (values: OwnerProfile) => Promise\<void\> | Yes | 保存処理 |
  | onCancel | () => void | Yes | キャンセル処理 |
- **状態**:
  - `formValues`: OwnerProfile
  - `isDirty`: boolean（変更検知）
  - `isSaving`: boolean
  - `errors`: Record\<string, string\>
- **イベント**: `onFieldChange`, `onSubmit`, `onCancel`

## ティア完了条件（BDD）

```gherkin
Feature: オーナー情報を変更する - フロントエンド

  Scenario: 現在の登録情報がプリフィルされる
    Given ログイン済みオーナー「田中一郎」がオーナー情報編集画面を開いた
    When 画面が表示される
    Then 氏名フィールドに「田中一郎」、連絡先に「090-1234-5678」が入力済みで表示される

  Scenario: 変更がある場合のみ保存ボタンが活性化される
    Given オーナー「田中一郎」がオーナー情報編集画面を開き、フォームに変更がない状態
    When 連絡先を「090-9999-8888」に変更する
    Then 保存ボタンが活性化（disabled属性なし）になる

  Scenario: 保存成功後に成功バナーが表示される
    Given オーナー「田中一郎」が連絡先を変更して保存ボタンをクリックした
    When APIから200レスポンスが返る
    Then 「情報を更新しました」のバナー（Badge: success）が画面上部に表示される
```

---

## 共通コンポーネント参照

以下の共通コンポーネント（`@/components/common/` 配下）を使用する。
詳細な設計は `_cross-cutting/ux-ui/common-components.md` を参照。

| 共通コンポーネント | インポートパス | 用途 | Props マッピング |
|------------------|--------------|------|----------------|
| `EntityEditForm` | `@/components/common/EntityEditForm` | フォーム全体（オーナープロフィール編集） | `initialValues: OwnerProfileValues, onSave: async(values) => PUT /owner/profile, onCancel: () => router.back()` |
| `LoadingSkeleton` | `@/components/common/LoadingSkeleton` | フォーム初期読み込み（プリフィル待ち） | `variant: "FormSkeleton"` |
| `ErrorBanner` | `@/components/common/ErrorBanner` | API エラー表示 | `status: 400/403/5xx, message: エラーメッセージ` |
