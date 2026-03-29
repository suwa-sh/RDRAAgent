# 会議室を評価する - バックエンド API 仕様

## 変更概要

会議室評価登録 API を実装する。利用済みチェック・重複評価チェック後に評価を登録し、会議室の avg_rating を更新する。

## API 仕様

### 会議室評価登録 API

- **メソッド**: POST
- **パス**: `/api/v1/reviews`
- **認証**: Bearer トークン（利用者ロール必須）
- **OpenAPI**: [openapi.yaml](../../_cross-cutting/api/openapi.yaml) の `paths./api/v1/reviews.post` を参照

#### リクエスト

| パラメータ | 型 | 必須 | 説明 |
|-----------|---|------|------|
| review_type | string | Yes | 評価種別（room/owner）|
| room_id | string | Yes | 会議室ID |
| reservation_id | string | Yes | 予約ID（利用済みチェック用） |
| score | integer | Yes | 評価スコア（1〜5） |
| comment | string | No | コメント（最大500文字） |

#### レスポンス

| フィールド | 型 | 説明 |
|-----------|---|------|
| review_id | string | 評価ID |
| review_type | string | 評価種別（room） |
| score | integer | 評価スコア |
| created_at | string | 登録日時 |

#### エラーレスポンス

| ステータスコード | 条件 | レスポンス |
|----------------|------|-----------|
| 400 | スコアが1〜5の範囲外 | `{"error": "score must be 1-5"}` |
| 401 | 未認証 | `{"error": "unauthorized"}` |
| 403 | 利用していない会議室 | `{"error": "forbidden: you have not used this room"}` |
| 409 | 同一利用に対する重複評価 | `{"error": "conflict: already reviewed"}` |

## データモデル変更

### room_reviews テーブル（新規 INSERT）

| カラム | 型 | 説明 | 変更種別 |
|--------|---|------|---------|
| review_id | VARCHAR(36) | 評価ID（UUID） | 追加 |
| user_id | VARCHAR(36) | 利用者ID | 追加 |
| room_id | VARCHAR(36) | 会議室ID | 追加 |
| owner_id | VARCHAR(36) | オーナーID | 追加 |
| room_type | VARCHAR(20) | 会議室種別 | 追加 |
| review_type | VARCHAR(20) | 評価種別（room/owner） | 追加 |
| reservation_id | VARCHAR(36) | 予約ID（重複防止用） | 追加 |
| score | INTEGER | 評価スコア（1〜5） | 追加 |
| comment | TEXT | コメント | 追加 |
| created_at | TIMESTAMP WITH TZ | 登録日時 | 追加 |

### rooms テーブル（avg_rating 更新）

| カラム | 型 | 説明 | 変更種別 |
|--------|---|------|---------|
| avg_rating | DECIMAL(3,1) | 平均評価スコア | 更新 |

## ビジネスルール

- 評価可能な利用者: `room_usages WHERE user_id=? AND room_id=? AND status='利用終了'` が存在すること
- 重複チェック: `room_reviews WHERE reservation_id=? AND review_type='room'` が存在しないこと
- avg_rating 更新: `UPDATE rooms SET avg_rating=AVG(score) FROM room_reviews WHERE room_id=?`

## ティア完了条件（BDD）

```gherkin
Feature: 会議室を評価する - バックエンド API

  Scenario: 利用済み会議室の評価が正常に登録される
    Given 利用者 user-001 のトークン、予約 rsv-001 が利用終了済みで、room-001 の評価が未登録
    When POST /api/v1/reviews に {"review_type":"room","room_id":"room-001","reservation_id":"rsv-001","score":4,"comment":"設備が充実していた"} を送信する
    Then HTTP 201 と評価IDを含むレスポンスが返り、rooms.avg_rating が更新される

  Scenario: 利用していない会議室への評価は拒否される
    Given 利用者 user-001 のトークン、room-B を利用した履歴がない
    When POST /api/v1/reviews に {"review_type":"room","room_id":"room-B","reservation_id":"rsv-999","score":5} を送信する
    Then HTTP 403 と {"error": "forbidden: you have not used this room"} が返る
```
