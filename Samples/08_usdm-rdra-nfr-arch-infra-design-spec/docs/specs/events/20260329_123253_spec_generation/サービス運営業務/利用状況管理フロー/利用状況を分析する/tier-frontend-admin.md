# 利用状況を分析する - 管理者向けフロントエンド仕様

## 変更概要

管理者ポータルに利用状況分析ダッシュボード画面を追加する。利用回数・売上・稼働率を複合チャートで可視化するデータ分析画面。

## 画面仕様

### 利用状況分析画面

- **URL**: `/admin/analytics/usage`
- **アクセス権**: サービス運営担当者（adminロール）
- **ポータル**: admin

#### 表示要素とコンポーネントマッピング

| 要素 | 種別 | デザインシステムコンポーネント | 説明 |
|------|------|------------------------------|------|
| 集計軸選択 | セレクト | Select | 会員別/物件別/期間別の3択 |
| 期間選択 | 日付範囲 | DateRangePicker | 集計期間の指定 |
| 分析実行ボタン | ボタン | Button（primary） | 分析実行 |
| KPIサマリーカード群 | カード | StatCard × 4 | 総利用回数・総売上金額・前期比・アクティブユーザー数 |
| 期間別推移チャート | 複合チャート | ComboChart | 折れ線（利用回数）＋棒グラフ（売上金額）の複合チャート |
| 物件別稼働率チャート | 棒グラフ | BarChart | 物件別稼働率（%）を横棒グラフで表示（物件別選択時） |
| 会員別利用ランキング | テーブル | DataTable | 利用回数・利用金額のランキング（会員別選択時） |
| 物件別明細テーブル | テーブル | DataTable | 物件別の利用回数・売上・稼働率 |

#### チャート仕様

**期間別推移複合チャート（ComboChart）**
- X軸: 年月（2026-01、2026-02 等）
- 左Y軸: 利用回数（件数）/ 折れ線グラフ
- 右Y軸: 売上金額（円）/ 棒グラフ
- ツールチップ: 月・利用回数・売上金額・前期比を表示
- 折れ線色: `#2563EB`（Blue 600）
- 棒グラフ色: `#0D9488`（Teal 600）

**物件別稼働率横棒グラフ（BarChart）**
- Y軸: 会議室名
- X軸: 稼働率（%）、100%を右端基準
- 閾値線: 50%に点線を追加（目標稼働率）
- 色: 稼働率80%以上=`#16A34A`（green）、50-80%=`#2563EB`（blue）、50%未満=`#F59E0B`（amber）

**KPIサマリーカード**
| カード | 値 | 補足 |
|--------|---|------|
| 総利用回数 | 集計期間の合計利用回数 | 前期比（矢印付き） |
| 総売上金額 | 集計期間の合計売上（円） | 前期比（矢印付き） |
| 平均稼働率 | 全物件の平均稼働率（%） | 集計期間平均 |
| アクティブユーザー | ユニーク利用者数 | 集計期間内 |

#### デザイントークン参照

| 用途 | トークン | 値 |
|------|---------|---|
| 背景色 | var(--semantic-background) | #F8FAFC |
| アクセント | var(--portal-primary) | #334155 |
| 上昇トレンド | var(--semantic-success) | #16A34A |
| 下降トレンド | var(--semantic-danger) | #DC2626 |
| 折れ線チャート | #2563EB | Blue 600 |
| 棒グラフ | #0D9488 | Teal 600 |

#### UIロジック

- **状態管理**: 集計条件（dimension, fromDate, toDate）をURLクエリパラメータに同期
- **バリデーション**: 開始日 ≤ 終了日、最大365日以内の検証
- **ローディング**: 分析実行中はKPIカードとチャートエリアをSkeletonに置換
- **エラーハンドリング**: APIエラー時はチャートエリアにエラーメッセージとリトライボタンを表示

#### 操作フロー

1. 管理者が `/admin/analytics/usage` にアクセスする
2. デフォルト条件（期間別・当月）でチャートが自動表示される
3. 集計軸と期間を変更して「分析実行」をクリックする
4. KPIサマリー・複合チャート・明細テーブルが更新される

## コンポーネント設計

### UsageAnalyticsPage

- **ベースコンポーネント**: DashboardLayout
- **Props**:
  | Prop | 型 | 必須 | 説明 |
  |------|---|------|------|
  | initialDimension | string | No | 初期集計軸（デフォルト: "period"） |
- **状態**: dimension, fromDate, toDate, analyticsData(object\|null), isLoading, error
- **イベント**: onDimensionChange, onDateRangeChange, onAnalyze

### UsageKPICards

- **ベースコンポーネント**: StatCard × 4
- **Props**:
  | Prop | 型 | 必須 | 説明 |
  |------|---|------|------|
  | kpiData | UsageKPI | Yes | KPIデータ（総利用回数・総売上・稼働率・アクティブ数） |
- **状態**: なし
- **イベント**: なし

### UsageTrendComboChart

- **ベースコンポーネント**: ComboChart
- **Props**:
  | Prop | 型 | 必須 | 説明 |
  |------|---|------|------|
  | data | UsageTrendItem[] | Yes | 期間別推移データ |
- **状態**: hoveredIndex(number\|null)
- **イベント**: onDataPointClick（明細テーブルのフィルター連動）

## ティア完了条件（BDD）

```gherkin
Feature: 利用状況を分析する - 管理者向けフロントエンド

  Scenario: 利用状況分析画面がデフォルト条件で表示される
    Given サービス運営担当者「山田花子」が管理画面にログイン済みである
    When 「/admin/analytics/usage」にアクセスする
    Then 集計軸「期間別」・当月の条件でKPIカードと複合チャートが表示される

  Scenario: 物件別に切り替えると稼働率横棒グラフが表示される
    Given 利用状況分析画面が表示されている
    When 集計軸「物件別」を選択して「分析実行」をクリックする
    Then 物件別稼働率横棒グラフが表示され、最高稼働率「渋谷A会議室: 78.5%」が緑色で表示される

  Scenario: 365日を超える期間を指定するとバリデーションエラーが表示される
    Given 利用状況分析画面が表示されている
    When 開始日「2025-01-01」・終了日「2026-12-31」を入力して「分析実行」をクリックする
    Then 「集計期間は最大1年（365日）以内を指定してください」というエラーメッセージが表示される
```

---

## 共通コンポーネント参照

以下の共通コンポーネント（`@/components/common/` 配下）を使用する。
詳細な設計は `_cross-cutting/ux-ui/common-components.md` を参照。

| 共通コンポーネント | インポートパス | 用途 | Props マッピング |
|------------------|--------------|------|----------------|
| `SearchFilterPanel` | `@/components/common/SearchFilterPanel` | 分析フィルター（期間・会議室種別） | `initialValues: UsageAnalyticsFilter, onSearch: (values) => fetchAnalytics(values), onClear: () => resetFilter()` |
| `LoadingSkeleton` | `@/components/common/LoadingSkeleton` | チャート読み込み中のスケルトン | `variant: "DetailSkeleton"` |
| `ErrorBanner` | `@/components/common/ErrorBanner` | API エラー表示 | `status: 403/5xx, message: エラーメッセージ` |
