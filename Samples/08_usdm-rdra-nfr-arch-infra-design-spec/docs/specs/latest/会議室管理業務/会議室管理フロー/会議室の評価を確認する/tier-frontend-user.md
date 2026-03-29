# 会議室の評価を確認する - 利用者・オーナー向けフロントエンド仕様

## 変更概要

会議室評価一覧画面を新規作成する。ログイン済みオーナーが自身の会議室に付けられた評価を一覧形式で確認できる画面。StarRating コンポーネントで評価スコアを視覚的に表示する。

## 画面仕様

### 会議室評価一覧画面

- **URL**: `/owner/rooms/:room_id/reviews`
- **アクセス権**: ログイン済み会議室オーナー（対象会議室の所有者）
- **ポータル**: owner

#### 表示要素とコンポーネントマッピング

| 要素 | 種別 | デザインシステムコンポーネント | 説明 |
|------|------|------------------------------|------|
| 平均評価スコア | テキスト | StarRating (readOnly: true, size: lg) | 全評価の平均スコアを大きく表示 |
| 総評価件数 | テキスト | - | 「XX件の評価」 |
| 評価カードリスト | カード | Card (variant: default) + StarRating | 各評価を評価スコア・コメント・評価日時付きカードで表示 |
| 評価スコア（カード内） | テキスト | StarRating (readOnly: true, size: sm) | 各評価の星評価 |
| コメント（カード内） | テキスト | - | 利用者のコメントテキスト |
| 評価日時（カード内） | テキスト | - | 評価日時（YYYY年MM月DD日形式） |
| 空状態メッセージ | テキスト | Card (variant: default) | 評価0件時に「まだ評価がありません」を表示 |
| ページネーション | ナビゲーション | Button (variant: outline) | 1ページ10件、次/前ページ操作 |

#### デザイントークン参照

| 用途 | トークン | 値 |
|------|---------|---|
| 背景色 | var(--semantic-background) | #FFFFFF |
| アクセント | var(--portal-primary) | #0D9488 (Teal 600) |
| 評価スター色 | var(--semantic-rating) | #FBBF24 |

#### UIロジック

- **状態管理**: 評価一覧データ、ローディング状態、ページ番号
- **バリデーション**: なし（参照のみ）
- **ローディング**: 初期表示時はSkeleton（平均スコア・カードリスト）
- **エラーハンドリング**: 403は「この操作を行う権限がありません」を表示。評価0件は空状態UIを表示

#### 操作フロー

1. `/owner/rooms/:room_id/reviews` を開く
2. Skeleton ローディングが表示される
3. 評価データを受信し平均スコア（StarRating）と評価カードリストが表示される
4. 評価が0件の場合は「まだ評価がありません」カードが表示される
5. ページネーションで次ページを表示する（1ページ10件）

## コンポーネント設計

### RoomReviewList

- **ベースコンポーネント**: StarRating, Card, Button
- **Props**:
  | Prop | 型 | 必須 | 説明 |
  |------|---|------|------|
  | roomId | string | Yes | 対象会議室ID |
- **状態**:
  - `reviews`: RoomReview[]
  - `averageScore`: number
  - `totalCount`: number
  - `currentPage`: number
  - `isLoading`: boolean
- **イベント**: `onPageChange`（ページ変更）

## ティア完了条件（BDD）

```gherkin
Feature: 会議室の評価を確認する - フロントエンド

  Scenario: 評価一覧が評価日時降順で表示される
    Given オーナー「田中一郎」が会議室「渋谷会議室A」の評価一覧画面を開いた
    When 評価データが取得できる状態
    Then 最新の評価が先頭に表示され、StarRatingで評価スコアが視覚的に表示される

  Scenario: 評価0件時に空状態メッセージが表示される
    Given オーナー「田中一郎」が評価が0件の会議室「渋谷会議室B」の評価一覧画面を開いた
    When データ取得完了
    Then 「まだ評価がありません」のカードが表示される

  Scenario: 平均評価スコアが大きいStarRatingで表示される
    Given 会議室「渋谷会議室A」に4.2点の平均評価がある
    When 評価一覧画面が表示される
    Then 「4.2」の平均スコアが大きいStarRatingコンポーネント（size: lg）で表示される
```

---

## 共通コンポーネント参照

以下の共通コンポーネント（`@/components/common/` 配下）を使用する。
詳細な設計は `_cross-cutting/ux-ui/common-components.md` を参照。

| 共通コンポーネント | インポートパス | 用途 | Props マッピング |
|------------------|--------------|------|----------------|
| `PaginatedList` | `@/components/common/PaginatedList` | 会議室評価一覧（CardGrid バリアント） | `items: Review[], total, page, perPage: 10, onPageChange, isLoading` |
| `LoadingSkeleton` | `@/components/common/LoadingSkeleton` | 評価一覧の読み込み中 | `variant: "CardSkeleton"` |
| `ErrorBanner` | `@/components/common/ErrorBanner` | API エラー表示 | `status: 5xx, message: エラーメッセージ` |
