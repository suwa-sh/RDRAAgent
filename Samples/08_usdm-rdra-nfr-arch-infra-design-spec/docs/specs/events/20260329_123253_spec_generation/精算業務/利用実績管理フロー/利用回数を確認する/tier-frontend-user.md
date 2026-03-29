# 利用回数を確認する - 利用者・オーナー向けフロントエンド仕様

## 変更概要

オーナーポータルに利用回数確認画面を追加する。集計軸（物件別/期間別）と期間を指定して、会議室ごとまたは月別の利用回数を棒グラフ・折れ線グラフで可視化する。

## 画面仕様

### 利用回数確認画面

- **URL**: `/owner/usage/count`
- **アクセス権**: 会議室オーナー（ownerロール）
- **ポータル**: owner

#### 表示要素とコンポーネントマッピング

| 要素 | 種別 | デザインシステムコンポーネント | 説明 |
|------|------|------------------------------|------|
| 集計軸切り替えタブ | タブ | TabBar | 物件別 / 期間別 の2タブ |
| 期間ピッカー | 入力 | MonthRangePicker | 開始月・終了月を選択（過去24ヶ月以内） |
| 利用回数グラフ（物件別） | チャート | BarChart | 会議室ごとの利用回数を縦棒グラフで表示 |
| 利用回数グラフ（期間別） | チャート | LineChart | 月別利用回数推移を折れ線グラフで表示 |
| KPI サマリー | カード | StatCard | 期間合計利用回数・平均利用回数・最高利用回数 |
| 前期比バッジ | バッジ | DeltaBadge | 前期比 ±%（正=green, 負=red, 0=gray） |

#### チャート仕様

**物件別 BarChart**

| 項目 | 値 |
|------|---|
| X軸 | 会議室名 |
| Y軸 | 利用回数（回） |
| 系列色 | var(--portal-primary) = #0D9488 |
| ツールチップ | 「{会議室名}: {回数}回（前期比: {±%}）」 |
| 空データ | 「集計対象の会議室が見つかりません」 |

**期間別 LineChart**

| 項目 | 値 |
|------|---|
| X軸 | 年月（YYYY-MM） |
| Y軸 | 利用回数（回） |
| 線色 | var(--portal-primary) = #0D9488 |
| データポイント | ○（丸マーカー） |
| ツールチップ | 「{YYYY年M月}: {回数}回」 |

#### デザイントークン参照

| 用途 | トークン | 値 |
|------|---------|---|
| 背景色 | var(--semantic-background) | #F8FAFC |
| アクセント | var(--portal-primary) | #0D9488（ownerポータル） |
| 前期比増加 | var(--semantic-success) | #16A34A |
| 前期比減少 | var(--semantic-error) | #DC2626 |
| グラフ補助線 | var(--semantic-border) | #E2E8F0 |

#### UIロジック

- **状態管理**: 集計軸タブ・期間・データをURLクエリパラメータに同期（`dimension`, `from`, `to`）
- **バリデーション**: 開始月 ≤ 終了月、期間は最大12ヶ月まで
- **ローディング**: データ取得中はSkeletonローダー表示（チャートエリア）
- **エラーハンドリング**: APIエラー時はインラインエラーメッセージ表示
- **デフォルト値**: 集計軸=物件別、期間=直近3ヶ月

#### 操作フロー

1. オーナーが `/owner/usage/count` にアクセスする
2. デフォルト（物件別・直近3ヶ月）のグラフが表示される
3. タブで集計軸を切り替える（URLパラメータ更新・再取得）
4. MonthRangePicker で期間を変更する（変更確定で再取得）

## コンポーネント設計

### OwnerUsageCountPage

- **ベースコンポーネント**: OwnerPageLayout
- **Props**:
  | Prop | 型 | 必須 | 説明 |
  |------|---|------|------|
  | initialDimension | "room" \| "period" | No | 初期集計軸（デフォルト: "room"） |
  | initialFrom | string | No | 初期開始月（YYYY-MM） |
  | initialTo | string | No | 初期終了月（YYYY-MM） |
- **状態**: dimension, from, to, data(array\|null), kpi(object\|null), isLoading, error
- **イベント**: onDimensionChange, onPeriodChange

## ティア完了条件（BDD）

```gherkin
Feature: 利用回数を確認する - 利用者・オーナー向けフロントエンド

  Scenario: 物件別の利用回数グラフが表示される
    Given 会議室オーナー「田中太郎」がオーナーポータルにログイン済みである
    When 「/owner/usage/count?dimension=room&from=2026-01&to=2026-03」にアクセスする
    Then 物件別棒グラフに「渋谷A会議室: 24回（前期比: +20%）」と「新宿B会議室: 18回（前期比: -5%）」が表示される

  Scenario: 期間別の利用回数折れ線グラフが表示される
    Given 会議室オーナー「田中太郎」が利用回数確認画面を表示している
    When 集計軸タブ「期間別」をクリックする
    Then 月別折れ線グラフに「1月: 14回、2月: 16回、3月: 12回」が表示される
```

---

## 共通コンポーネント参照

以下の共通コンポーネント（`@/components/common/` 配下）を使用する。
詳細な設計は `_cross-cutting/ux-ui/common-components.md` を参照。

| 共通コンポーネント | インポートパス | 用途 | Props マッピング |
|------------------|--------------|------|----------------|
| `LoadingSkeleton` | `@/components/common/LoadingSkeleton` | 利用回数グラフの読み込み中 | `variant: "DetailSkeleton"` |
| `ErrorBanner` | `@/components/common/ErrorBanner` | API エラー表示 | `status: 5xx, message: エラーメッセージ` |
