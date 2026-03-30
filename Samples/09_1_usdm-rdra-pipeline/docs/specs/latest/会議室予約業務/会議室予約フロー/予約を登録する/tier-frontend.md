# 予約を登録する - フロントエンド仕様

## 変更概要

利用者向けポータルに予約登録画面を実装する。BookingCalendar で日時選択、決済方法選択、予約確認を行う。

## 画面仕様

### 予約登録画面

- **URL**: /rooms/:id/reserve
- **アクセス権**: 利用者
- **ポータル**: user

#### 表示要素とコンポーネントマッピング

| 要素 | 種別 | デザインシステムコンポーネント | 説明 |
|------|------|------------------------------|------|
| カレンダー | 日時選択 | BookingCalendar | 予約日時の選択 |
| 予約状態 | バッジ | ReservationStatusBadge | 予約状態表示 |
| 料金表示 | テキスト | PriceDisplay | 利用料金の表示 |
| 決済方法 | ラジオ | Input + Button | クレジットカード/電子マネー選択 |
| 予約ボタン | ボタン | Button (default) | 予約確定アクション |

#### デザイントークン参照

| 用途 | トークン | 値 |
|------|---------|---|
| 背景色 | var(--semantic-background) | #FFFFFF |
| アクセント | var(--color-blue-600) | #2563EB |
| 成功色 | var(--semantic-success) | var(--color-green-600) |

#### UIロジック

- **状態管理**: selectedDate, selectedTimeSlot, paymentMethod, isSubmitting
- **バリデーション**: 日時が未来であること、決済方法が選択済みであること
- **ローディング**: 予約送信中はボタンを disabled + スピナー表示（ダブルクリック防止）
- **エラーハンドリング**: バリデーションエラーはインライン表示、APIエラーはトースト表示

#### 操作フロー

1. 会議室検索画面から遷移し、会議室情報を表示
2. BookingCalendar で予約日時を選択
3. 利用料金が自動計算・表示される
4. 決済方法を選択（クレジットカード or 電子マネー）
5. 「予約する」ボタンで確認ダイアログ表示
6. 確認後に予約APIを呼び出し（冪等キー付き）
7. 完了画面で ReservationStatusBadge(仮予約) を表示

## コンポーネント設計

### ReservationForm

- **ベースコンポーネント**: BookingCalendar + Input + Button
- **Props**:
  | Prop | 型 | 必須 | 説明 |
  |------|---|------|------|
  | roomId | string | Yes | 予約対象の会議室ID |
  | roomPrice | number | Yes | 会議室の時間単価 |
  | availableDates | Date[] | Yes | 予約可能日一覧 |
  | onSubmit | (data: ReservationData) => void | Yes | 予約送信コールバック |
- **状態**: selectedDate, timeSlot, paymentMethod, isSubmitting
- **イベント**: onSubmit

## ティア完了条件（BDD）

```gherkin
Feature: 予約を登録する - フロントエンド

  Scenario: 予約登録画面の表示
    Given 利用者「田中太郎」がログイン済み
    When 会議室「新宿会議室A」の予約登録画面（/rooms/room-001/reserve）にアクセスする
    Then BookingCalendar が表示される
    And 会議室名「新宿会議室A」と価格「3,000円/時間」が表示される

  Scenario: 予約送信時のダブルクリック防止
    Given 予約フォームに日時と決済方法を入力済み
    When 「予約する」ボタンをクリックする
    Then ボタンが disabled になりスピナーが表示される
    And 2回目のクリックは無視される
```
