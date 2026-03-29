# 手数料売上を分析する - 管理者向けフロントエンド仕様

## 変更概要

手数料売上分析画面を管理者ポータルに追加する。売上分析区分（会議室別・貸出別・月別・オーナー別）と期間を指定してデータを可視化するダッシュボード画面。

## 画面仕様

### 手数料売上分析画面

- **URL**: `/admin/analytics/fee-sales`
- **アクセス権**: サービス運営担当者（adminロール）
- **ポータル**: admin

#### 表示要素とコンポーネントマッピング

| 要素 | 種別 | デザインシステムコンポーネント | 説明 |
|------|------|------------------------------|------|
| 集計条件フォーム | フォーム | FilterForm | 売上分析区分（Select）と期間（DateRangePicker）の入力エリア |
| 売上分析区分選択 | セレクト | Select | 会議室別/貸出別/月別/オーナー別の4択 |
| 期間選択 | 日付範囲 | DateRangePicker | 開始日〜終了日の日付入力 |
| 分析実行ボタン | ボタン | Button（primary） | 集計条件を確定して分析実行 |
| 手数料合計サマリー | カード | StatCard | 集計期間の手数料合計・前期比を表示 |
| 手数料売上棒グラフ | チャート | BarChart | 集計軸ごとの手数料金額を棒グラフ表示 |
| 推移折れ線グラフ | チャート | LineChart | 月別推移を折れ線グラフ表示（月別選択時） |
| 構成比円グラフ | チャート | PieChart | 全体に占める割合を円グラフ表示 |
| 明細テーブル | テーブル | DataTable | 集計結果の明細一覧（ソート・ページネーション対応） |
| CSVダウンロードボタン | ボタン | Button（secondary） | 集計結果をCSVでダウンロード |

#### チャート仕様

**棒グラフ（BarChart）**
- X軸: 集計軸の値（会議室名/月/オーナー名/貸出ID）
- Y軸: 手数料金額（円）
- ツールチップ: 手数料金額・手数料率・件数を表示
- 色: `var(--portal-primary)` = `#334155`（adminポータル）

**折れ線グラフ（LineChart）** ※月別選択時のみ表示
- X軸: 年月（2026-01〜2026-03 等）
- Y軸: 手数料金額（円）
- データポイント: 月別手数料合計
- 前期比ライン: 薄いグレーで前期の同月データを重ね表示

**円グラフ（PieChart）**
- 凡例: 集計軸の値
- 割合: 全体に占める手数料金額の比率（%表示）
- 上位5件を個別色で表示、残りを「その他」に集約

**明細テーブル列定義**

| 列名 | 会議室別 | 貸出別 | 月別 | オーナー別 |
|------|---------|--------|------|----------|
| 集計キー | 会議室名 | 貸出ID | 年月 | オーナー名 |
| 手数料合計 | ○ | ○ | ○ | ○ |
| 手数料率 | ○ | ○ | - | ○ |
| 件数 | ○ | - | ○ | ○ |
| 前期比 | ○ | - | ○ | ○ |

#### デザイントークン参照

| 用途 | トークン | 値 |
|------|---------|---|
| 背景色 | var(--semantic-background) | #F8FAFC |
| アクセント | var(--portal-primary) | #334155 |
| プライマリテキスト | var(--semantic-text-primary) | #0F172A |
| セカンダリテキスト | var(--semantic-text-secondary) | #475569 |
| 成功色（増加） | var(--semantic-success) | #16A34A |
| 危険色（減少） | var(--semantic-danger) | #DC2626 |
| チャート色1 | #2563EB | Blue 600 |
| チャート色2 | #0D9488 | Teal 600 |
| チャート色3 | #F59E0B | Amber 500 |
| チャート色4 | #DC2626 | Red 600 |
| チャート色5 | #7C3AED | Violet 600 |

#### UIロジック

- **状態管理**: 集計条件（dimension, fromDate, toDate）をURLクエリパラメータとして管理し、ブックマーク・共有可能にする
- **バリデーション**: 開始日 ≤ 終了日の検証をフォームsubmit前に実施。エラー時はフォーム直下にインラインエラーメッセージを表示
- **ローディング**: 分析実行中はSkeletonローダーをチャートエリアに表示。1秒以上かかる場合はプログレスインジケーターを表示
- **エラーハンドリング**: API エラー時はチャートエリアにエラーメッセージとリトライボタンを表示

