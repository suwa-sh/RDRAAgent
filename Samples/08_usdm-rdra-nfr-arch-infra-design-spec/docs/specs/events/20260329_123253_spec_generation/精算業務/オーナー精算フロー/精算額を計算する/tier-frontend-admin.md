# 精算額を計算する - 管理者向けフロントエンド仕様

## 変更概要

管理者ポータルに精算額計算画面を追加する。対象月を選択して精算額計算を実行し、計算結果を確認するフロー。

## 画面仕様

### 精算額計算画面

- **URL**: `/admin/settlements/calculate`
- **アクセス権**: サービス運営担当者（adminロール、MFA必須）
- **ポータル**: admin

#### 表示要素とコンポーネントマッピング

| 要素 | 種別 | デザインシステムコンポーネント | 説明 |
|------|------|------------------------------|------|
| 対象月選択 | 月選択 | MonthPicker | 精算対象月の年月選択（過去月のみ選択可） |
| 計算実行ボタン | ボタン | Button（primary） | 精算額計算を実行。実行中は無効化 |
| 未精算一覧テーブル | テーブル | DataTable | 未精算オーナーの一覧（オーナー名・対象月・ステータス） |
| 計算結果プレビュー | テーブル | DataTable | 計算後の精算額一覧（オーナー別・利用料合計・手数料合計・精算額） |
| 完了アラート | アラート | Alert（success） | 計算完了時に表示 |
| 精算実行ボタン | リンクボタン | Button（secondary） | 精算実行画面へ遷移 |

#### デザイントークン参照

| 用途 | トークン | 値 |
|------|---------|---|
| 背景色 | var(--semantic-background) | #F8FAFC |
| アクセント | var(--portal-primary) | #334155 |
| 成功アラート | var(--semantic-success-bg) | #F0FDF4 |
| 精算額強調 | var(--semantic-text-primary) | #0F172A |

#### UIロジック

- **状態管理**: 選択中の対象月・計算結果をローカル状態で管理
- **バリデーション**: 対象月は必須。当月以降の選択を不可にする
- **ローディング**: 計算実行中はスピナー表示・ボタン無効化（重複実行防止）
- **エラーハンドリング**: APIエラー時はエラーアラート表示

#### 操作フロー

1. 管理者が `/admin/settlements/calculate` にアクセスする
2. 未精算の精算一覧が表示される
3. MonthPickerで対象月（例: 2026年2月）を選択する
4. 「精算額を計算する」ボタンをクリックする
5. 計算完了メッセージが表示され、オーナー別精算額プレビューが表示される
6. 内容を確認して「精算実行へ」ボタンをクリックし精算実行画面へ遷移する

## コンポーネント設計

### SettlementCalculationPage

- **ベースコンポーネント**: AdminActionPageLayout
- **Props**:
  | Prop | 型 | 必須 | 説明 |
  |------|---|------|------|
  | defaultMonth | string | No | デフォルト選択月（YYYY-MM形式） |
- **状態**: selectedMonth(string), settlementList(array\|null), calculationResult(array\|null), isCalculating(boolean), error(string\|null)
- **イベント**: onMonthChange, onCalculate

## ティア完了条件（BDD）

```gherkin
Feature: 精算額を計算する - 管理者向けフロントエンド

  Scenario: 対象月を選択して精算額計算を実行する
    Given サービス運営担当者「山田花子」が管理画面にMFAでログイン済みである
    When 「/admin/settlements/calculate」にアクセスし、対象月「2026年2月」を選択して「精算額を計算する」をクリックする
    Then 「精算額の計算が完了しました」というアラートが表示され、オーナー「田中太郎」の精算額「¥42,000」が計算結果テーブルに表示される

  Scenario: 当月以降の月は選択できない
    Given 精算額計算画面が表示されている
    When MonthPickerで当月「2026年3月」を選択しようとする
    Then 当月および翌月以降の日付が選択不可の状態でグレーアウト表示される
```

---

## 共通コンポーネント参照

以下の共通コンポーネント（`@/components/common/` 配下）を使用する。
詳細な設計は `_cross-cutting/ux-ui/common-components.md` を参照。

| 共通コンポーネント | インポートパス | 用途 | Props マッピング |
|------------------|--------------|------|----------------|
| `PaginatedList` | `@/components/common/PaginatedList` | 精算対象一覧（DataTable バリアント） | `items: Settlement[], total, page, perPage: 20, onPageChange, isLoading` |
| `StatusBadge` | `@/components/common/StatusBadge` | 精算状態の表示 | `status: settlement.status, model: "settlement"` |
| `LoadingSkeleton` | `@/components/common/LoadingSkeleton` | 一覧の読み込み中 | `variant: "TableRowSkeleton"` |
| `ErrorBanner` | `@/components/common/ErrorBanner` | API エラー表示 | `status: 403/5xx, message: エラーメッセージ` |
