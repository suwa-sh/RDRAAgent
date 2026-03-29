# バーチャル会議室を評価する - 利用者・オーナー向けフロントエンド仕様

## 変更概要

バーチャル会議室評価登録画面を実装する。物理会議室評価画面と同一コンポーネントを使用しつつ、バーチャル特有の評価観点（接続安定性・会議ツールの使いやすさ）のガイダンスを追加する。

## 画面仕様

### バーチャル会議室評価登録画面

- **URL**: `/reservations/{reservation_id}/review/virtual-room`
- **アクセス権**: 利用者（ログイン必須・バーチャル会議室利用済みのみ）
- **ポータル**: user

#### 表示要素とコンポーネントマッピング

| 要素 | 種別 | デザインシステムコンポーネント | 説明 |
|------|------|------------------------------|------|
| バーチャル会議室情報 | カード | Card | 評価対象のバーチャル会議室名・会議ツール種別・利用日時 |
| バーチャルバッジ | バッジ | Badge (variant=virtual) | バーチャル会議室であることを表示 |
| 評価観点ガイダンス | テキスト | - | 「接続安定性・音質・操作性を含めて評価してください」 |
| スター評価入力 | フォーム | StarRating (interactive=true) | 1〜5段階評価 |
| コメント入力 | フォーム | Input (type=textarea) | バーチャル特有の観点を促す placeholder（例: 接続安定性について） |
| 「投稿する」ボタン | ボタン | Button (variant=primary) | 評価投稿 |

#### デザイントークン参照

| 用途 | トークン | 値 |
|------|---------|---|
| バーチャルアクセント | var(--semantic-virtual_accent) | #8B5CF6 |
| 評価スター色 | var(--semantic-rating) | #FBBF24 |

#### UIロジック

- **状態管理**: 評価スコア・コメント（物理会議室評価と同じ）
- **バリデーション**: 評価スコア必須（1〜5）
- **ガイダンス**: コメント欄に「接続安定性・音質・操作性について記載できます」という placeholder

#### 操作フロー

1. バーチャル会議室利用完了後に「バーチャル会議室を評価する」リンクをクリック
2. バーチャル会議室評価登録画面に遷移
3. バーチャル特有の評価観点ガイダンスを確認
4. StarRating でスコアを選択
5. コメントを入力（任意）
6. 「投稿する」をクリック
7. 完了後「バーチャル会議室オーナーを評価する」画面へ遷移を促す

## コンポーネント設計

### VirtualRoomReviewForm

- **ベースコンポーネント**: StarRating, Input, Badge(virtual)（RoomReviewForm と同一構成、バーチャル表示追加）
- **Props**:
  | Prop | 型 | 必須 | 説明 |
  |------|---|------|------|
  | reservationId | string | Yes | 予約ID |
  | roomName | string | Yes | バーチャル会議室名（表示用） |
  | toolType | string | Yes | 会議ツール種別（Zoom/Teams/Google Meet） |
  | onSubmit | (review: ReviewInput) => Promise<void> | Yes | 投稿コールバック |
  | onSkip | () => void | Yes | スキップコールバック |
- **状態**: 評価スコア・コメント
- **イベント**: onScoreChange、onCommentChange、onSubmit

## ティア完了条件（BDD）

```gherkin
Feature: バーチャル会議室を評価する - 利用者向けフロントエンド

  Scenario: バーチャル会議室評価画面にバーチャル特有の情報が表示される
    Given 利用者「田中太郎」がバーチャル会議室評価登録画面（Zoom会議室）を開いた
    When ページが読み込まれる
    Then Violetのバーチャルバッジ・会議ツール種別「Zoom」・「接続安定性・音質・操作性について記載できます」という placeholder が表示される

  Scenario: バーチャル会議室評価を投稿できる
    Given 利用者「田中太郎」がバーチャル会議室評価登録画面を開いている
    When StarRating でスコア「5」を選択して「投稿する」をクリックする
    Then 「バーチャル会議室の評価を投稿しました」というメッセージが表示される
```

---

## 共通コンポーネント参照

以下の共通コンポーネント（`@/components/common/` 配下）を使用する。
詳細な設計は `_cross-cutting/ux-ui/common-components.md` を参照。

| 共通コンポーネント | インポートパス | 用途 | Props マッピング |
|------------------|--------------|------|----------------|
| `LoadingSkeleton` | `@/components/common/LoadingSkeleton` | フォームの読み込み中 | `variant: "FormSkeleton"` |
| `ErrorBanner` | `@/components/common/ErrorBanner` | API エラー表示 | `status: 409/5xx, message: エラーメッセージ` |
