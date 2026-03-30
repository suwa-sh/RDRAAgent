# 予約を登録する - バックエンド API 仕様

## 変更概要

予約登録APIを実装する。冪等キーによる重複防止、予約状態の仮予約への遷移、決済情報の保存を行う。

## API 仕様

### 予約登録 API

- **メソッド**: POST
- **パス**: /api/v1/reservations
- **認証**: Bearer JWT（利用者ロール）
- **OpenAPI**: [openapi.yaml](../../_cross-cutting/api/openapi.yaml) の `paths./api/v1/reservations.post` を参照

#### リクエスト

| パラメータ | 型 | 必須 | 説明 |
|-----------|---|------|------|
| roomId | string | Yes | 会議室ID |
| startAt | string(date-time) | Yes | 利用開始日時 |
| endAt | string(date-time) | Yes | 利用終了日時 |
| paymentMethod | string | Yes | 決済方法（クレジットカード/電子マネー） |
| cardNumber | string | No | カード番号（クレジットカードの場合必須） |

#### レスポンス

| フィールド | 型 | 説明 |
|-----------|---|------|
| id | string | 予約ID |
| roomId | string | 会議室ID |
| roomName | string | 会議室名 |
| startAt | string(date-time) | 利用開始日時 |
| endAt | string(date-time) | 利用終了日時 |
| status | string | 予約状態（仮予約） |
| totalPrice | integer | 利用料金（円） |
| paymentMethod | string | 決済方法 |

#### エラーレスポンス

| ステータスコード | 条件 | レスポンス |
|----------------|------|-----------|
| 400 | startAt が過去 | {"code": "INVALID_DATE", "message": "過去の日時は指定できません"} |
| 400 | startAt >= endAt | {"code": "INVALID_TIME_RANGE", "message": "終了日時は開始日時より後にしてください"} |
| 404 | roomId が存在しない | {"code": "ROOM_NOT_FOUND", "message": "指定された会議室が見つかりません"} |
| 409 | 同一時間帯に既存予約あり | {"code": "TIME_CONFLICT", "message": "指定の時間帯は既に予約されています"} |

## データモデル変更

### reservations テーブル

| カラム | 型 | 説明 | 変更種別 |
|--------|---|------|---------|
| id | VARCHAR(36) | 予約ID（UUID） | 追加 |
| user_id | VARCHAR(36) | 利用者ID（FK） | 追加 |
| room_id | VARCHAR(36) | 会議室ID（FK） | 追加 |
| start_at | TIMESTAMP | 利用開始日時 | 追加 |
| end_at | TIMESTAMP | 利用終了日時 | 追加 |
| status | VARCHAR(20) | 予約状態 | 追加 |
| total_price | INTEGER | 利用料金（円） | 追加 |
| idempotency_key | VARCHAR(36) | 冪等キー（UNIQUE） | 追加 |
| created_at | TIMESTAMP | 作成日時 | 追加 |

### payments テーブル

| カラム | 型 | 説明 | 変更種別 |
|--------|---|------|---------|
| id | VARCHAR(36) | 決済ID（UUID） | 追加 |
| reservation_id | VARCHAR(36) | 予約ID（FK） | 追加 |
| user_id | VARCHAR(36) | 利用者ID（FK） | 追加 |
| payment_method | VARCHAR(20) | 決済方法 | 追加 |
| card_number_encrypted | VARCHAR(256) | カード番号（暗号化） | 追加 |
| status | VARCHAR(20) | 決済状況 | 追加 |

## ビジネスルール

- 予約は冪等キーで重複防止（X-Idempotency-Key ヘッダー）
- 同一会議室・同一時間帯の二重予約を排他制御で防止
- カード番号は保管時に暗号化（NFR E.6.1.1）
- 利用料金 = 会議室.価格(円/時間) x 利用時間(時間)

## ティア完了条件（BDD）

```gherkin
Feature: 予約を登録する - バックエンド API

  Scenario: 正常に予約を登録する
    Given 会議室「新宿会議室A」(ID: room-001)が価格3000円/時間で登録済み
    When POST /api/v1/reservations に roomId=room-001, startAt=2026-04-15T10:00:00, endAt=2026-04-15T12:00:00, paymentMethod=クレジットカード をリクエストする
    Then HTTP 201 が返る
    And status が「仮予約」である
    And totalPrice が 6000 である

  Scenario: 冪等キー重複で同一レスポンスを返す
    Given 冪等キー「key-001」で予約が登録済み
    When 同じ冪等キー「key-001」で POST /api/v1/reservations をリクエストする
    Then HTTP 201 が返る
    And 1回目と同一の予約IDが返る

  Scenario: 時間帯重複でコンフリクトエラー
    Given 会議室「room-001」に2026-04-15T10:00-12:00の予約が存在する
    When 同じ会議室・同じ時間帯で予約を登録する
    Then HTTP 409 が返る
    And code が「TIME_CONFLICT」である
```
