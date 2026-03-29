# 利用者の評価を確認する - 利用者・オーナー向けフロントエンド仕様

## 変更概要

予約審査画面から遷移する「利用者評価確認画面」を追加する。利用者の評価一覧（評価スコア・コメント・評価日時）と平均スコアを表示し、オーナーが予約審査の判断材料として利用できるようにする。

## 画面仕様

### 利用者評価確認画面

- **URL**: `/owner/users/:userId/ratings?reservationId=:reservationId`
- **アクセス権**: 会議室オーナー（該当予約に関連するオーナーのみ）
- **ポータル**: owner（オーナーポータル）

#### 表示要素とコンポーネントマッピング

| 要素 | 種別 | デザインシステムコンポーネント | 説明 |
|------|------|------------------------------|------|
| 利用者名 | テキスト | - (セマンティックHTML h2) | 評価対象の利用者名 |
| 平均評価スコア | 評価表示 | StarRating (readOnly: true) | 全評価の平均スコア（小数第1位） |
| 評価一覧 | テーブル/カード | Card (variant: default) | 評価スコア・コメント・評価日時の一覧 |
| 個別評価スコア | 評価表示 | StarRating (readOnly: true, size: sm) | 各評価レコードのスコア |
| 評価履歴なしメッセージ | テキスト | Badge (variant: info) | 初回利用者の場合に表示 |
| 予約審査に戻るボタン | ボタン | Button (variant: outline) | 前画面（予約審査画面）に戻る |
| 予約を審査するボタン | ボタン | Button (variant: primary) | 予約審査画面に遷移 |

#### デザイントークン参照

| 用途 | トークン | 値 |
|------|---------|---|
| 背景色 | var(--semantic-background) | #FFFFFF |
| アクセント | var(--portal-primary) | #0D9488 (Teal 600, オーナーポータル) |
| 評価星色 | var(--semantic-rating) | #FBBF24 |
| カード影 | var(--component-card-shadow) | 0 1px 3px 0 rgb(0 0 0 / 0.1) |

#### UIロジック

- **状態管理**: 評価一覧のローディング状態（loading / loaded / empty / error）をローカルステートで管理
- **バリデーション**: なし（参照のみ）
- **ローディング**: Skeleton ローダーで評価カード3枚分を表示しながらデータ取得
- **エラーハンドリング**: 403エラー時は「アクセス権限がありません」トースト通知後に予約一覧に遷移。その他エラーは「データの取得に失敗しました。再試行してください」を表示

#### 操作フロー

1. 予約審査画面の「利用者の評価を確認」リンクをクリック
2. 利用者評価確認画面に遷移し、Skeleton ローダーが表示される
3. API からデータ取得後、平均スコアと評価一覧が表示される
4. 評価件数が0件の場合「評価履歴なし（初回利用者）」バッジが表示される
5. 「予約を審査する」ボタンをクリックして予約審査画面に戻る

## コンポーネント設計

### UserRatingList

- **ベースコンポーネント**: StarRating + Card
- **Props**:
  | Prop | 型 | 必須 | 説明 |
  |------|---|------|------|
  | userId | string | Yes | 評価対象の利用者ID |
  | reservationId | string | Yes | 参照元の予約ID（認可チェック用） |
  | ratings | RatingItem[] | Yes | 評価一覧データ |
  | averageScore | number | No | 平均スコア（undefined時は0件表示） |
- **状態**: loading, loaded, empty, error
- **イベント**: onNavigateToReview（予約審査画面への遷移）

### RatingItem（内部型）

| フィールド | 型 | 説明 |
|-----------|---|------|
| evaluationId | string | 評価ID |
| score | number | 評価スコア (1-5) |
| comment | string | コメント |
| evaluatedAt | string | 評価日時 (ISO 8601) |

## ティア完了条件（BDD）

```gherkin
Feature: 利用者の評価を確認する - フロントエンド

  Scenario: 利用者「田中太郎」の評価一覧が画面に正しく表示される
    Given 会議室オーナー「山田花子」がオーナーポータルにログイン済みで、予約ID「R-001」の利用者評価確認画面を開いている
    When APIから評価データ（3件、平均スコア: 4.2）が返却される
    Then StarRatingコンポーネントで平均スコア4.2が表示され、3件の評価カードが一覧表示される

  Scenario: 評価データ取得中にSkeletonローダーが表示される
    Given 会議室オーナー「山田花子」が利用者評価確認画面にアクセスした
    When APIリクエストが処理中である
    Then Skeletonローダーが3枚のカード形状で表示される
```

---

## 共通コンポーネント参照

以下の共通コンポーネント（`@/components/common/` 配下）を使用する。
詳細な設計は `_cross-cutting/ux-ui/common-components.md` を参照。

| 共通コンポーネント | インポートパス | 用途 | Props マッピング |
|------------------|--------------|------|----------------|
| `PaginatedList` | `@/components/common/PaginatedList` | 利用者評価一覧（CardGrid バリアント） | `items: Review[], total, page, perPage: 10, onPageChange, isLoading` |
| `LoadingSkeleton` | `@/components/common/LoadingSkeleton` | 評価一覧の読み込み中 | `variant: "CardSkeleton"` |
| `ErrorBanner` | `@/components/common/ErrorBanner` | API エラー表示 | `status: 5xx, message: エラーメッセージ` |
