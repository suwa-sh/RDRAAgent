# 予約を取り消す - 利用者・オーナー向けフロントエンド仕様

## 変更概要

予約取消機能を実装する。取消前にキャンセル料を計算して表示し、利用者が内容を確認して取消を実行できる。

## 画面仕様

### 予約取消画面（モーダル）

- **URL**: `/reservations/{reservation_id}` （取消確認はモーダルで表示）
- **アクセス権**: 利用者（ログイン必須・予約所有者のみ）
- **ポータル**: user

#### 表示要素とコンポーネントマッピング

| 要素 | 種別 | デザインシステムコンポーネント | 説明 |
|------|------|------------------------------|------|
| 取消確認モーダル | モーダル | Card (variant=default, width=560px) | キャンセル料確認・操作 |
| 予約情報サマリー | テキスト | Card | 会議室名・利用日時・利用料金 |
| キャンセル料表示 | テキスト | PriceDisplay | キャンセル料（0円または発生額） |
| 「取消する」ボタン | ボタン | Button (variant=destructive) | 取消実行 |
| 「戻る」ボタン | ボタン | Button (variant=ghost) | モーダルを閉じる |
| キャンセルポリシー説明 | テキスト | - | 適用されるキャンセルポリシーの説明 |

#### デザイントークン参照

| 用途 | トークン | 値 |
|------|---------|---|
| 背景色 | var(--semantic-background) | #FFFFFF |
| 危険操作 | var(--semantic-destructive) | #DC2626 |
| 警告 | var(--semantic-warning) | #F97316 |

#### UIロジック

- **状態管理**: モーダル開閉状態・ローディング状態
- **バリデーション**: なし
- **キャンセル料プレビュー**: 取消ボタンクリック時に API に確認リクエストを送り、キャンセル料を表示
- **ローディング**: 取消実行中はボタンにスピナー表示・ボタン無効化
- **エラーハンドリング**: エラー時はモーダル内にエラーメッセージを表示

#### 操作フロー

1. 予約詳細画面/予約一覧から「取消する」ボタンをクリック
2. キャンセル料確認モーダルが表示される（キャンセル料計算結果を表示）
3. 内容を確認して「取消する」ボタンをクリック
4. 取消完了後、モーダルが閉じ「予約を取り消しました」通知が表示される

## コンポーネント設計

### CancellationConfirmModal

- **ベースコンポーネント**: Card, Button, PriceDisplay
- **Props**:
  | Prop | 型 | 必須 | 説明 |
  |------|---|------|------|
  | reservation | Reservation | Yes | 取消対象の予約情報 |
  | cancelFee | number | Yes | キャンセル料（円） |
  | onConfirm | () => Promise<void> | Yes | 取消実行コールバック |
  | onClose | () => void | Yes | モーダルクローズ |
  | isOpen | boolean | Yes | モーダル表示フラグ |
- **状態**: ローディング状態
- **イベント**: onConfirm、onClose

## ティア完了条件（BDD）

```gherkin
Feature: 予約を取り消す - 利用者向けフロントエンド

  Scenario: 「取消する」ボタンクリックでキャンセル料確認モーダルが表示される
    Given 利用者「田中太郎」が予約詳細画面（rsv-001）を開いている
    When 「取消する」ボタンをクリックする
    Then キャンセル料確認モーダルが表示され、適用されるキャンセル料と取消ボタンが表示される

  Scenario: キャンセル料が0円の場合に無料取消であることが表示される
    Given 利用者「田中太郎」が取消確認モーダルを開き、キャンセル期限前のため料金計算結果が0円
    When モーダルが表示される
    Then 「キャンセル料: 0円（無料）」という表示がされる
```

---

## 共通コンポーネント参照

以下の共通コンポーネント（`@/components/common/` 配下）を使用する。
詳細な設計は `_cross-cutting/ux-ui/common-components.md` を参照。

| 共通コンポーネント | インポートパス | 用途 | Props マッピング |
|------------------|--------------|------|----------------|
| `ConfirmActionModal` | `@/components/common/ConfirmActionModal` | 予約取消確認ダイアログ | `variant: "destructive", title: "予約取消確認", description: "予約を取り消します。この操作は取り消せません。", confirmLabel: "取り消す", onConfirm: () => DELETE /reservations/:id` |
| `LoadingSkeleton` | `@/components/common/LoadingSkeleton` | 予約詳細の読み込み中 | `variant: "DetailSkeleton"` |
| `ErrorBanner` | `@/components/common/ErrorBanner` | API エラー表示 | `status: 409/5xx, message: エラーメッセージ` |