#### 操作フロー

1. 管理者が `/admin/analytics/fee-sales` にアクセスする
2. デフォルト条件（月別・当月）でチャートが自動表示される
3. 売上分析区分をドロップダウンから選択する（例: 「会議室別」）
4. 期間を DateRangePicker で指定する（例: 2026-01-01〜2026-03-31）
5. 「分析実行」ボタンをクリックする
6. Skeletonローダーが表示され、APIレスポンス後にチャートが更新される
7. 棒グラフ・折れ線グラフ・円グラフ・明細テーブルが表示される
8. 必要に応じて「CSVダウンロード」ボタンをクリックしてデータを取得する

## コンポーネント設計

### FeeSalesAnalyticsPage

- **ベースコンポーネント**: DashboardLayout（管理者ポータル共通レイアウト）
- **Props**:
  | Prop | 型 | 必須 | 説明 |
  |------|---|------|------|
  | initialDimension | string | No | 初期表示の集計軸（デフォルト: "monthly"） |
- **状態**: dimension(string), fromDate(Date), toDate(Date), analyticsData(object\|null), isLoading(boolean), error(string\|null)
- **イベント**: onDimensionChange, onDateRangeChange, onAnalyze, onDownloadCSV

### FeeSalesSummaryCard

- **ベースコンポーネント**: StatCard
- **Props**:
  | Prop | 型 | 必須 | 説明 |
  |------|---|------|------|
  | totalAmount | number | Yes | 集計期間の手数料合計（円） |
  | previousAmount | number | No | 前期の手数料合計（比較用） |
  | periodLabel | string | Yes | 集計期間ラベル（例: "2026年1月"） |
- **状態**: なし（純粋表示コンポーネント）
- **イベント**: なし

### FeeSalesBarChart

- **ベースコンポーネント**: BarChart
- **Props**:
  | Prop | 型 | 必須 | 説明 |
  |------|---|------|------|
  | data | FeeSalesSummaryItem[] | Yes | チャートデータ |
  | dimension | string | Yes | 集計軸（棒グラフのX軸ラベル決定に使用） |
- **状態**: hoveredBarIndex(number\|null)
- **イベント**: onBarClick（明細テーブルのフィルター連動）

## ティア完了条件（BDD）

```gherkin
Feature: 手数料売上を分析する - 管理者向けフロントエンド

  Scenario: 月別集計画面がデフォルト条件で表示される
    Given サービス運営担当者「山田花子」が管理画面にログイン済みである
    When 「/admin/analytics/fee-sales」にアクセスする
    Then 売上分析区分「月別」・期間「当月」がデフォルト選択された状態で手数料売上分析画面が表示される

  Scenario: 会議室別集計に切り替えてチャートが更新される
    Given 手数料売上分析画面が表示されている
    When 売上分析区分を「会議室別」に変更し「分析実行」をクリックする
    Then 会議室別の棒グラフと明細テーブルが表示され、会議室「渋谷A会議室」の行が上位に表示される

  Scenario: 無効な期間を入力するとバリデーションエラーが表示される
    Given 手数料売上分析画面が表示されている
    When 開始日「2026-03-31」、終了日「2026-01-01」を入力して「分析実行」をクリックする
    Then 「集計期間の開始日は終了日以前を指定してください」というエラーメッセージがフォーム直下に表示される
```

---

## 共通コンポーネント参照

以下の共通コンポーネント（`@/components/common/` 配下）を使用する。
詳細な設計は `_cross-cutting/ux-ui/common-components.md` を参照。

| 共通コンポーネント | インポートパス | 用途 | Props マッピング |
|------------------|--------------|------|----------------|
| `SearchFilterPanel` | `@/components/common/SearchFilterPanel` | 売上分析フィルター（期間・集計粒度） | `initialValues: FeeSalesFilter, onSearch: (values) => fetchFeeSales(values), onClear: () => resetFilter()` |
| `LoadingSkeleton` | `@/components/common/LoadingSkeleton` | チャート読み込み中のスケルトン | `variant: "DetailSkeleton"` |
| `ErrorBanner` | `@/components/common/ErrorBanner` | API エラー表示 | `status: 403/5xx, message: エラーメッセージ` |
