# 予約を取り消す - バックエンド API 仕様

## 変更概要

予約取消 API を実装する。キャンセルポリシーに基づきキャンセル料を計算し、予約状態を「取消」に更新する。

## API 仕様

### 予約取消 API

- **メソッド**: DELETE
- **パス**: `/api/v1/reservations/{reservation_id}`
- **認証**: Bearer トークン（利用者ロール必須）
- **OpenAPI**: [openapi.yaml](../../_cross-cutting/api/openapi.yaml) の `paths./api/v1/reservations/{reservation_id}.delete` を参照

#### リクエスト

| パラメータ | 型 | 必須 | 説明 |
|-----------|---|------|------|
| reservation_id | string (path) | Yes | 予約ID |

#### レスポンス

| フィールド | 型 | 説明 |
|-----------|---|------|
| reservation_id | string | 予約ID |
| status | string | 更新後の予約状態（"取消"） |
| cancel_fee | number | キャンセル料（円、0の場合あり） |
| cancelled_at | string | 取消日時 |

#### エラーレスポンス

| ステータスコード | 条件 | レスポンス |
|----------------|------|-----------|
| 401 | 未認証 | `{"error": "unauthorized"}` |
| 403 | 予約所有者以外 | `{"error": "forbidden: not your reservation"}` |
| 404 | 予約が存在しない | `{"error": "reservation not found"}` |
| 409 | 既に取消済み | `{"error": "conflict: already cancelled"}` |

## データモデル変更

### reservations テーブル（状態・キャンセル料更新）

| カラム | 型 | 説明 | 変更種別 |
|--------|---|------|---------|
| status | VARCHAR(20) | →取消 | 更新 |
| cancel_fee | INTEGER | キャンセル料（円） | 追加 |
| cancelled_at | TIMESTAMP WITH TZ | 取消日時 | 追加 |

## ビジネスルール

- 取消可能な予約: `status IN ('申請', '確定', '変更')` の予約のみ
- キャンセル料計算: `現在日時 >= 利用開始日時 - cancel_policy.deadline_hours × 時間` の場合、`cancel_fee = fee × fee_rate`
- 申請状態の予約のキャンセル: キャンセル料 = 0（まだ確定前のため）
- キャンセルポリシーが未設定の場合: キャンセル料 = 0

## ティア完了条件（BDD）

```gherkin
Feature: 予約を取り消す - バックエンド API

  Scenario: キャンセル期限前の取消でキャンセル料が0円になる
    Given 利用者 user-001 のトークン、予約 rsv-001（確定状態、利用料金6000円）が存在し、現在日時はキャンセル期限の25時間前
    When DELETE /api/v1/reservations/rsv-001 を送信する
    Then HTTP 200 と status="取消"・cancel_fee=0 のレスポンスが返る

  Scenario: キャンセル期限後の取消でキャンセル料が発生する
    Given 利用者 user-001 のトークン、予約 rsv-001（確定状態、利用料金6000円、キャンセル料率50%）が存在し、現在日時はキャンセル期限の1時間後
    When DELETE /api/v1/reservations/rsv-001 を送信する
    Then HTTP 200 と status="取消"・cancel_fee=3000 のレスポンスが返る
```
