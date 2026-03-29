# バーチャル会議室利用を開始する - バックエンド API 仕様

## 変更概要

CronJobワーカー専用の内部APIエンドポイントを追加する。バーチャル会議室の利用開始処理を冪等に実行し、会議室利用レコードを「利用開始」状態で作成する。CronJobからのみ呼び出される内部エンドポイント。

## API 仕様

### バーチャル会議室利用開始（内部用）

- **メソッド**: POST
- **パス**: `/internal/v1/virtual-usages/start`
- **認証**: サービスアカウント認証（CronJobからのクラスター内部呼び出し）
- **OpenAPI**: 内部API（外部公開しない。openapi.yaml には含めない）

#### リクエスト

| パラメータ | 型 | 必須 | 説明 |
|-----------|---|------|------|
| reservationId (body) | string | Yes | 利用開始処理の対象予約ID |

#### レスポンス

| フィールド | 型 | 説明 |
|-----------|---|------|
| reservationId | string | 予約ID |
| usageId | string | 会議室利用ID（新規作成または既存） |
| startedAt | string | 利用開始日時 (ISO 8601) |
| alreadyStarted | boolean | 既に利用開始済みの場合はtrue（冪等処理） |

#### エラーレスポンス

| ステータスコード | 条件 | レスポンス |
|----------------|------|-----------|
| 400 | 予約の会議室種別が「バーチャル」以外 | `{ "error": "not a virtual room reservation" }` |
| 404 | 予約IDが存在しない | `{ "error": "reservation not found" }` |
| 422 | 予約状態が「確定」以外 | `{ "error": "reservation not confirmed" }` |

## データモデル変更

### 会議室利用 (room_usages)

| カラム | 型 | 説明 | 変更種別 |
|--------|---|------|---------|
| usage_id | VARCHAR(36) | 利用ID (UUID) | 既存 |
| reservation_id | VARCHAR(36) | 予約ID (UNIQUE制約で冪等性確保) | 既存 |
| room_id | VARCHAR(36) | 会議室ID | 既存 |
| user_id | VARCHAR(36) | 利用者ID | 既存 |
| usage_status | VARCHAR(20) | 利用状態（利用開始） | 既存 |
| started_at | TIMESTAMP | 利用開始日時 | 既存 |

## ビジネスルール

- reservation_id に UNIQUE 制約を付与して同一予約への重複利用開始レコード作成を防ぐ（DB レベルの冪等性保証）
- SELECT FOR UPDATE で既存レコードを確認後、なければ INSERT することで冪等処理を実現する
- 利用開始日時は API サーバーのサーバー時刻を使用する
- 内部エンドポイント（/internal/）は API Gateway を経由せず、クラスター内部ネットワークからのみアクセス可能とする

## ティア完了条件（BDD）

```gherkin
Feature: バーチャル会議室利用を開始する - バックエンド API

  Scenario: 確定済みのバーチャル会議室予約R-002の利用を開始する
    Given バーチャル会議室予約R-002（状態: 確定）が存在し、会議室利用レコードが未作成である
    When POST /internal/v1/virtual-usages/start { reservationId: "R-002" } をリクエストする
    Then 200 OK で { usageId: "U-002", startedAt: "2026-04-01T14:01:00Z", alreadyStarted: false } が返され、会議室利用レコードが「利用開始」状態で作成される

  Scenario: すでに利用開始済みの予約に対する冪等リクエストで既存レコードを返す
    Given バーチャル会議室予約R-002の会議室利用レコードがすでに「利用開始」状態で存在する（usageId: "U-002"）
    When POST /internal/v1/virtual-usages/start { reservationId: "R-002" } を再リクエストする
    Then 200 OK で { usageId: "U-002", alreadyStarted: true } が返され、新規レコードは作成されない
```
