# 予約を変更する - 利用者・オーナー向けフロントエンド仕様

## 変更概要

予約変更画面を実装する。確定済み予約の日時を BookingCalendar で変更し、変更後の利用料金をリアルタイム計算して表示する。

## 画面仕様

### 予約変更画面

- **URL**: `/reservations/{reservation_id}/edit`
- **アクセス権**: 利用者（ログイン必須・予約所有者のみ）
- **ポータル**: user

#### 表示要素とコンポーネントマッピング

| 要素 | 種別 | デザインシステムコンポーネント | 説明 |
|------|------|------------------------------|------|
| 現在の予約情報 | カード | Card | 変更前の日時・利用料金を参照表示 |
| 予約カレンダー | フォーム | BookingCalendar | 変更後の日時選択（現在の予約は選択状態で表示） |
| 変更後利用時間 | フォーム | Input (type=time) | 変更後の開始・終了時間 |
| 変更後利用料金 | テキスト | PriceDisplay | 変更後の利用料金リアルタイム計算 |
| 「変更する」ボタン | ボタン | Button (variant=primary) | 変更実行 |
| キャンセルボタン | ボタン | Button (variant=ghost) | 変更を破棄して予約詳細に戻る |

#### デザイントークン参照

| 用途 | トークン | 値 |
|------|---------|---|
| 背景色 | var(--semantic-background) | #FFFFFF |
| アクセント | var(--portal-primary) | #2563EB |

#### UIロジック

- **状態管理**: 変更後の選択日時・利用料金（派生値）
- **バリデーション**: 申請時と同じルール（運用ルール範囲内・未来日時）
- **ローディング**: 変更ボタン押下後はスピナー・ボタン無効化
- **エラーハンドリング**: 409（重複）・422（ルール違反）はトースト通知

#### 操作フロー

1. 予約一覧画面から変更対象の予約の「変更する」をクリック
2. 予約変更画面（/reservations/{id}/edit）に遷移
3. 現在の予約日時が表示される
4. BookingCalendar で変更後の日時を選択
5. 変更後の利用料金がリアルタイム表示される
6. 「変更する」ボタンを押して確定
7. 完了後「再度オーナーの許諾をお待ちください。」というメッセージを表示

## コンポーネント設計

### ReservationEditForm

- **ベースコンポーネント**: BookingCalendar, PriceDisplay
- **Props**:
  | Prop | 型 | 必須 | 説明 |
  |------|---|------|------|
  | reservation | Reservation | Yes | 変更対象の予約情報 |
  | onSubmit | (update: ReservationUpdate) => Promise<void> | Yes | 変更実行コールバック |
- **状態**: 変更後の日時・利用料金
- **イベント**: onDateChange、onSubmit

## ティア完了条件（BDD）

```gherkin
Feature: 予約を変更する - 利用者向けフロントエンド

  Scenario: 変更後の日時を選択すると料金がリアルタイム更新される
    Given 利用者「田中太郎」が予約変更画面（rsv-001、3000円/時間）を開いた
    When BookingCalendar で2026-04-20を選択し、開始14:00・終了16:00を入力する
    Then 変更後利用料金「6,000円」がリアルタイムで表示される
```

---

## 共通コンポーネント参照

以下の共通コンポーネント（`@/components/common/` 配下）を使用する。
詳細な設計は `_cross-cutting/ux-ui/common-components.md` を参照。

| 共通コンポーネント | インポートパス | 用途 | Props マッピング |
|------------------|--------------|------|----------------|
| `ConfirmActionModal` | `@/components/common/ConfirmActionModal` | 予約変更確認ダイアログ | `variant: "default", title: "予約変更確認", description: "予約内容を変更します。", confirmLabel: "変更する", onConfirm: () => PATCH /reservations/:id` |
| `LoadingSkeleton` | `@/components/common/LoadingSkeleton` | 予約詳細の読み込み中 | `variant: "DetailSkeleton"` |
| `ErrorBanner` | `@/components/common/ErrorBanner` | API エラー表示 | `status: 409/5xx, message: エラーメッセージ` |
