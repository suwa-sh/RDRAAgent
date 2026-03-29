# バーチャル会議室オーナーを評価する - 利用者・オーナー向けフロントエンド仕様

## 変更概要

バーチャル会議室オーナー評価登録画面を実装する。物理会議室のオーナー評価と同一コンポーネントを使用しつつ、バーチャル特有の評価観点（会議URL通知の迅速さ・テクニカルサポート対応）のガイダンスを追加する。

## 画面仕様

### バーチャルオーナー評価登録画面

- **URL**: `/reservations/{reservation_id}/review/virtual-owner`
- **アクセス権**: 利用者（ログイン必須・バーチャル会議室利用済みのみ）
- **ポータル**: user

#### 表示要素とコンポーネントマッピング

| 要素 | 種別 | デザインシステムコンポーネント | 説明 |
|------|------|------------------------------|------|
| バーチャル会議室・オーナー情報 | カード | Card | 評価対象のオーナー名・バーチャル会議室名・会議ツール種別 |
| バーチャルバッジ | バッジ | Badge (variant=virtual) | バーチャル会議室オーナーであることを視覚表示 |
| 評価観点ガイダンス | テキスト | - | 「会議URLの通知迅速さ・テクニカルサポート対応を含めて評価してください」 |
| スター評価入力 | フォーム | StarRating (interactive=true) | 1〜5段階のインタラクティブなスター評価 |
| コメント入力 | フォーム | Input (type=textarea) | バーチャル特有の観点を促す placeholder |
| オーナー認証バッジ | バッジ | OwnerVerificationBadge | 評価対象オーナーの認証状態 |
| 「投稿する」ボタン | ボタン | Button (variant=primary) | 評価投稿 |
| 「スキップ」リンク | リンク | Button (variant=ghost) | 評価をスキップ |

#### デザイントークン参照

| 用途 | トークン | 値 |
|------|---------|---|
| バーチャルアクセント | var(--semantic-virtual_accent) | #8B5CF6 |
| 評価スター色 | var(--semantic-rating) | #FBBF24 |

#### UIロジック

- **状態管理**: 評価スコア・コメント
- **バリデーション**: 評価スコア必須（1〜5）
- **ガイダンス**: コメント欄 placeholder「会議URLの通知迅速さ・接続サポート等について記載できます」

#### 操作フロー

1. バーチャル会議室評価投稿後に「バーチャル会議室オーナーも評価する」をクリック
2. バーチャルオーナー評価登録画面に遷移
3. バーチャル特有の評価観点ガイダンスを確認
4. StarRating でスコアを選択
5. コメントを入力（任意）
6. 「投稿する」をクリック
7. 完了後マイページへ遷移

## コンポーネント設計

### VirtualOwnerReviewForm

- **ベースコンポーネント**: StarRating, Input, Badge(virtual), OwnerVerificationBadge
- **Props**:
  | Prop | 型 | 必須 | 説明 |
  |------|---|------|------|
  | reservationId | string | Yes | 予約ID |
  | ownerName | string | Yes | オーナー名（表示用） |
  | toolType | string | Yes | 会議ツール種別（Zoom/Teams/Google Meet） |
  | onSubmit | (review: ReviewInput) => Promise<void> | Yes | 投稿コールバック |
  | onSkip | () => void | Yes | スキップコールバック |
- **状態**: 評価スコア・コメント
- **イベント**: onScoreChange、onCommentChange、onSubmit

## ティア完了条件（BDD）

```gherkin
Feature: バーチャル会議室オーナーを評価する - 利用者向けフロントエンド

  Scenario: バーチャルオーナー評価画面にバーチャル特有のガイダンスが表示される
    Given 利用者「田中太郎」がバーチャルオーナー評価登録画面を開いた
    When ページが読み込まれる
    Then Violetのバーチャルバッジ・「会議URLの通知迅速さ・接続サポート等について記載できます」という placeholder が表示される

  Scenario: バーチャル会議室オーナーの評価を投稿できる
    Given 利用者「田中太郎」がバーチャルオーナー評価登録画面を開いている
    When StarRating でスコア「4」を選択し、コメント「会議URLの通知が迅速でした」を入力して「投稿する」をクリックする
    Then 「バーチャル会議室オーナーの評価を投稿しました」というメッセージが表示される
```

---

## 共通コンポーネント参照

以下の共通コンポーネント（`@/components/common/` 配下）を使用する。
詳細な設計は `_cross-cutting/ux-ui/common-components.md` を参照。

| 共通コンポーネント | インポートパス | 用途 | Props マッピング |
|------------------|--------------|------|----------------|
| `LoadingSkeleton` | `@/components/common/LoadingSkeleton` | フォームの読み込み中 | `variant: "FormSkeleton"` |
| `ErrorBanner` | `@/components/common/ErrorBanner` | API エラー表示 | `status: 409/5xx, message: エラーメッセージ` |
