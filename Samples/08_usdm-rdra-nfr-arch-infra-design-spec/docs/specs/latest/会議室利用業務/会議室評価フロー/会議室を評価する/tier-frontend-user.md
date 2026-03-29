# 会議室を評価する - 利用者・オーナー向けフロントエンド仕様

## 変更概要

会議室評価登録画面を実装する。StarRating コンポーネントで5段階評価を直感的に入力でき、コメントを添えて投稿する。

## 画面仕様

### 会議室評価登録画面

- **URL**: `/reservations/{reservation_id}/review/room`
- **アクセス権**: 利用者（ログイン必須・利用済みの会議室のみ）
- **ポータル**: user

#### 表示要素とコンポーネントマッピング

| 要素 | 種別 | デザインシステムコンポーネント | 説明 |
|------|------|------------------------------|------|
| 評価対象会議室情報 | カード | Card | 評価対象の会議室名・利用日時を表示 |
| スター評価入力 | フォーム | StarRating (interactive=true) | 1〜5段階のインタラクティブなスター評価 |
| コメント入力 | フォーム | Input (type=textarea) | 最大500文字のコメント（任意） |
| 「投稿する」ボタン | ボタン | Button (variant=primary) | 評価投稿実行 |
| 「スキップ」リンク | リンク | Button (variant=ghost) | 評価をスキップして次へ |

#### デザイントークン参照

| 用途 | トークン | 値 |
|------|---------|---|
| 評価スター色 | var(--semantic-rating) | #FBBF24（Amber 400） |
| アクセント | var(--portal-primary) | #2563EB |

#### UIロジック

- **状態管理**: 評価スコア（1〜5）・コメント内容
- **バリデーション**: 評価スコアは必須（1〜5の整数）。コメントは任意（0〜500文字）
- **インタラクション**: スターにホバーすると選択予告の視覚フィードバック
- **ローディング**: 投稿ボタン押下後はスピナー・ボタン無効化

#### 操作フロー

1. 利用完了後に「会議室を評価する」リンクをクリック（または予約一覧から）
2. 会議室評価登録画面（/reservations/{id}/review/room）に遷移
3. StarRating で 1〜5のスコアを選択
4. コメントを入力（任意）
5. 「投稿する」をクリック
6. 完了後「オーナーを評価する」画面へ遷移を促す

## コンポーネント設計

### RoomReviewForm

- **ベースコンポーネント**: StarRating, Input
- **Props**:
  | Prop | 型 | 必須 | 説明 |
  |------|---|------|------|
  | reservationId | string | Yes | 予約ID（利用済みチェック用） |
  | roomName | string | Yes | 会議室名（表示用） |
  | onSubmit | (review: ReviewInput) => Promise<void> | Yes | 投稿コールバック |
  | onSkip | () => void | Yes | スキップコールバック |
- **状態**: 評価スコア・コメント・ホバースコア
- **イベント**: onScoreChange、onCommentChange、onSubmit

## ティア完了条件（BDD）

```gherkin
Feature: 会議室を評価する - 利用者向けフロントエンド

  Scenario: スター評価を選択してコメントを入力し投稿できる
    Given 利用者「田中太郎」が会議室評価登録画面を開いている
    When StarRating でスコア「4」を選択し、コメント「設備が充実していた」を入力して「投稿する」をクリックする
    Then 「評価を投稿しました」というメッセージが表示される

  Scenario: スター評価を未選択のまま投稿しようとするとエラーが出る
    Given 利用者「田中太郎」が会議室評価登録画面を開いている
    When スター評価を選択せずに「投稿する」をクリックする
    Then 「評価スコアを選択してください」というバリデーションエラーが表示される
```

---

## 共通コンポーネント参照

以下の共通コンポーネント（`@/components/common/` 配下）を使用する。
詳細な設計は `_cross-cutting/ux-ui/common-components.md` を参照。

| 共通コンポーネント | インポートパス | 用途 | Props マッピング |
|------------------|--------------|------|----------------|
| `LoadingSkeleton` | `@/components/common/LoadingSkeleton` | フォームの読み込み中 | `variant: "FormSkeleton"` |
| `ErrorBanner` | `@/components/common/ErrorBanner` | API エラー表示 | `status: 409/5xx, message: エラーメッセージ` |
