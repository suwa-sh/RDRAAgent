# バーチャル会議室利用を終了する - バックエンド API 仕様

## 変更概要

CronJobワーカー専用の内部APIエンドポイントを追加する。バーチャル会議室の利用終了処理を冪等に実行し、会議室利用レコードを「利用終了」状態に更新する。

## API 仕様

### バーチャル会議室利用終了（内部用）

- **メソッド**: POST
- **パス**: `/internal/v1/virtual-usages/end`
- **認証**: サービスアカウント認証（CronJobからのクラスター内部呼び出し）
- **OpenAPI**: 内部API（外部公開しない。openapi.yaml には含めない）

#### リクエスト

| パラメータ | 型 | 必須 | 説明 |
|-----------|---|------|------|
| usageId (body) | string | Yes | 会議室利用ID（利用終了処理対象） |

#### レスポンス

| フィールド | 型 | 説明 |
|-----------|---|------|
| usageId | string | 会議室利用ID |
| endedAt | string | 利用終了日時 (ISO 8601) |
| usageMinutes | integer | 実利用時間（分、切り捨て） |
| alreadyEnded | boolean | 既に利用終了済みの場合はtrue（冪等処理） |

#### エラーレスポンス

| ステータスコード | 条件 | レスポンス |
|----------------|------|-----------|
| 400 | 会議室利用の会議室種別が「バーチャル」以外 | `{ "error": "not a virtual room usage" }` |
| 404 | usageIdの会議室利用が存在しない | `{ "error": "usage not found" }` |
| 422 | 会議室利用状態が「利用中」以外かつ「利用終了」以外 | `{ "error": "invalid usage status" }` |

## データモデル変更

### 会議室利用 (room_usages)

| カラム | 型 | 説明 | 変更種別 |
|--------|---|------|---------|
| usage_id | VARCHAR(36) | 利用ID | 既存 |
| usage_status | VARCHAR(20) | 利用状態（利用中→利用終了） | 既存（更新） |
| ended_at | TIMESTAMP | 利用終了日時（サーバー時刻） | 既存（更新） |
| usage_minutes | INTEGER | 実利用時間（分、切り捨て） | 既存（更新） |

## ビジネスルール

- 会議室利用状態が「利用終了」の場合は alreadyEnded: true で200を返す（冪等処理）
- 実利用時間は（ended_at - started_at）を分単位で計算し小数点以下切り捨て
- SELECT FOR UPDATE でロックを取得してから状態確認・更新を行い、CronJobの並列実行による二重更新を防ぐ
- 利用終了日時はAPIサーバーのサーバー時刻を使用する
- 内部エンドポイント（/internal/）は API Gateway を経由せず、クラスター内部ネットワークからのみアクセス可能とする

## ティア完了条件（BDD）

```gherkin
Feature: バーチャル会議室利用を終了する - バックエンド API

  Scenario: 利用中のバーチャル会議室利用U-002を終了状態に更新する
    Given バーチャル会議室の会議室利用U-002（利用状態: 利用中、利用開始日時: 14:00）が存在する
    When POST /internal/v1/virtual-usages/end { usageId: "U-002" } をリクエストする
    Then 200 OK で { usageId: "U-002", endedAt: "2026-04-01T16:01:00Z", usageMinutes: 121, alreadyEnded: false } が返され、会議室利用状態が「利用終了」に更新される

  Scenario: すでに利用終了済みの会議室利用への冪等リクエストで既存レコードを返す
    Given バーチャル会議室の会議室利用U-002がすでに「利用終了」状態である
    When POST /internal/v1/virtual-usages/end { usageId: "U-002" } を再リクエストする
    Then 200 OK で { usageId: "U-002", alreadyEnded: true } が返され、レコードの更新は行われない
```
