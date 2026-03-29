# オーナー登録審査一覧を確認する - 管理者向けフロントエンド仕様

## 変更概要

管理者ポータルにオーナー審査管理画面を追加する。審査状態フィルター・キーワード検索・ページネーションを備えたデータテーブル画面。

## 画面仕様

### オーナー審査管理画面

- **URL**: `/admin/owners`
- **アクセス権**: サービス運営担当者（adminロール）
- **ポータル**: admin

#### 表示要素とコンポーネントマッピング

| 要素 | 種別 | デザインシステムコンポーネント | 説明 |
|------|------|------------------------------|------|
| 審査状態フィルタータブ | タブ | TabBar | 全件/審査待ち/登録済み/却下/退会の5タブ |
| 審査待ち件数バッジ | バッジ | Badge（danger） | 審査待ち件数を赤バッジで表示 |
| キーワード検索入力 | テキスト | SearchInput | 申請者名・メールアドレスで検索 |
| 申請日ソート | テーブルヘッダー | SortableTableHeader | 申請日の昇順/降順ソート |
| オーナー一覧テーブル | テーブル | DataTable | オーナー情報の一覧 |
| 審査状態バッジ | バッジ | StatusBadge | 審査待ち（amber）/登録済み（green）/却下（red）/退会（gray） |
| 経過日数表示 | テキスト | Text（警告色） | 経過7日以上の場合は赤色で警告表示 |
| 詳細ボタン | ボタン | Button（secondary, sm） | 審査詳細画面へのナビゲーション |
| ページネーション | ページネーション | Pagination | 前へ/次へ・ページ番号 |

#### デザイントークン参照

| 用途 | トークン | 値 |
|------|---------|---|
| 背景色 | var(--semantic-background) | #F8FAFC |
| アクセント | var(--portal-primary) | #334155 |
| 審査待ちバッジ | var(--semantic-warning) | #F59E0B |
| 登録済みバッジ | var(--semantic-success) | #16A34A |
| 却下バッジ | var(--semantic-danger) | #DC2626 |
| 退会バッジ | var(--semantic-neutral) | #94A3B8 |
| 警告テキスト（経過7日以上） | var(--semantic-danger) | #DC2626 |

#### UIロジック

- **状態管理**: 選択タブ（status）・検索ワード・ページ番号をURLクエリパラメータに同期。ブラウザバックで状態を復元可能
- **バリデーション**: キーワード検索は50文字以内。特殊文字はサニタイズ
- **ローディング**: データ取得中はDataTableをSkeletonに置換
- **エラーハンドリング**: APIエラー時はテーブルエリアにエラーメッセージを表示しリトライボタンを提供

#### 操作フロー

1. 管理者が `/admin/owners` にアクセスする
2. デフォルトで「審査待ち」タブが選択され、審査待ちオーナー一覧が表示される
3. 各タブをクリックして審査状態でフィルターする
4. 検索ボックスにキーワードを入力してリアルタイム検索する
5. 申請日ヘッダーをクリックして昇順/降順ソートを切り替える
6. 「詳細」ボタンをクリックしてオーナー審査詳細画面（「オーナー登録を審査するUC」）へ遷移する

## コンポーネント設計

### OwnerReviewListPage

- **ベースコンポーネント**: AdminListPageLayout
- **Props**:
  | Prop | 型 | 必須 | 説明 |
  |------|---|------|------|
  | initialStatus | string | No | 初期フィルター状態（デフォルト: "pending"） |
- **状態**: status(string), keyword(string), page(number), owners(array\|null), totalCount(number), pendingCount(number), isLoading(boolean), error(string\|null)
- **イベント**: onTabChange, onSearchChange, onPageChange, onNavigateToDetail

### OwnerReviewStatusBadge

- **ベースコンポーネント**: StatusBadge
- **Props**:
  | Prop | 型 | 必須 | 説明 |
  |------|---|------|------|
  | status | "pending"\|"approved"\|"rejected"\|"withdrawn" | Yes | 審査状態 |
- **状態**: なし
- **イベント**: なし

## ティア完了条件（BDD）

```gherkin
Feature: オーナー登録審査一覧を確認する - 管理者向けフロントエンド

  Scenario: 審査待ちタブに審査待ち件数バッジが表示される
    Given サービス運営担当者「山田花子」が管理画面にログイン済みである
    When 「/admin/owners」にアクセスする
    Then 「審査待ち」タブが選択状態で表示され、バッジに審査待ち件数「5」が表示される

  Scenario: キーワード「田中」で検索すると該当オーナーのみ表示される
    Given オーナー審査管理画面が表示されている
    When 検索ボックスに「田中」を入力する
    Then 申請者名または連絡先に「田中」を含むオーナー「田中太郎」「田中花子」のみが一覧に表示される

  Scenario: 経過7日以上の審査待ちは警告色で表示される
    Given オーナー審査管理画面の審査待ちタブが表示されている
    When 審査待ち一覧に申請日「2026-03-22」（7日以上前）のオーナーが存在する
    Then そのオーナーの経過日数「7日」が赤色で表示される
```

---

## 共通コンポーネント参照

以下の共通コンポーネント（`@/components/common/` 配下）を使用する。
詳細な設計は `_cross-cutting/ux-ui/common-components.md` を参照。

| 共通コンポーネント | インポートパス | 用途 | Props マッピング |
|------------------|--------------|------|----------------|
| `SearchFilterPanel` | `@/components/common/SearchFilterPanel` | オーナー審査フィルター | `initialValues: OwnerReviewFilter, onSearch: (values) => fetchOwners(values), onClear: () => resetFilter()` |
| `PaginatedList` | `@/components/common/PaginatedList` | 審査一覧（DataTable バリアント） | `items: OwnerReview[], total, page, perPage: 20, onPageChange, isLoading` |
| `StatusBadge` | `@/components/common/StatusBadge` | オーナー登録状態の表示 | `status: owner.status, model: "owner"` |
| `LoadingSkeleton` | `@/components/common/LoadingSkeleton` | 一覧読み込み中のスケルトン | `variant: "TableRowSkeleton"` |
| `ErrorBanner` | `@/components/common/ErrorBanner` | API エラー表示 | `status: 403/5xx, message: エラーメッセージ` |
