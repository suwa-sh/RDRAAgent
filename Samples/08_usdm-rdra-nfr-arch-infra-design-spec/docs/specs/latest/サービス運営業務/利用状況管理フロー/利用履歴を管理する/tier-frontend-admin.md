# 利用履歴を管理する - 管理者向けフロントエンド仕様

## 変更概要

管理者ポータルに利用履歴管理画面を追加する。集計軸・期間・利用者・会議室でフィルタリング可能なデータテーブル画面。

## 画面仕様

### 利用履歴管理画面

- **URL**: `/admin/usage-history`
- **アクセス権**: サービス運営担当者（adminロール）
- **ポータル**: admin

#### 表示要素とコンポーネントマッピング

| 要素 | 種別 | デザインシステムコンポーネント | 説明 |
|------|------|------------------------------|------|
| 集計軸選択タブ | タブ | TabBar | 全件/会員別/物件別/期間別の4タブ |
| 期間選択 | 日付範囲 | DateRangePicker | 利用日の開始〜終了日 |
| 利用者検索 | テキスト | SearchInput | 利用者名・利用者IDで検索 |
| 会議室検索 | テキスト | SearchInput | 会議室名・会議室IDで検索 |
| 検索実行ボタン | ボタン | Button（primary） | フィルター確定 |
| 利用履歴テーブル | テーブル | DataTable | 利用履歴の一覧 |
| 合計サマリー行 | テーブル行 | DataTableSummaryRow | 件数・合計金額・合計時間 |
| ページネーション | ページネーション | Pagination | 前へ/次へ・ページ番号 |
| CSVダウンロードボタン | ボタン | Button（secondary） | 表示中の一覧をCSVダウンロード |

#### テーブル列定義

| 列名 | 説明 | ソート |
|------|------|--------|
| 利用日時 | 利用開始日時（YYYY-MM-DD HH:mm） | ○ |
| 利用者名 | 利用者の氏名（利用者ID） | ○ |
| 会議室名 | 会議室名（会議室ID） | ○ |
| 利用時間 | 利用時間（時間・分） | ○ |
| 利用料金 | 利用料金（円） | ○ |

#### デザイントークン参照

| 用途 | トークン | 値 |
|------|---------|---|
| 背景色 | var(--semantic-background) | #F8FAFC |
| アクセント | var(--portal-primary) | #334155 |
| テーブル行ホバー | var(--semantic-background-hover) | #F1F5F9 |

#### UIロジック

- **状態管理**: フィルター条件をURLクエリパラメータに同期
- **バリデーション**: 開始日 ≤ 終了日の検証
- **ローディング**: データ取得中はSkeletonローダー表示
- **エラーハンドリング**: APIエラー時はエラーメッセージとリトライボタン表示

#### 操作フロー

1. 管理者が `/admin/usage-history` にアクセスする
2. デフォルトで全件表示（当月）が表示される
3. 集計軸タブ・期間・利用者名・会議室名を指定する
4. 「検索」ボタンをクリックして結果を取得する
5. テーブルのソートヘッダーをクリックして並び順を変更する
6. 必要に応じてCSVダウンロードする

## コンポーネント設計

### UsageHistoryPage

- **ベースコンポーネント**: AdminListPageLayout
- **Props**:
  | Prop | 型 | 必須 | 説明 |
  |------|---|------|------|
  | initialDimension | string | No | 初期集計軸（デフォルト: "all"） |
- **状態**: dimension, fromDate, toDate, userId, roomId, histories(array\|null), pagination, isLoading, error
- **イベント**: onDimensionChange, onFilter, onPageChange, onDownloadCSV

## ティア完了条件（BDD）

```gherkin
Feature: 利用履歴を管理する - 管理者向けフロントエンド

  Scenario: 利用履歴管理画面がデフォルト条件で表示される
    Given サービス運営担当者「山田花子」が管理画面にログイン済みである
    When 「/admin/usage-history」にアクセスする
    Then 当月の全利用履歴が利用日時の昇順でテーブルに表示される

  Scenario: 会議室「渋谷A会議室」でフィルタリングする
    Given 利用履歴管理画面が表示されている
    When 会議室検索欄に「渋谷A会議室」を入力して検索する
    Then 「渋谷A会議室」の利用履歴のみがテーブルに表示される
```

---

## 共通コンポーネント参照

以下の共通コンポーネント（`@/components/common/` 配下）を使用する。
詳細な設計は `_cross-cutting/ux-ui/common-components.md` を参照。

| 共通コンポーネント | インポートパス | 用途 | Props マッピング |
|------------------|--------------|------|----------------|
| `SearchFilterPanel` | `@/components/common/SearchFilterPanel` | 利用履歴フィルター | `initialValues: UsageHistoryFilter, onSearch: (values) => fetchHistory(values), onClear: () => resetFilter()` |
| `PaginatedList` | `@/components/common/PaginatedList` | 利用履歴一覧（DataTable バリアント） | `items: UsageRecord[], total, page, perPage: 20, onPageChange, isLoading` |
| `LoadingSkeleton` | `@/components/common/LoadingSkeleton` | 一覧読み込み中のスケルトン | `variant: "TableRowSkeleton"` |
| `ErrorBanner` | `@/components/common/ErrorBanner` | API エラー表示 | `status: 403/5xx, message: エラーメッセージ` |
