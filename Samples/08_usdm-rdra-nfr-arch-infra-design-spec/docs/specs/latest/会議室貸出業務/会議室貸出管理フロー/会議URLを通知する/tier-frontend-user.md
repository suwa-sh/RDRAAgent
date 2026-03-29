# 会議URLを通知する - 利用者・オーナー向けフロントエンド仕様

## 変更概要

バーチャル会議室の予約確定後に会議URL通知状況を確認できる画面を追加する。自動通知UCのため画面での操作はなく、通知済みステータスと会議URL情報の参照のみを提供する。

## 画面仕様

### 会議URL通知確認（予約詳細画面の一部）

- **URL**: `/reservations/:id` （予約詳細画面内に会議URL通知セクションとして組み込み）
- **アクセス権**: 利用者（当該予約の利用者のみ）
- **ポータル**: user（利用者ポータル）

#### 表示要素とコンポーネントマッピング

| 要素 | 種別 | デザインシステムコンポーネント | 説明 |
|------|------|------------------------------|------|
| 通知状態バッジ | バッジ | Badge (variant: success) | 「会議URL通知済み」を表示 |
| 会議URLリンク | テキスト | Button (variant: ghost) | 会議URLをクリッカブルなリンクで表示 |
| 会議ツール種別 | バッジ | Badge (variant: virtual) | Zoom/Teams/Google Meet のバッジ表示 |
| 利用開始日時 | テキスト | - (セマンティックHTML) | 会議開始予定日時 |

#### デザイントークン参照

| 用途 | トークン | 値 |
|------|---------|---|
| 背景色 | var(--semantic-background) | #FFFFFF |
| アクセント | var(--portal-primary) | #2563EB (Blue 600, 利用者ポータル) |
| バーチャルアクセント | var(--semantic-virtual-accent) | #8B5CF6 (violet-500) |

#### UIロジック

- **状態管理**: バーチャル会議室の予約詳細表示時に会議URL通知状況をAPIから取得して表示
- **バリデーション**: なし（参照のみ）
- **ローディング**: Skeleton ローダーで会議URLセクションをロード表示
- **エラーハンドリング**: 会議URLが未設定の場合は「会議URLは準備中です。オーナーにお問い合わせください」を表示

#### 操作フロー

1. バーチャル会議室の予約が「確定」状態に遷移した際、利用者のメールに会議URLが届く
2. 利用者が予約詳細画面を開くと、会議URL通知セクションに「会議URL通知済み」バッジと会議URLが表示される
3. 会議URLをクリックして会議ツール（Zoom等）を起動できる

## コンポーネント設計

### MeetingUrlNotice

- **ベースコンポーネント**: Badge + Card
- **Props**:
  | Prop | 型 | 必須 | 説明 |
  |------|---|------|------|
  | meetingUrl | string | Yes | 会議URL |
  | toolType | "Zoom" \| "Teams" \| "Google Meet" | Yes | 会議ツール種別 |
  | notifiedAt | string | Yes | 通知日時 (ISO 8601) |
  | startAt | string | Yes | 利用開始日時 (ISO 8601) |
- **状態**: notified, pending（URLが未設定の場合）
- **イベント**: onClickUrl（外部リンク遷移）

## ティア完了条件（BDD）

```gherkin
Feature: 会議URLを通知する - フロントエンド

  Scenario: バーチャル会議室の予約確定後、予約詳細画面に会議URLが表示される
    Given 利用者「田中太郎」がログイン済みで、バーチャル会議室の予約R-002（Zoom、会議URL: https://zoom.us/j/123456789）が「確定」状態である
    When 利用者が予約詳細画面（/reservations/R-002）を開く
    Then 会議URLセクションに「会議URL通知済み」バッジとZoom URLが表示される

  Scenario: 会議URL未設定の場合、準備中メッセージが表示される
    Given 利用者「田中太郎」がバーチャル会議室の予約R-003（会議URL未設定）の詳細画面を開いている
    When 会議URLセクションを確認する
    Then 「会議URLは準備中です。オーナーにお問い合わせください」メッセージが表示される
```

---

## 共通コンポーネント参照

以下の共通コンポーネント（`@/components/common/` 配下）を使用する。
詳細な設計は `_cross-cutting/ux-ui/common-components.md` を参照。

| 共通コンポーネント | インポートパス | 用途 | Props マッピング |
|------------------|--------------|------|----------------|
| `StatusBadge` | `@/components/common/StatusBadge` | 予約状態の表示 | `status: reservation.status, model: "reservation"` |
| `LoadingSkeleton` | `@/components/common/LoadingSkeleton` | 詳細の読み込み中 | `variant: "DetailSkeleton"` |
| `ErrorBanner` | `@/components/common/ErrorBanner` | API エラー表示 | `status: 5xx, message: エラーメッセージ` |
