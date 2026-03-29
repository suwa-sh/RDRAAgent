# バーチャル会議室を予約する - 利用者・オーナー向けフロントエンド仕様

## 変更概要

バーチャル会議室専用の予約画面を実装する。物理会議室の予約申請画面と類似しているが、会議ツール種別・同時接続数の表示と「許諾後に会議URLが届く」旨のガイダンスを追加する。

## 画面仕様

### バーチャル会議室予約画面

- **URL**: `/rooms/{room_id}/reserve/virtual`
- **アクセス権**: 利用者（ログイン必須）
- **ポータル**: user

#### 表示要素とコンポーネントマッピング

| 要素 | 種別 | デザインシステムコンポーネント | 説明 |
|------|------|------------------------------|------|
| バーチャル情報表示 | カード | Card | 会議ツール種別・同時接続数・録画可否の確認表示 |
| バーチャルバッジ | バッジ | Badge (variant=virtual) | バーチャル会議室であることを視覚的に表示 |
| 予約カレンダー | フォーム | BookingCalendar | 日時選択（物理と同じコンポーネント） |
| 利用料金表示 | テキスト | PriceDisplay | リアルタイム計算 |
| 会議URL通知ガイダンス | テキスト | - | 「許諾後に会議URLが届きます」 |
| 「申請する」ボタン | ボタン | Button (variant=primary, size=lg) | バーチャル予約申請 |

#### デザイントークン参照

| 用途 | トークン | 値 |
|------|---------|---|
| バーチャルアクセント | var(--semantic-virtual_accent) | #8B5CF6 |
| アクセント | var(--portal-primary) | #2563EB |

#### UIロジック

- **状態管理**: 選択日時・利用料金（物理会議室予約と同じロジック）
- **バリデーション**: 物理会議室予約と同じルール（運用ルール範囲内・未来日時）
- **ガイダンス**: 「予約が確定するとオーナーから会議URLが通知されます」というインフォメーションを表示

#### 操作フロー

1. バーチャル会議室詳細画面から「予約する」をクリック
2. バーチャル会議室予約画面に遷移
3. 会議ツール種別・同時接続数を確認
4. BookingCalendar で日時を選択
5. 利用料金をリアルタイム確認
6. 「申請する」ボタンを押す
7. 「オーナーの許諾後に会議URLが届きます」メッセージが表示される

## コンポーネント設計

### VirtualReservationForm

- **ベースコンポーネント**: BookingCalendar, Badge(virtual), PriceDisplay
- **Props**:
  | Prop | 型 | 必須 | 説明 |
  |------|---|------|------|
  | room | VirtualRoomDetail | Yes | バーチャル会議室詳細（ツール種別・同時接続数含む） |
  | onSubmit | (reservation: VirtualReservationInput) => Promise<void> | Yes | 申請コールバック |
- **状態**: 選択日時・利用料金
- **イベント**: onDateChange, onSubmit

## ティア完了条件（BDD）

```gherkin
Feature: バーチャル会議室を予約する - 利用者向けフロントエンド

  Scenario: バーチャル会議室予約画面に会議ツール情報が表示される
    Given 利用者「田中太郎」がZoomバーチャル会議室予約画面（/rooms/vroom-001/reserve/virtual）を開いた
    When ページが読み込まれる
    Then 会議ツール種別「Zoom」・同時接続数「50」・「許諾後に会議URLが届きます」というガイダンスが表示される
```

---

## 共通コンポーネント参照

以下の共通コンポーネント（`@/components/common/` 配下）を使用する。
詳細な設計は `_cross-cutting/ux-ui/common-components.md` を参照。

| 共通コンポーネント | インポートパス | 用途 | Props マッピング |
|------------------|--------------|------|----------------|
| `LoadingSkeleton` | `@/components/common/LoadingSkeleton` | 予約フォームの読み込み中 | `variant: "FormSkeleton"` |
| `ErrorBanner` | `@/components/common/ErrorBanner` | API エラー表示 | `status: 409/5xx, message: エラーメッセージ` |
