# 会議室を検索する - フロントエンド仕様

## 変更概要

利用者向けポータルに会議室検索画面を実装する。SearchFilter で条件入力、RoomCard で検索結果表示、ページネーションで一覧表示する。

## 画面仕様

### 会議室検索画面

- **URL**: /rooms
- **アクセス権**: 利用者
- **ポータル**: user

#### 表示要素とコンポーネントマッピング

| 要素 | 種別 | デザインシステムコンポーネント | 説明 |
|------|------|------------------------------|------|
| 検索フィルター | フォーム | SearchFilter | 機能性・価格帯・評価のフィルター入力 |
| 会議室カード | カード | RoomCard | 会議室情報の一覧表示（grid/list切替） |
| 評価表示 | 表示 | StarRating | 平均評価の星表示（readonly） |
| 価格表示 | テキスト | PriceDisplay | JPYフォーマットの価格表示 |
| ページネーション | ナビ | Button (outline) | ページ切替ボタン |
| 表示切替 | ボタン | Button (ghost) | grid/list表示の切替 |

#### デザイントークン参照

| 用途 | トークン | 値 |
|------|---------|---|
| 背景色 | var(--semantic-background) | #FFFFFF |
| アクセント | var(--color-blue-600) | #2563EB |
| カード影 | var(--shadow-sm) | 0 1px 2px rgba(0,0,0,0.05) |
| カード角丸 | var(--radius-lg) | 0.5rem |
| 評価星色 | var(--semantic-rating) | var(--color-amber-400) |

#### UIロジック

- **状態管理**: 検索条件（features[], minPrice, maxPrice, minRating）、検索結果（items[], total, page）、表示モード（grid/list）
- **バリデーション**: minPrice <= maxPrice、minRating は 0-5 の範囲
- **ローディング**: 初回表示と検索実行時に Skeleton UI（RoomCard の Skeleton 4枚）を表示
- **エラーハンドリング**: API エラー時はエラーバナー表示。ネットワークエラー時はリトライボタン表示

#### 操作フロー

1. 画面表示時に条件なしで全会議室を取得（GET /api/v1/rooms?page=1&per_page=20）
2. SearchFilter でフィルター条件を入力（機能性チェックボックス、価格帯スライダー、評価スライダー）
3. 条件変更時にデバウンス（300ms）後に自動検索実行
4. RoomCard 一覧が更新される（grid または list 表示）
5. ページネーションボタンでページ切替
6. RoomCard クリックで予約登録画面（/rooms/:id/reserve）に遷移

## コンポーネント設計

### SearchFilterPanel（この UC 固有の拡張）

- **ベースコンポーネント**: SearchFilter
- **Props**:
  | Prop | 型 | 必須 | 説明 |
  |------|---|------|------|
  | features | string[] | No | 選択中の機能性フィルター |
  | priceRange | { min: number; max: number } | No | 価格帯フィルター |
  | minRating | number | No | 最低評価フィルター |
  | onFilterChange | (filters: SearchFilters) => void | Yes | フィルター変更コールバック |
- **状態**: 内部的にフィルターの展開/折りたたみ状態を管理（モバイル時は折りたたみ）
- **イベント**: onFilterChange（デバウンス 300ms 後に発火）

### RoomCardGrid

- **ベースコンポーネント**: RoomCard
- **Props**:
  | Prop | 型 | 必須 | 説明 |
  |------|---|------|------|
  | rooms | RoomListItem[] | Yes | 表示する会議室一覧 |
  | viewMode | "grid" \| "list" | No | 表示モード（デフォルト: grid） |
  | onRoomClick | (roomId: string) => void | Yes | 会議室クリックコールバック |
- **状態**: なし（親から Props で受け取る）
- **イベント**: onRoomClick

## ティア完了条件（BDD）

```gherkin
Feature: 会議室を検索する - フロントエンド

  Scenario: 検索画面の初期表示
    Given 利用者「田中太郎」がログイン済み
    When 会議室検索画面（/rooms）にアクセスする
    Then Skeleton UI が表示された後に RoomCard 一覧が表示される
    And SearchFilter が展開状態で表示される
    And ページネーションに総件数が表示される

  Scenario: フィルター条件変更で検索結果が更新される
    Given 会議室検索画面が表示されている
    When 機能性フィルターで「Wi-Fi」チェックボックスを ON にする
    Then 300ms のデバウンス後に検索 API が呼ばれる
    And Skeleton UI が表示された後に Wi-Fi 対応の会議室のみが表示される

  Scenario: モバイル表示でフィルターが折りたたまれる
    Given 画面幅が 640px 未満
    When 会議室検索画面を表示する
    Then SearchFilter がアコーディオンで折りたたまれている
    And RoomCard がシングルカラムのリスト表示になる
```
