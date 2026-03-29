# 鍵の貸出を記録する - バックエンド API 仕様

## 変更概要

鍵貸出記録 API を追加する。会議室利用ポリシーに基づき、鍵状態「保管中」確認後に鍵状態を「貸出中」に更新し、会議室利用レコードを「利用開始」状態で作成する。鍵状態更新と会議室利用レコード作成は同一トランザクションで行う。

## API 仕様

### 鍵貸出記録

- **メソッド**: POST
- **パス**: `/api/v1/rentals/{rentalId}/key-out`
- **認証**: Bearer Token (OAuth2/OIDC)
- **OpenAPI**: [openapi.yaml](../../_cross-cutting/api/openapi.yaml) の `paths./api/v1/rentals/{rentalId}/key-out.post` を参照

#### リクエスト

| パラメータ | 型 | 必須 | 説明 |
|-----------|---|------|------|
| rentalId (path) | string | Yes | 予約ID |

#### レスポンス

| フィールド | 型 | 説明 |
|-----------|---|------|
| rentalId | string | 予約ID |
| keyId | string | 鍵ID |
| keyStatus | string | 更新後の鍵状態（"貸出中"） |
| usageId | string | 会議室利用ID（新規作成） |
| usageStatus | string | 会議室利用状態（"利用開始"） |
| lentAt | string | 貸出日時 (ISO 8601) |

#### エラーレスポンス

| ステータスコード | 条件 | レスポンス |
|----------------|------|-----------|
| 400 | バーチャル会議室への鍵貸出試行 | `{ "error": "key-out not allowed for virtual rooms" }` |
| 403 | オーナーと会議室の認可チェック失敗 | `{ "error": "forbidden" }` |
| 404 | rentalIdの予約が存在しない | `{ "error": "rental not found" }` |
| 409 | 鍵が「保管中」以外（既に貸出中） | `{ "error": "key already lent" }` |

## データモデル変更

### 鍵 (keys)

| カラム | 型 | 説明 | 変更種別 |
|--------|---|------|---------|
| key_id | VARCHAR(36) | 鍵ID | 既存 |
| room_id | VARCHAR(36) | 会議室ID | 既存 |
| status | VARCHAR(20) | 貸出状態（保管中/貸出中） | 既存 |
| lent_at | TIMESTAMP | 貸出日時 | 既存 |
| return_at | TIMESTAMP | 返却日時 | 既存 |

### 会議室利用 (room_usages)

| カラム | 型 | 説明 | 変更種別 |
|--------|---|------|---------|
| usage_id | VARCHAR(36) | 利用ID | 既存 |
| reservation_id | VARCHAR(36) | 予約ID | 既存 |
| room_id | VARCHAR(36) | 会議室ID | 既存 |
| user_id | VARCHAR(36) | 利用者ID | 既存 |
| usage_status | VARCHAR(20) | 利用状態（利用開始/利用中/利用終了） | 既存 |
| started_at | TIMESTAMP | 利用開始日時 | 既存 |
| ended_at | TIMESTAMP | 利用終了日時 | 既存 |

## ビジネスルール

- 会議室種別が「バーチャル」の予約に対して鍵貸出APIを呼び出した場合は400を返す（バーチャル会議室の利用開始はタイマートリガーのため）
- 鍵状態が「保管中」以外（既に「貸出中」）の場合は409を返す
- 鍵状態更新と会議室利用レコード作成は同一DBトランザクション内で実施し、片方だけ成功する状態を防ぐ
- 貸出日時・利用開始日時はサーバーサイドのタイムスタンプを使用する

## ティア完了条件（BDD）

```gherkin
Feature: 鍵の貸出を記録する - バックエンド API

  Scenario: 物理会議室の予約R-001の鍵貸出を記録する
    Given オーナー「山田花子」（owner-001）がBearerトークンを保持し、予約R-001（物理会議室、鍵: 保管中）が存在する
    When POST /api/v1/rentals/R-001/key-out をリクエストする
    Then 200 OK で { keyStatus: "貸出中", usageStatus: "利用開始", lentAt: "2026-03-29T10:00:00Z" } が返される

  Scenario: バーチャル会議室の予約に対して鍵貸出を試みると400が返される
    Given オーナー「山田花子」（owner-001）がBearerトークンを保持し、予約R-010（バーチャル会議室）が存在する
    When POST /api/v1/rentals/R-010/key-out をリクエストする
    Then 400 Bad Request { error: "key-out not allowed for virtual rooms" } が返される
```
