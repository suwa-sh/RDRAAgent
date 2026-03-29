# 予約を変更する - バックエンド API 仕様

## 変更概要

予約変更 API を実装する。認可チェック・運用ルール・重複チェック後に予約状態を「確定→変更」に更新し、利用料金を再計算する。

## API 仕様

### 予約変更 API

- **メソッド**: PUT
- **パス**: `/api/v1/reservations/{reservation_id}`
- **認証**: Bearer トークン（利用者ロール必須）
- **OpenAPI**: [openapi.yaml](../../_cross-cutting/api/openapi.yaml) の `paths./api/v1/reservations/{reservation_id}.put` を参照

#### リクエスト

| パラメータ | 型 | 必須 | 説明 |
|-----------|---|------|------|
| reservation_id | string (path) | Yes | 予約ID |
| start_datetime | string | Yes | 変更後利用開始日時（ISO 8601） |
| end_datetime | string | Yes | 変更後利用終了日時（ISO 8601） |

#### レスポンス

| フィールド | 型 | 説明 |
|-----------|---|------|
| reservation_id | string | 予約ID |
| status | string | 更新後の予約状態（"変更"） |
| start_datetime | string | 変更後利用開始日時 |
| end_datetime | string | 変更後利用終了日時 |
| fee | number | 変更後利用料金（円） |

#### エラーレスポンス

| ステータスコード | 条件 | レスポンス |
|----------------|------|-----------|
| 401 | 未認証 | `{"error": "unauthorized"}` |
| 403 | 予約所有者以外 | `{"error": "forbidden: not your reservation"}` |
| 404 | 予約が存在しない | `{"error": "reservation not found"}` |
| 409 | 重複予約 | `{"error": "reservation conflict"}` |
| 422 | 運用ルール違反 | `{"error": "unprocessable entity", "reason": "..."}` |

## データモデル変更

### reservations テーブル（状態・日時・料金更新）

| カラム | 型 | 説明 | 変更種別 |
|--------|---|------|---------|
| status | VARCHAR(20) | 確定 → 変更 | 更新 |
| start_datetime | TIMESTAMP WITH TZ | 変更後開始日時 | 更新 |
| end_datetime | TIMESTAMP WITH TZ | 変更後終了日時 | 更新 |
| fee | INTEGER | 変更後利用料金 | 更新 |
| updated_at | TIMESTAMP WITH TZ | 更新日時 | 更新 |

## ビジネスルール

- 変更可能な予約: `status IN ('確定', '変更')` の予約のみ（再変更も可）
- 認可: `Check('user:{uid}', 'user', 'reservation:{reservation_id}')` で所有関係確認
- 運用ルールチェック・重複チェックは予約申請時と同じロジックを適用
- 料金再計算: `fee = price_per_hour × CEIL((new_end - new_start) / 3600)`

## ティア完了条件（BDD）

```gherkin
Feature: 予約を変更する - バックエンド API

  Scenario: 利用者が確定済み予約の日時を変更する
    Given 利用者 user-001 のトークン、予約 rsv-001（確定状態）が存在し会議室の時間単価は3000円
    When PUT /api/v1/reservations/rsv-001 に {"start_datetime":"2026-04-20T14:00:00+09:00","end_datetime":"2026-04-20T16:00:00+09:00"} を送信する
    Then HTTP 200 と status="変更"・fee=6000 のレスポンスが返る
```
