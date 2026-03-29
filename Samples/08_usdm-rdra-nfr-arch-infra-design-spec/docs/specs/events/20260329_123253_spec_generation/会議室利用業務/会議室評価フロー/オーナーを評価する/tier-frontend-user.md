# オーナーを評価する - 利用者・オーナー向けフロントエンド仕様

## 変更概要

オーナー評価登録画面を実装する。会議室評価登録画面と同じコンポーネント（RoomReviewForm）を流用し、評価対象をオーナーとして表示する。

## 画面仕様

### オーナー評価登録画面

- **URL**: `/reservations/{reservation_id}/review/owner`
- **アクセス権**: 利用者（ログイン必須・利用済みの予約のみ）
- **ポータル**: user

#### 表示要素とコンポーネントマッピング

| 要素 | 種別 | デザインシステムコンポーネント | 説明 |
|------|------|------------------------------|------|
| オーナー情報表示 | カード | Card | 評価対象のオーナー名・会議室名を表示 |
| スター評価入力 | フォーム | StarRating (interactive=true) | 1〜5段階のインタラクティブなスター評価 |
| コメント入力 | フォーム | Input (type=textarea) | 最大500文字のコメント（任意） |
| オーナー認証バッジ | バッジ | OwnerVerificationBadge | 評価対象オーナーの認証状態 |
| 「投稿する」ボタン | ボタン | Button (variant=primary) | 評価投稿実行 |
| 「スキップ」リンク | リンク | Button (variant=ghost) | 評価をスキップ |

#### デザイントークン参照

| 用途 | トークン | 値 |
|------|---------|---|
| 評価スター色 | var(--semantic-rating) | #FBBF24 |
| アクセント | var(--portal-primary) | #2563EB |

#### UIロジック

- **状態管理**: 評価スコア（1〜5）・コメント内容（会議室評価と同じ）
- **バリデーション**: 評価スコア必須（1〜5）。コメント任意（0〜500文字）
- **フロー**: 会議室評価投稿後に自動遷移（会議室評価 → オーナー評価のフロー）

#### 操作フロー

1. 会議室評価投稿後に「オーナーも評価する」ボタンをクリック（または予約一覧から）
2. オーナー評価登録画面（/reservations/{id}/review/owner）に遷移
3. StarRating でスコアを選択
4. コメントを入力（任意）
5. 「投稿する」をクリック
6. 完了後マイページ/評価完了画面へ

## コンポーネント設計

### OwnerReviewForm

- **ベースコンポーネント**: StarRating, Input, OwnerVerificationBadge（RoomReviewFormと同一構成）
- **Props**:
  | Prop | 型 | 必須 | 説明 |
  |------|---|------|------|
  | reservationId | string | Yes | 予約ID |
  | ownerName | string | Yes | オーナー名（表示用） |
  | onSubmit | (review: ReviewInput) => Promise<void> | Yes | 投稿コールバック |
  | onSkip | () => void | Yes | スキップコールバック |
- **状態**: 評価スコア・コメント
- **イベント**: onScoreChange、onCommentChange、onSubmit

## ティア完了条件（BDD）

```gherkin
Feature: オーナーを評価する - 利用者向けフロントエンド

  Scenario: オーナー評価を入力して投稿できる
    Given 利用者「田中太郎」がオーナー評価登録画面を開いている
    When StarRating でスコア「5」を選択し、コメント「丁寧な対応でした」を入力して「投稿する」をクリックする
    Then 「オーナー評価を投稿しました」というメッセージが表示される
```

---

## 共通コンポーネント参照

以下の共通コンポーネント（`@/components/common/` 配下）を使用する。
詳細な設計は `_cross-cutting/ux-ui/common-components.md` を参照。

| 共通コンポーネント | インポートパス | 用途 | Props マッピング |
|------------------|--------------|------|----------------|
| `LoadingSkeleton` | `@/components/common/LoadingSkeleton` | フォームの読み込み中 | `variant: "FormSkeleton"` |
| `ErrorBanner` | `@/components/common/ErrorBanner` | API エラー表示 | `status: 409/5xx, message: エラーメッセージ` |
