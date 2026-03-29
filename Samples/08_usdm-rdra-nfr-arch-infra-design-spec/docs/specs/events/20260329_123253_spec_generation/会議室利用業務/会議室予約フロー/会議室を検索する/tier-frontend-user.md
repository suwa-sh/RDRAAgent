# 会議室を検索する - 利用者・オーナー向けフロントエンド仕様

## 変更概要

会議室検索画面（SearchFilter + RoomCard 一覧）を実装する。物理・バーチャルの会議室種別に応じてフィルタ項目を動的に切り替え、検索結果を RoomCard コンポーネントで一覧表示する。

## 画面仕様

### 会議室検索画面

- **URL**: `/rooms/search`
- **アクセス権**: 全ユーザー（未ログインも可）
- **ポータル**: user

#### 表示要素とコンポーネントマッピング

| 要素 | 種別 | デザインシステムコンポーネント | 説明 |
|------|------|------------------------------|------|
| 検索フィルターパネル | フォーム | SearchFilter | エリア・収容人数・価格帯・設備・会議室種別・会議ツール種別・評価スコア・利用可能日時の絞り込み |
| 会議室カード | カード | RoomCard (variant=physical / virtual) | 会議室名・画像・評価スコア・収容人数・時間単価・会議室種別バッジを表示 |
| 会議室種別バッジ | バッジ | Badge (variant=info / virtual) | 物理=Blueバッジ、バーチャル=Violetバッジ |
| 評価スター | 表示 | StarRating (readonly=true) | 平均評価スコアを星5段階で表示 |
| ページネーション | ナビゲーション | Button (variant=outline) | 前ページ・次ページ・ページ番号ボタン |
| 検索ボタン | ボタン | Button (variant=primary) | 検索実行 |
| 検索条件クリア | ボタン | Button (variant=ghost) | 全フィルタリセット |
| 件数表示 | テキスト | - | 「XX件の会議室が見つかりました」 |
| ローディングスケルトン | 表示 | Card (placeholder) | 検索中のスケルトンUI（20枚分） |

#### デザイントークン参照

| 用途 | トークン | 値 |
|------|---------|---|
| 背景色 | var(--semantic-background) | #FFFFFF |
| アクセント | var(--portal-primary) | #2563EB（Blue 600） |
| バーチャルアクセント | var(--semantic-virtual_accent) | #8B5CF6 |
| 評価スター色 | var(--semantic-rating) | #FBBF24 |
| ボーダー | var(--semantic-border) | #E2E8F0 |

#### UIロジック

- **状態管理**: URL クエリパラメータと同期したフィルタ状態（ブラウザバックで復元可能）
- **バリデーション**:
  - 利用可能日時: 本日以降の日時のみ選択可（DatePicker で過去日を無効化）
  - 収容人数: 1以上の整数のみ
  - 価格帯: 最小値 ≤ 最大値
- **ローディング**: 検索実行中はスケルトンUI表示（500ms 以上かかる場合）
- **エラーハンドリング**: API エラー時は「検索に失敗しました。再度お試しください。」トースト表示
- **会議室種別切替**: バーチャル選択時に会議ツール種別・同時接続数フィルタを表示、物理選択時は非表示

#### 操作フロー

1. 会議室検索画面にアクセスする（初期表示: 全件表示）
2. SearchFilter パネルで検索条件を入力する
   - 会議室種別「バーチャル」選択時: 会議ツール種別・同時接続数フィルタが出現
3. 「検索」ボタンを押す
4. ローディングスケルトンが表示される
5. 検索結果が RoomCard 一覧で表示される（最大20件）
6. ページネーションで次ページに移動できる
7. 会議室カードをクリックすると会議室詳細画面に遷移する

## コンポーネント設計

### RoomSearchFilterPanel

- **ベースコンポーネント**: SearchFilter
- **Props**:
  | Prop | 型 | 必須 | 説明 |
  |------|---|------|------|
  | initialValues | SearchCondition | No | 初期フィルタ値（URLパラメータから復元） |
  | onSearch | (values: SearchCondition) => void | Yes | 検索実行コールバック |
  | isLoading | boolean | No | 検索中フラグ |
- **状態**: フィルタ値（会議室種別で動的フィールド切替）
- **イベント**: onChange（フィルタ変更時）、onSearch（検索実行）、onClear（リセット）

### RoomCardGrid

- **ベースコンポーネント**: RoomCard
- **Props**:
  | Prop | 型 | 必須 | 説明 |
  |------|---|------|------|
  | rooms | Room[] | Yes | 検索結果の会議室一覧 |
  | total | number | Yes | 総件数 |
  | page | number | Yes | 現在ページ |
  | onPageChange | (page: number) => void | Yes | ページ変更コールバック |
- **状態**: なし（親コンポーネントで管理）
- **イベント**: onRoomClick（会議室詳細へ遷移）

## ティア完了条件（BDD）

```gherkin
Feature: 会議室を検索する - 利用者向けフロントエンド

  Scenario: フィルタを入力して検索ボタンを押すと結果が表示される
    Given 利用者「田中太郎」が会議室検索画面（/rooms/search）を開いている
    When エリア「渋谷区」・収容人数「10」・会議室種別「物理」をフィルタに入力して「検索」ボタンを押す
    Then RoomCard が最大20件グリッド表示され、各カードに会議室名・評価スコア・収容人数・時間単価が表示される

  Scenario: バーチャル選択時に追加フィルタが表示される
    Given 利用者「佐藤花子」が会議室検索画面を開いている
    When 会議室種別「バーチャル」を選択する
    Then 会議ツール種別（Zoom/Teams/Google Meet）と同時接続数のフィルタ項目が表示される

  Scenario: 過去日を利用可能日時に入力するとバリデーションエラーが出る
    Given 利用者「鈴木一郎」が会議室検索画面を開いている
    When 利用可能日時に「2020-01-01 10:00」を入力して「検索」ボタンを押す
    Then 「利用可能日時は本日以降を指定してください」というエラーメッセージがフィールド下に表示される
```

---

## 共通コンポーネント参照

以下の共通コンポーネント（`@/components/common/` 配下）を使用する。
詳細な設計は `_cross-cutting/ux-ui/common-components.md` を参照。

| 共通コンポーネント | インポートパス | 用途 | Props マッピング |
|------------------|--------------|------|----------------|
| `SearchFilterPanel` | `@/components/common/SearchFilterPanel` | 検索フィルターパネル（会議室種別で動的フィールド切替） | `initialValues: RoomSearchFilter, onSearch: (values) => fetchRooms(values), onClear: () => resetFilter()` |
| `PaginatedList` | `@/components/common/PaginatedList` | 検索結果一覧（CardGrid バリアント） | `items: Room[], total, page, perPage: 20, onPageChange, isLoading, emptyMessage: "条件に合う会議室が見つかりませんでした"` |
| `EmptyState` | `@/components/common/EmptyState` | 検索結果0件時の表示 | `title: "会議室が見つかりません", description: "検索条件を変えて再試行してください", action: { label: "条件をクリア", onClick: resetFilter }` |
| `LoadingSkeleton` | `@/components/common/LoadingSkeleton` | 検索中のスケルトンUI | `variant: "CardSkeleton", count: 20` |
| `ErrorBanner` | `@/components/common/ErrorBanner` | API エラー表示 | `status: 5xx, message: "サーバーエラーが発生しました"` |
