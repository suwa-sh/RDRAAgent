# 予約を許諾する - バックエンド API 仕様

## 変更概要

予約許諾 API を実装する。認可チェック後に予約状態を「申請→確定」に更新し、バーチャル会議室の場合は会議URL通知イベントを MQ に publish する。

## API 仕様

### 予約許諾 API

- **メソッド**: POST
- **パス**: `/api/v1/reservations/{reservation_id}/approve`
- **認証**: Bearer トークン（会議室オーナーロール必須）
- **OpenAPI**: [openapi.yaml](../../_cross-cutting/api/openapi.yaml) の `paths./api/v1/reservations/{reservation_id}/approve.post` を参照

#### リクエスト

| パラメータ | 型 | 必須 | 説明 |
|-----------|---|------|------|
| reservation_id | string (path) | Yes | 予約ID |

#### レスポンス

| フィールド | 型 | 説明 |
|-----------|---|------|
| reservation_id | string | 予約ID |
| status | string | 更新後の予約状態（"確定"） |
| updated_at | string | 更新日時 |

#### エラーレスポンス

| ステータスコード | 条件 | レスポンス |
|----------------|------|-----------|
| 401 | 未認証 | `{"error": "unauthorized"}` |
| 403 | オーナーと会議室の所有関係不一致 | `{"error": "forbidden: not your room"}` |
| 404 | 予約が存在しない | `{"error": "reservation not found"}` |
| 409 | 予約状態が「申請」以外 | `{"error": "conflict: reservation is not in pending status"}` |

## 非同期イベント（バーチャル会議室の場合）

### 会議URL通知イベント

- **チャネル**: `reservation.approved.virtual`
- **方向**: publish
- **AsyncAPI**: [asyncapi.yaml](../../_cross-cutting/api/asyncapi.yaml) の `channels.reservation.approved.virtual` を参照

## データモデル変更

### reservations テーブル（状態更新）

| カラム | 型 | 説明 | 変更種別 |
|--------|---|------|---------|
| status | VARCHAR(20) | 申請 → 確定 | 更新 |
| updated_at | TIMESTAMP WITH TZ | 更新日時 | 更新 |

## ビジネスルール

- 許諾可能な予約: `status = '申請'` の予約のみ
- 認可: `Check('owner:{uid}', 'owner', 'room:{room_id}')` で所有関係を確認
- バーチャル会議室の場合: 確定後に `reservation.approved.virtual` イベントを MQ に publish
- 楽観的ロック: `UPDATE WHERE status='申請'` で同時許諾を防止（0件更新時は 409 を返す）

## ティア完了条件（BDD）

```gherkin
Feature: 予約を許諾する - バックエンド API

  Scenario: オーナーが自分の会議室の予約を許諾する
    Given 会議室オーナーID「owner-001」のトークン、予約 rsv-001（申請状態、room-001 はオーナーの所有）が存在
    When POST /api/v1/reservations/rsv-001/approve を送信する
    Then HTTP 200 と status="確定" のレスポンスが返り、reservations テーブルの rsv-001 が確定状態になる

  Scenario: バーチャル会議室の予約許諾後に会議URL通知イベントが発行される
    Given 会議室オーナーID「owner-001」のトークン、バーチャル会議室の予約 rsv-002（申請状態）が存在
    When POST /api/v1/reservations/rsv-002/approve を送信する
    Then HTTP 200 と status="確定" が返り、MQ に reservation.approved.virtual イベントが publish される
```
