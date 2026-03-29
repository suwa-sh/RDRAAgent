# 予約を申請する - バックエンド API 仕様

## 変更概要

予約申請 API を実装する。運用ルール準拠チェック・重複予約チェックを行い、予約レコードを「申請」状態で作成する。

## API 仕様

### 予約申請 API

- **メソッド**: POST
- **パス**: `/api/v1/reservations`
- **認証**: Bearer トークン（ログイン必須）
- **OpenAPI**: [openapi.yaml](../../_cross-cutting/api/openapi.yaml) の `paths./api/v1/reservations.post` を参照

#### リクエスト

| パラメータ | 型 | 必須 | 説明 |
|-----------|---|------|------|
| room_id | string | Yes | 会議室ID |
| start_datetime | string | Yes | 利用開始日時（ISO 8601, 例: 2026-04-15T10:00:00+09:00） |
| end_datetime | string | Yes | 利用終了日時（ISO 8601） |
| payment_method | string | Yes | 決済方法（credit_card/e_money） |

#### レスポンス

| フィールド | 型 | 説明 |
|-----------|---|------|
| reservation_id | string | 予約ID（UUID） |
| status | string | 予約状態（"申請"） |
| room_id | string | 会議室ID |
| start_datetime | string | 利用開始日時 |
| end_datetime | string | 利用終了日時 |
| fee | number | 利用料金（円） |
| payment_method | string | 決済方法 |

#### エラーレスポンス

| ステータスコード | 条件 | レスポンス |
|----------------|------|-----------|
| 400 | リクエストパラメータ不足・型エラー | `{"error": "bad request", "details": {...}}` |
| 401 | 未認証 | `{"error": "unauthorized"}` |
| 409 | 重複予約（同日時に確定予約存在） | `{"error": "reservation conflict: the slot is already booked"}` |
| 422 | 運用ルール違反（時間帯・最低/最大利用時間） | `{"error": "unprocessable entity", "reason": "outside available hours"}` |
| 500 | DB エラー | `{"error": "internal server error"}` |

## データモデル変更

### reservations テーブル（新規 INSERT）

| カラム | 型 | 説明 | 変更種別 |
|--------|---|------|---------|
| reservation_id | VARCHAR(36) | 予約ID（UUID） | 新規作成 |
| user_id | VARCHAR(36) | 利用者ID | 新規作成 |
| room_id | VARCHAR(36) | 会議室ID | 新規作成 |
| room_type | VARCHAR(20) | 会議室種別 | 新規作成 |
| start_datetime | TIMESTAMP WITH TZ | 利用開始日時 | 新規作成 |
| end_datetime | TIMESTAMP WITH TZ | 利用終了日時 | 新規作成 |
| status | VARCHAR(20) | 予約状態（申請/確定/変更/取消） | 新規作成 |
| fee | INTEGER | 利用料金（円） | 新規作成 |
| payment_method | VARCHAR(20) | 決済方法 | 新規作成 |
| created_at | TIMESTAMP WITH TZ | 作成日時 | 新規作成 |
| updated_at | TIMESTAMP WITH TZ | 更新日時 | 新規作成 |

## ビジネスルール

- 利用料金計算: `fee = price_per_hour × CEIL((end_datetime - start_datetime) / 3600)` （円単位切り上げ）
- 運用ルールチェック: 開始・終了が available_times 内、利用時間が min_hours〜max_hours 内
- 重複チェック: `SELECT 1 FROM reservations WHERE room_id=? AND status IN ('申請','確定','変更') AND start_datetime < end AND end_datetime > start`（SELECT FOR UPDATE で排他制御）
- 予約作成と同時に認可サービスへ `user:{user_id}, reservation:{reservation_id}` の関係性タプルを追加

## ティア完了条件（BDD）

```gherkin
Feature: 予約を申請する - バックエンド API

  Scenario: 正常な予約申請が申請状態で作成される
    Given 利用者ID「user-001」のトークンで、会議室「room-001」（3000円/時間）が公開中
    When POST /api/v1/reservations に {"room_id":"room-001","start_datetime":"2026-04-15T10:00:00+09:00","end_datetime":"2026-04-15T12:00:00+09:00","payment_method":"credit_card"} を送信する
    Then HTTP 201 と、status="申請"・fee=6000 の予約レスポンスが返る

  Scenario: 同日時に確定済み予約がある場合に409が返る
    Given 「room-001」の2026-04-15 10:00〜12:00 に確定状態の予約が存在する
    When POST /api/v1/reservations に同日時の予約申請を送信する
    Then HTTP 409 と {"error": "reservation conflict: the slot is already booked"} が返る
```
