# 問合せに対応する - 管理者向けフロントエンド仕様

## 変更概要

管理者ポータルに問合せ対応画面（一覧・詳細・回答入力）を追加する。未対応件数バッジ付きのリスト画面と回答入力フォームを提供する。

## 画面仕様

### 問合せ対応一覧画面

- **URL**: `/admin/inquiries`
- **アクセス権**: サービス運営担当者（adminロール）
- **ポータル**: admin

#### 表示要素とコンポーネントマッピング

| 要素 | 種別 | デザインシステムコンポーネント | 説明 |
|------|------|------------------------------|------|
| 状態フィルタータブ | タブ | TabBar | 全件/未対応/回答済み/対応済みの4タブ |
| 未対応件数バッジ | バッジ | Badge（danger） | 未対応件数を赤バッジ表示 |
| キーワード検索 | テキスト | SearchInput | 問合せ内容・利用者名で検索 |
| 問合せ一覧テーブル | テーブル | DataTable | 問合せ一覧 |
| 問合せ状態バッジ | バッジ | StatusBadge | 未対応（amber）/回答済み（blue）/対応済み（green） |
| 問合せ日時 | テキスト | Text | 問合せ受付日時 |
| 対応ボタン | ボタン | Button（primary, sm） | 詳細・回答入力画面へ遷移 |

### 問合せ詳細・回答入力画面

- **URL**: `/admin/inquiries/{inquiry_id}`
- **アクセス権**: サービス運営担当者（adminロール）
- **ポータル**: admin

#### 表示要素とコンポーネントマッピング

| 要素 | 種別 | デザインシステムコンポーネント | 説明 |
|------|------|------------------------------|------|
| 問合せ詳細パネル | カード | DetailCard | 利用者名・問合せ日時・カテゴリー・問合せ内容を表示 |
| 回答入力エリア | テキストエリア | Textarea | 回答内容の入力（1〜2000文字） |
| 回答送信ボタン | ボタン | Button（primary） | 回答を送信し状態を「回答済み」に遷移 |
| 対応済みボタン | ボタン | Button（secondary） | 状態を「対応済み」に遷移（回答済み時のみ表示） |
| 戻るリンク | リンク | Link | 問合せ一覧に戻る |

#### デザイントークン参照

| 用途 | トークン | 値 |
|------|---------|---|
| 背景色 | var(--semantic-background) | #F8FAFC |
| アクセント | var(--portal-primary) | #334155 |
| 未対応バッジ | var(--semantic-warning) | #F59E0B |
| 回答済みバッジ | var(--semantic-info) | #2563EB |
| 対応済みバッジ | var(--semantic-success) | #16A34A |

#### UIロジック

- **状態管理**: 選択タブ・検索ワード・ページをURLクエリパラメータに同期
- **バリデーション**: 回答内容は1文字以上2000文字以内
- **ローディング**: 送信中はスピナー表示・ボタン無効化
- **エラーハンドリング**: APIエラー時はエラーアラートを表示

#### 操作フロー

1. 管理者が `/admin/inquiries` にアクセスする（未対応タブをデフォルト表示）
2. 問合せ行の「対応」ボタンをクリックして詳細画面に遷移する
3. 問合せ内容を確認し回答を入力する
4. 「回答送信」ボタンをクリックする
5. 完了メッセージが表示され状態が「回答済み」になる
6. 「対応済みにする」ボタンをクリックして状態を「対応済み」にする

## コンポーネント設計

### InquiryManagementPage

- **ベースコンポーネント**: AdminListPageLayout
- **Props**:
  | Prop | 型 | 必須 | 説明 |
  |------|---|------|------|
  | initialStatus | string | No | 初期タブ（デフォルト: "pending"） |
- **状態**: status, keyword, page, inquiries(array\|null), pendingCount, isLoading, error
- **イベント**: onTabChange, onSearchChange, onNavigateToDetail

### InquiryAnswerForm

- **ベースコンポーネント**: FormCard
- **Props**:
  | Prop | 型 | 必須 | 説明 |
  |------|---|------|------|
  | inquiry | InquiryDetail | Yes | 問合せ詳細データ |
  | onAnswerSuccess | () => void | No | 回答送信成功コールバック |
- **状態**: answerContent(string), isSubmitting(boolean), isSuccess(boolean), error(string\|null)
- **イベント**: onContentChange, onSubmitAnswer, onMarkResolved

## ティア完了条件（BDD）

```gherkin
Feature: 問合せに対応する - 管理者向けフロントエンド

  Scenario: 未対応の問合せ一覧が表示される
    Given サービス運営担当者「山田花子」が管理画面にログイン済みである
    When 「/admin/inquiries」にアクセスする
    Then 未対応タブが選択され、未対応件数バッジ「3」が表示された問合せ一覧が表示される

  Scenario: 問合せに回答して状態が回答済みになる
    Given 問合せ詳細画面（inquiry_id: INQ-001）が表示されている
    When 回答内容「予約詳細画面の『予約を取り消す』ボタンからキャンセルできます」を入力して「回答送信」をクリックする
    Then 「回答を送信しました」という完了メッセージが表示され、問合せ状態バッジが「回答済み」に変わる
```

---

## 共通コンポーネント参照

以下の共通コンポーネント（`@/components/common/` 配下）を使用する。
詳細な設計は `_cross-cutting/ux-ui/common-components.md` を参照。

| 共通コンポーネント | インポートパス | 用途 | Props マッピング |
|------------------|--------------|------|----------------|
| `SearchFilterPanel` | `@/components/common/SearchFilterPanel` | 問合せフィルター（状態・日付範囲） | `initialValues: InquiryFilter, onSearch: (values) => fetchInquiries(values), onClear: () => resetFilter()` |
| `PaginatedList` | `@/components/common/PaginatedList` | 問合せ一覧（DataTable バリアント） | `items: Inquiry[], total, page, perPage: 20, onPageChange, isLoading, emptyMessage: "問合せがありません"` |
| `StatusBadge` | `@/components/common/StatusBadge` | 問合せ状態の表示 | `status: inquiry.status, model: "inquiry"` |
| `EmptyState` | `@/components/common/EmptyState` | 問合せ0件時の表示 | `title: "問合せはありません", description: "現在対応が必要な問合せはありません"` |
| `LoadingSkeleton` | `@/components/common/LoadingSkeleton` | 一覧読み込み中のスケルトン | `variant: "TableRowSkeleton"` |
| `ErrorBanner` | `@/components/common/ErrorBanner` | API エラー表示 | `status: 403/5xx, message: エラーメッセージ` |
