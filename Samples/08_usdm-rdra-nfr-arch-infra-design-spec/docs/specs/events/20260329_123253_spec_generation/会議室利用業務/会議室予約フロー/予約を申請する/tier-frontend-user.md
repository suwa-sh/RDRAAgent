# 予約を申請する - 利用者・オーナー向けフロントエンド仕様

## 変更概要

予約申請画面を実装する。BookingCalendar で空き状況を表示しながら日時を選択し、利用料金をリアルタイム計算して表示する。決済方法の確認・設定フローへの誘導も担う。

## 画面仕様

### 予約申請画面

- **URL**: `/rooms/{room_id}/reserve`
- **アクセス権**: 利用者（ログイン必須）
- **ポータル**: user

#### 表示要素とコンポーネントマッピング

| 要素 | 種別 | デザインシステムコンポーネント | 説明 |
|------|------|------------------------------|------|
| 予約カレンダー | フォーム | BookingCalendar | 月単位の空き状況表示・日時選択（available/booked/selected/disabled） |
| 利用時間選択 | フォーム | Input (type=time) | 開始時間・終了時間の入力 |
| 利用料金表示 | テキスト | PriceDisplay | 時間単価×利用時間のリアルタイム計算 |
| 運用ルール概要 | カード | Card | 利用可能時間帯・最低/最大利用時間の参照表示 |
| 決済方法確認 | バッジ | Badge (variant=success/warning) | 設定済み(success)/未設定(warning)の表示 |
| 「申請する」ボタン | ボタン | Button (variant=primary, size=lg) | 予約申請実行 |
| 戻るボタン | ボタン | Button (variant=ghost) | 会議室詳細画面に戻る |

#### デザイントークン参照

| 用途 | トークン | 値 |
|------|---------|---|
| 背景色 | var(--semantic-background) | #FFFFFF |
| アクセント | var(--portal-primary) | #2563EB |
| 成功（決済設定済み） | var(--semantic-success) | #16A34A |
| 警告（決済未設定） | var(--semantic-warning) | #F97316 |

#### UIロジック

- **状態管理**: 選択日時・利用料金（派生値）・決済方法状態
- **バリデーション（フロント）**:
  - 利用開始日時 > 現在日時 + 1時間
  - 終了 > 開始、かつ最低/最大利用時間の範囲内
  - 利用可能時間帯内であること
- **リアルタイム計算**: 日時変更のたびに「利用料金 = 時間単価 × 利用時間」を計算して PriceDisplay を更新
- **ローディング**: 申請ボタン押下後はスピナー表示・ボタン無効化（二重送信防止）
- **エラーハンドリング**: サーバーエラー（409, 422）はトースト通知で表示

#### 操作フロー

1. 会議室詳細画面から「予約する」ボタンをクリック
2. 予約申請画面に遷移（/rooms/{room_id}/reserve）
3. BookingCalendar で利用日を選択
4. 開始時間・終了時間を入力
5. 利用料金がリアルタイムで表示される
6. 決済方法が未設定の場合は警告バッジを表示し「決済方法を設定する」リンクを表示
7. 「申請する」ボタンを押す
8. 申請完了メッセージが表示され、予約一覧画面へ遷移

## コンポーネント設計

### ReservationForm

- **ベースコンポーネント**: BookingCalendar
- **Props**:
  | Prop | 型 | 必須 | 説明 |
  |------|---|------|------|
  | roomId | string | Yes | 会議室ID |
  | pricePerHour | number | Yes | 時間単価 |
  | operationRule | OperationRule | Yes | 運用ルール（バリデーション用） |
  | onSubmit | (reservation: ReservationInput) => Promise<void> | Yes | 申請実行コールバック |
- **状態**: 選択日時（selectedDate, startTime, endTime）・計算された利用料金
- **イベント**: onDateSelect、onTimeChange、onSubmit

## ティア完了条件（BDD）

```gherkin
Feature: 予約を申請する - 利用者向けフロントエンド

  Scenario: カレンダーで日時を選択すると利用料金がリアルタイム表示される
    Given 利用者「田中太郎」が予約申請画面を開いており、時間単価が3000円/時間
    When BookingCalendar で2026-04-15を選択し、開始10:00・終了12:00を入力する
    Then 利用料金「6,000円」がリアルタイムで表示される

  Scenario: 決済方法が未設定の場合に警告が表示される
    Given 利用者「佐藤花子」が決済方法未設定で予約申請画面を開いている
    When 画面が表示される
    Then 「決済方法が設定されていません」という警告バッジと「決済方法を設定する」リンクが表示される

  Scenario: 申請ボタン押下後に二重送信が防止される
    Given 利用者「鈴木一郎」が予約申請フォームを入力済みで「申請する」ボタンを押した
    When ボタンを連続して2回クリックする
    Then 2回目のクリックは無効化されリクエストが1回のみ送信される
```

---

## 共通コンポーネント参照

以下の共通コンポーネント（`@/components/common/` 配下）を使用する。
詳細な設計は `_cross-cutting/ux-ui/common-components.md` を参照。

| 共通コンポーネント | インポートパス | 用途 | Props マッピング |
|------------------|--------------|------|----------------|
| `LoadingSkeleton` | `@/components/common/LoadingSkeleton` | 予約フォームの読み込み中 | `variant: "FormSkeleton"` |
| `ErrorBanner` | `@/components/common/ErrorBanner` | API エラー表示 | `status: 409/5xx, message: エラーメッセージ` |
