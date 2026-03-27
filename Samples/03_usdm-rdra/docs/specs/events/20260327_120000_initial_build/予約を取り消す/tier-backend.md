# 予約を取り消す - バックエンド仕様

## 変更概要

予約取消APIを新規作成する。予約状態を「取消」に遷移し、キャンセルポリシーに基づくキャンセル料を計算して返却する。

## API 仕様

### 予約取消API

- **メソッド**: POST
- **パス**: /api/reservations/{reservation_id}/cancel
- **認証**: Bearer トークン（利用者）

#### リクエスト

パラメータなし。

#### レスポンス

| フィールド | 型 | 説明 |
|-----------|---|------|
| reservation_id | string | 予約ID |
| room_id | string | 会議室ID |
| status | string | 予約状態（「取消」） |
| cancellation_fee | number | キャンセル料 |
| cancellation_fee_rate | number | キャンセル料率（%） |
| refund_amount | number | 返金額 |
| cancelled_at | datetime | 取消日時 |

### キャンセル料計算API

- **メソッド**: GET
- **パス**: /api/reservations/{reservation_id}/cancellation-fee
- **認証**: Bearer トークン（利用者）

#### レスポンス

| フィールド | 型 | 説明 |
|-----------|---|------|
| cancellation_fee | number | キャンセル料 |
| cancellation_fee_rate | number | キャンセル料率（%） |
| cancel_deadline | datetime | キャンセル期限 |
| is_within_deadline | boolean | キャンセル期限内かどうか |

## データモデル変更

既存の予約情報テーブルおよびキャンセルポリシーテーブルを使用。追加カラムなし。

## ビジネスルール

- 予約状態が「申請」「確定」「変更」の場合に取消可能
- 予約状態が「取消」の場合は取消不可
- キャンセル料はキャンセルポリシーに基づき計算する
  - キャンセル期限より前の取消: キャンセル料なし
  - キャンセル期限以降の取消: キャンセル料率に基づくキャンセル料が発生
- 「申請」状態からの取消はキャンセル料なし（オーナー未許諾のため）
- 返金額 = 利用料金 - キャンセル料

## ティア完了条件（BDD）

```gherkin
Feature: 予約を取り消す - バックエンド

  Scenario: 確定済み予約をキャンセル期限前に取り消す
    Given 予約「R001」が「確定」状態で存在する（利用日: 2026-04-20、利用料金: 4,000円）
    And キャンセルポリシーのキャンセル期限が利用日の3日前
    And 現在日が「2026-04-15」である
    When POST /api/reservations/R001/cancel をリクエストする
    Then ステータスコード200が返される
    And レスポンスの status が「取消」である
    And レスポンスの cancellation_fee が 0 である

  Scenario: 確定済み予約をキャンセル期限後に取り消す
    Given 予約「R001」が「確定」状態で存在する（利用日: 2026-04-20、利用料金: 4,000円）
    And キャンセルポリシーのキャンセル期限が利用日の3日前、キャンセル料率が50%である
    And 現在日が「2026-04-18」である
    When POST /api/reservations/R001/cancel をリクエストする
    Then ステータスコード200が返される
    And レスポンスの status が「取消」である
    And レスポンスの cancellation_fee が 2000 である

  Scenario: 申請状態の予約を取り消す
    Given 予約「R002」が「申請」状態で存在する
    When POST /api/reservations/R002/cancel をリクエストする
    Then ステータスコード200が返される
    And レスポンスの cancellation_fee が 0 である

  Scenario: 取消済みの予約を再度取り消そうとするとエラーを返す
    Given 予約「R004」が「取消」状態で存在する
    When POST /api/reservations/R004/cancel をリクエストする
    Then ステータスコード400が返される
    And エラーメッセージ「この予約は既に取り消されています」が返される
```
