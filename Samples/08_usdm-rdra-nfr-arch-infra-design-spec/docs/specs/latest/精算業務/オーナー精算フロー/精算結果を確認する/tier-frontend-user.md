# 精算結果を確認する - 利用者・オーナー向けフロントエンド仕様

## 変更概要

オーナーポータルに精算結果確認画面（一覧・詳細）を追加する。精算額・支払状態・支払明細を表示するシンプルな参照画面。

## 画面仕様

### 精算結果一覧画面

- **URL**: `/owner/settlements`
- **アクセス権**: 会議室オーナー（ownerロール）
- **ポータル**: owner

#### 表示要素とコンポーネントマッピング

| 要素 | 種別 | デザインシステムコンポーネント | 説明 |
|------|------|------------------------------|------|
| 累計受取金額サマリー | カード | StatCard | 累計受取金額（支払済みの合計） |
| 支払状態フィルタータブ | タブ | TabBar | 全件/支払済み/処理中/確定済みの4タブ |
| 精算一覧テーブル | テーブル | DataTable | 精算対象月・精算額・支払日・状態の一覧 |
| 精算状態バッジ | バッジ | StatusBadge | 支払済み（green）/支払処理中（blue）/精算計算済み（amber）/未精算（gray） |
| 詳細リンク | リンク | Link | 精算詳細画面へ遷移 |

### 精算詳細画面

- **URL**: `/owner/settlements/{settlement_id}`
- **アクセス権**: 会議室オーナー（ownerロール）
- **ポータル**: owner

#### 表示要素とコンポーネントマッピング

| 要素 | 種別 | デザインシステムコンポーネント | 説明 |
|------|------|------------------------------|------|
| 精算対象月・状態 | テキスト + バッジ | Text + StatusBadge | 精算対象月と現在の精算状態 |
| 精算額内訳 | カード | DetailCard | 利用料合計・手数料合計・精算額の内訳 |
| 支払情報 | カード | DetailCard | 支払日・決済機関連携IDを表示（支払済み時のみ） |
| 戻るリンク | リンク | Link | 精算一覧に戻る |

#### デザイントークン参照

| 用途 | トークン | 値 |
|------|---------|---|
| 背景色 | var(--semantic-background) | #F8FAFC |
| アクセント | var(--portal-primary) | #0D9488（ownerポータル） |
| 支払済みバッジ | var(--semantic-success) | #16A34A |
| 処理中バッジ | var(--semantic-info) | #2563EB |
| 精算額強調 | var(--semantic-text-primary) | #0F172A |

#### UIロジック

- **状態管理**: 選択タブ・ページをURLクエリパラメータに同期
- **バリデーション**: 不要（参照系）
- **ローディング**: データ取得中はSkeletonローダー表示
- **エラーハンドリング**: APIエラー時はエラーメッセージ表示

#### 操作フロー

1. オーナーが `/owner/settlements` にアクセスする
2. 全精算履歴が新しい順に表示される
3. タブで精算状態をフィルターする
4. 詳細を確認したい精算行をクリックして詳細画面に遷移する

## コンポーネント設計

### OwnerSettlementListPage

- **ベースコンポーネント**: OwnerPageLayout
- **Props**:
  | Prop | 型 | 必須 | 説明 |
  |------|---|------|------|
  | initialStatus | string | No | 初期タブ（デフォルト: "all"） |
- **状態**: status, page, settlements(array\|null), totalPaidAmount, isLoading, error
- **イベント**: onTabChange, onPageChange, onNavigateToDetail

## ティア完了条件（BDD）

```gherkin
Feature: 精算結果を確認する - 利用者・オーナー向けフロントエンド

  Scenario: 精算結果一覧画面が表示される
    Given 会議室オーナー「田中太郎」がオーナーポータルにログイン済みである
    When 「/owner/settlements」にアクセスする
    Then 精算一覧が表示され、累計受取金額サマリー「¥126,000」が表示される

  Scenario: 精算詳細で内訳が確認できる
    Given 精算結果一覧画面が表示されている
    When 精算「2026年2月」の詳細リンクをクリックする
    Then 精算詳細画面に「利用料合計: ¥48,000、手数料合計: ¥6,000、精算額: ¥42,000、支払日: 2026-03-05」が表示される
```

---

## 共通コンポーネント参照

以下の共通コンポーネント（`@/components/common/` 配下）を使用する。
詳細な設計は `_cross-cutting/ux-ui/common-components.md` を参照。

| 共通コンポーネント | インポートパス | 用途 | Props マッピング |
|------------------|--------------|------|----------------|
| `StatusBadge` | `@/components/common/StatusBadge` | 精算状態の表示 | `status: settlement.status, model: "settlement"` |
| `LoadingSkeleton` | `@/components/common/LoadingSkeleton` | 精算詳細の読み込み中 | `variant: "DetailSkeleton"` |
| `ErrorBanner` | `@/components/common/ErrorBanner` | API エラー表示 | `status: 5xx, message: エラーメッセージ` |
