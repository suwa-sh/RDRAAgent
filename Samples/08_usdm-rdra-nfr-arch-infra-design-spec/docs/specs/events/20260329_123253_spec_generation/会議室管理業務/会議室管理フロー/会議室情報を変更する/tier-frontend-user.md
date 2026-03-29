# 会議室情報を変更する - 利用者・オーナー向けフロントエンド仕様

## 変更概要

会議室情報編集画面を新規作成する。ログイン済みオーナーが既存会議室の情報を編集して保存できる画面。会議室登録画面と同様の会議室種別別フォームをプリフィル状態で提供する。

## 画面仕様

### 会議室情報編集画面

- **URL**: `/owner/rooms/:room_id/edit`
- **アクセス権**: ログイン済み会議室オーナー（対象会議室の所有者）
- **ポータル**: owner

#### 表示要素とコンポーネントマッピング

| 要素 | 種別 | デザインシステムコンポーネント | 説明 |
|------|------|------------------------------|------|
| 会議室名入力フィールド | フォーム | Input (variant: default) | 現在値をプリフィル。必須 |
| 所在地入力フィールド（物理のみ） | フォーム | Input (variant: default) | 現在値をプリフィル |
| 収容人数入力フィールド（物理のみ） | フォーム | Input (variant: default) | 現在値をプリフィル |
| 価格入力フィールド | フォーム | Input (variant: default) | 現在値をプリフィル |
| 価格プレビュー | テキスト | PriceDisplay | 入力した価格をリアルタイムフォーマット表示 |
| 会議ツール種別（バーチャルのみ） | フォーム | Input（セレクト） | 現在値をプリフィル |
| 同時接続数（バーチャルのみ） | フォーム | Input (variant: default) | 現在値をプリフィル |
| 録画可否（バーチャルのみ） | フォーム | Input（チェックボックス） | 現在値をプリフィル |
| 設備・機能選択 | フォーム | Input（チェックボックス群） | 現在値をプリフィル |
| 保存ボタン | ボタン | Button (variant: default, size: md) | 変更がある場合のみ活性化 |
| キャンセルボタン | ボタン | Button (variant: outline, size: md) | 変更を破棄して戻る |
| 保存完了バナー | テキスト | Badge (variant: success) | 保存成功後に表示 |

#### デザイントークン参照

| 用途 | トークン | 値 |
|------|---------|---|
| 背景色 | var(--semantic-background) | #FFFFFF |
| アクセント | var(--portal-primary) | #0D9488 (Teal 600) |
| 成功色 | var(--semantic-success) | #16A34A |

#### UIロジック

- **状態管理**: 初期値（現在の会議室情報）、変更値、ダーティフラグ、保存中フラグ
- **バリデーション**: 会議室名・価格は必須。会議室種別に応じたフィールドの必須チェック
- **ローディング**: 初期表示時にSkeleton。保存中はスピナー
- **エラーハンドリング**: 403は「この操作を行う権限がありません」バナーを表示

#### 操作フロー

1. `/owner/rooms/:room_id/edit` を開く（現在の会議室情報をプリフィル）
2. 変更したいフィールドを編集する
3. 変更を検知して保存ボタンが活性化される
4. 保存ボタンをクリックする
5. 成功時: 成功バナー（Badge: success）が表示される
6. キャンセルボタンで変更を破棄して前の画面に戻る

## コンポーネント設計

### RoomEditForm

- **ベースコンポーネント**: Input, Button, PriceDisplay, Badge
- **Props**:
  | Prop | 型 | 必須 | 説明 |
  |------|---|------|------|
  | roomId | string | Yes | 対象会議室ID |
  | initialValues | RoomData | Yes | 現在の会議室情報 |
  | onSave | (values: RoomData) => Promise\<void\> | Yes | 保存処理 |
  | onCancel | () => void | Yes | キャンセル処理 |
- **状態**:
  - `formValues`: RoomData
  - `isDirty`: boolean
  - `isSaving`: boolean
  - `errors`: Record\<string, string\>
- **イベント**: `onFieldChange`, `onSubmit`, `onCancel`

## ティア完了条件（BDD）

```gherkin
Feature: 会議室情報を変更する - フロントエンド

  Scenario: 現在の会議室情報がプリフィルされる
    Given オーナー「田中一郎」が会議室「渋谷会議室A」（物理、収容人数10名）の編集画面を開いた
    When 画面が表示される
    Then 収容人数フィールドに「10」がプリフィルされている

  Scenario: 変更後に保存ボタンが活性化される
    Given オーナー「田中一郎」が会議室情報編集画面を開き変更がない状態
    When 収容人数を「15」に変更する
    Then 保存ボタンが活性化（disabled属性なし）になる

  Scenario: 保存成功後に成功バナーが表示される
    Given オーナー「田中一郎」が収容人数を変更して保存ボタンをクリックした
    When APIから200が返る
    Then 「会議室情報を更新しました」のバナー（Badge: success）が表示される
```

---

## 共通コンポーネント参照

以下の共通コンポーネント（`@/components/common/` 配下）を使用する。
詳細な設計は `_cross-cutting/ux-ui/common-components.md` を参照。

| 共通コンポーネント | インポートパス | 用途 | Props マッピング |
|------------------|--------------|------|----------------|
| `EntityEditForm` | `@/components/common/EntityEditForm` | フォーム全体（会議室情報編集） | `initialValues: RoomEditValues, onSave: async(values) => PUT /owner/rooms/:id, onCancel: () => router.back()` |
| `LoadingSkeleton` | `@/components/common/LoadingSkeleton` | フォーム初期読み込み（プリフィル待ち） | `variant: "FormSkeleton"` |
| `ErrorBanner` | `@/components/common/ErrorBanner` | API エラー表示 | `status: 400/403/5xx, message: エラーメッセージ` |
