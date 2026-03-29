# 精算を実行する - 管理者向けフロントエンド仕様

## 変更概要

管理者ポータルに精算実行画面を追加する。精算計算済み一覧から精算対象を選択して実行し、非同期処理の状態をポーリングで確認する。

## 画面仕様

### 精算実行画面

- **URL**: `/admin/settlements/execute`
- **アクセス権**: サービス運営担当者（adminロール、MFA必須）
- **ポータル**: admin

#### 表示要素とコンポーネントマッピング

| 要素 | 種別 | デザインシステムコンポーネント | 説明 |
|------|------|------------------------------|------|
| 精算計算済み一覧テーブル | テーブル | DataTable | 精算計算済みのオーナー別精算額一覧 |
| 全件選択チェックボックス | チェックボックス | Checkbox | 全件一括選択 |
| 個別選択チェックボックス | チェックボックス | Checkbox | 個別精算の選択 |
| 精算実行ボタン | ボタン | Button（danger） | 選択した精算を実行（赤色で重要操作を明示） |
| 実行確認ダイアログ | ダイアログ | ConfirmDialog | 「X件の精算を実行します（合計: ¥XXX,XXX）。この操作は取り消せません。」 |
| 処理状態インジケーター | プログレス | ProgressIndicator | 非同期処理の進行状況 |
| 支払状態バッジ | バッジ | StatusBadge | 支払処理中（blue）/支払済み（green）/支払失敗（red） |
| 完了通知 | アラート | Alert（success） | 全件支払完了時 |

#### デザイントークン参照

| 用途 | トークン | 値 |
|------|---------|---|
| 背景色 | var(--semantic-background) | #F8FAFC |
| 危険ボタン | var(--semantic-danger) | #DC2626 |
| 処理中バッジ | var(--semantic-info) | #2563EB |
| 完了バッジ | var(--semantic-success) | #16A34A |
| 失敗バッジ | var(--semantic-danger) | #DC2626 |

#### UIロジック

- **状態管理**: 選択中の精算ID一覧・各精算の処理状態をローカル状態で管理
- **バリデーション**: 1件以上の精算が選択されていない場合は実行ボタンを無効化
- **ローディング**: 実行中はProgressIndicatorを表示。30秒ごとに状態をポーリング（非同期処理）
- **エラーハンドリング**: 処理失敗時はStatusBadgeを赤色「支払失敗」に変更し、詳細エラーをツールチップで表示

#### 操作フロー

1. 管理者が `/admin/settlements/execute` にアクセスする
2. 精算計算済みの精算一覧が表示される
3. チェックボックスで精算対象を選択する（全選択可）
4. 「精算を実行する」ボタンをクリックする
5. 確認ダイアログ「X件の精算を実行します（合計: ¥XXX,XXX）。この操作は取り消せません。」が表示される
6. 「実行」をクリックして確定する
7. 各行にProgressIndicatorが表示され、30秒ごとに状態をポーリングする
8. 決済機関からの完了通知後、StatusBadgeが「支払済み」に変わる

## コンポーネント設計

### SettlementExecutionPage

- **ベースコンポーネント**: AdminActionPageLayout
- **Props**:
  | Prop | 型 | 必須 | 説明 |
  |------|---|------|------|
  | なし | - | - | URLパラメータから対象月を取得 |
- **状態**: settlements(array), selectedIds(string[]), isExecuting(boolean), processingStatus(Record\<string, string\>), error(string\|null)
- **イベント**: onSelect, onSelectAll, onExecute, onPollingUpdate

## ティア完了条件（BDD）

```gherkin
Feature: 精算を実行する - 管理者向けフロントエンド

  Scenario: 精算実行ボタンをクリックすると確認ダイアログが表示される
    Given 精算計算済みの精算「田中太郎：¥42,000」が選択された状態で精算実行画面が表示されている
    When 「精算を実行する」ボタンをクリックする
    Then 「1件の精算を実行します（合計: ¥42,000）。この操作は取り消せません。」という確認ダイアログが表示される

  Scenario: 精算実行後に非同期処理の状態がProgressIndicatorで表示される
    Given 確認ダイアログで「実行」をクリックした後
    When APIが202 Acceptedを返す
    Then 各精算行にProgressIndicatorが表示され、30秒ごとに状態をポーリングする
```

---

## 共通コンポーネント参照

以下の共通コンポーネント（`@/components/common/` 配下）を使用する。
詳細な設計は `_cross-cutting/ux-ui/common-components.md` を参照。

| 共通コンポーネント | インポートパス | 用途 | Props マッピング |
|------------------|--------------|------|----------------|
| `ConfirmActionModal` | `@/components/common/ConfirmActionModal` | 精算実行確認ダイアログ | `variant: "default", title: "精算実行確認", description: "精算を実行します。対象件数：XX件、合計金額：¥XXX,XXX", confirmLabel: "実行する", onConfirm: () => POST /admin/settlements/:id/execute` |
| `StatusBadge` | `@/components/common/StatusBadge` | 精算状態の表示 | `status: settlement.status, model: "settlement"` |
| `LoadingSkeleton` | `@/components/common/LoadingSkeleton` | 精算詳細の読み込み中 | `variant: "DetailSkeleton"` |
| `ErrorBanner` | `@/components/common/ErrorBanner` | API エラー表示 | `status: 409/5xx, message: エラーメッセージ` |
