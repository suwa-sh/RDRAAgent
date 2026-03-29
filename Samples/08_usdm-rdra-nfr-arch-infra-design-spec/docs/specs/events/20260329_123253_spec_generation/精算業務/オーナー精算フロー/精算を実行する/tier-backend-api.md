# 精算を実行する - バックエンドAPI仕様

## 変更概要

精算実行APIエンドポイントを追加する。精算計算済みの精算を受け付け、MQに精算支払連携イベントを発行して非同期処理を開始する。冪等性保証と二重支払防止を実装する。

## API 仕様

### 精算実行API

- **メソッド**: POST
- **パス**: `/api/v1/admin/settlements/{settlement_id}/execute`
- **認証**: OAuth2/OIDC Bearer Token（adminロール必須）
- **OpenAPI**: [openapi.yaml](../../_cross-cutting/api/openapi.yaml) の `paths./api/v1/admin/settlements/{settlement_id}/execute.post` を参照

#### リクエスト

| パラメータ | 型 | 必須 | 説明 |
|-----------|---|------|------|
| settlement_id（パス） | string | Yes | 精算ID |

ヘッダー:
- `X-Idempotency-Key`: 冪等キー（UUID v4、フロントエンドが生成）

ボディ: なし

#### レスポンス

| フィールド | 型 | 説明 |
|-----------|---|------|
| settlement_id | string | 精算ID |
| owner_settlement_id | string | オーナー精算ID（作成された） |
| status | string | 処理状態（支払処理中） |
| message_id | string | MQへ発行したメッセージID |

HTTPステータス: 202 Accepted（非同期処理受付）

#### エラーレスポンス

| ステータスコード | 条件 | レスポンス |
|----------------|------|-----------|
| 400 | 精算状態が「精算計算済み」以外 | `{"error": "invalid_settlement_status", "message": "精算計算済み状態の精算のみ実行できます"}` |
| 404 | 精算IDが存在しない | `{"error": "not_found"}` |
| 409 | 既に支払処理中または支払済み | `{"error": "already_processing", "message": "この精算は既に処理中または支払済みです"}` |
| 403 | adminロール以外 | `{"error": "forbidden"}` |

### 精算処理状態確認API

- **メソッド**: GET
- **パス**: `/api/v1/admin/settlements/{settlement_id}/execute/status`
- **認証**: OAuth2/OIDC Bearer Token（adminロール必須）
- **OpenAPI**: [openapi.yaml](../../_cross-cutting/api/openapi.yaml) の `paths./api/v1/admin/settlements/{settlement_id}/execute/status.get` を参照

#### レスポンス

| フィールド | 型 | 説明 |
|-----------|---|------|
| settlement_id | string | 精算ID |
| status | string | 精算状態（支払処理中/支払済み/支払失敗） |
| payment_completed_at | string\|null | 支払完了日時 |
| error_message | string\|null | エラー詳細（支払失敗時） |

## 非同期イベント

### 精算支払連携イベント（発行）

- **チャネル**: `settlement.payment.requested`
- **方向**: publish
- **AsyncAPI**: [asyncapi.yaml](../../_cross-cutting/api/asyncapi.yaml) の `channels.settlement.payment.requested` を参照

メッセージスキーマ:
| フィールド | 型 | 説明 |
|-----------|---|------|
| settlement_id | string | 精算ID |
| owner_id | string | オーナーID |
| payment_amount | integer | 支払金額（円） |
| idempotency_key | string | 決済機関への支払冪等キー |
| requested_at | string | 要求日時 |

## データモデル変更

### オーナー精算（owner_settlements テーブル）

| カラム | 型 | 説明 | 変更種別 |
|--------|---|------|---------|
| owner_settlement_id | VARCHAR(36) | 精算実行ID（PK） | 既存 |
| settlement_id | VARCHAR(36) | 精算ID（FK） | 既存 |
| payment_gateway_id | VARCHAR(100)\|NULL | 決済機関連携ID | 既存 |
| payment_amount | INTEGER | 支払金額（円） | 既存 |
| payment_date | DATE\|NULL | 支払日 | 既存 |
| payment_status | VARCHAR(20) | 支払状態（支払処理中/支払済み/支払失敗） | 追加 |
| idempotency_key | VARCHAR(36) | 冪等キー（UNIQUE制約） | 追加 |

## ビジネスルール

- 精算状態が「精算計算済み」のもののみ実行可能
- 精算実行時にオーナー精算レコードを作成し、MQへ精算支払連携イベントを発行する
- 決済機関への支払リクエストには冪等キーを付与する（SP-012: 冪等性確保）
- サーキットブレーカーを実装し、決済機関障害時の連鎖障害を防止する（SP-013）
- 全処理を監査ログに記録する（CTR-002、金銭取引）
- 冪等キー（X-Idempotency-Key）でAPIレベルの冪等性を保証する（CTP-012）

## ティア完了条件（BDD）

```gherkin
Feature: 精算を実行する - バックエンドAPI

  Scenario: 精算計算済みの精算を実行する
    Given adminロールの認証トークンが有効であり、SETTLE-001のstatus=精算計算済みが存在する
    When POST /api/v1/admin/settlements/SETTLE-001/execute にX-Idempotency-Key: IKEY-001でリクエストする
    Then HTTPステータス202でowner_settlement_idとstatus="支払処理中"が返され、MQにイベントが発行される

  Scenario: 未精算状態に精算実行すると400エラーになる
    Given SETTLE-002のstatus=未精算が存在する
    When POST /api/v1/admin/settlements/SETTLE-002/execute にリクエストする
    Then HTTPステータス400で {"error": "invalid_settlement_status"} が返される

  Scenario: 同一冪等キーで二重実行しても重複処理されない
    Given SETTLE-001が支払処理中であり、IKEY-001で既に実行済みである
    When POST /api/v1/admin/settlements/SETTLE-001/execute に同一IKEY-001で再送する
    Then HTTPステータス202で前回と同じowner_settlement_idが返され、MQへの重複発行はない
```
