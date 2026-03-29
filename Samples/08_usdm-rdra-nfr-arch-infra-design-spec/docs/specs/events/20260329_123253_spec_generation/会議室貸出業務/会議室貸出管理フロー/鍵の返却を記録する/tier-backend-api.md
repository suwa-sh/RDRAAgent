# 鍵の返却を記録する - バックエンド API 仕様

## 変更概要

鍵返却記録 API を追加する。鍵状態「貸出中」確認後に鍵状態を「保管中」に更新し、会議室利用状態を「利用中」→「利用終了」に遷移させる。鍵状態更新と会議室利用状態更新は同一トランザクションで行う。

## API 仕様

### 鍵返却記録

- **メソッド**: POST
- **パス**: `/api/v1/rentals/{rentalId}/key-return`
- **認証**: Bearer Token (OAuth2/OIDC)
- **OpenAPI**: [openapi.yaml](../../_cross-cutting/api/openapi.yaml) の `paths./api/v1/rentals/{rentalId}/key-return.post` を参照

#### リクエスト

| パラメータ | 型 | 必須 | 説明 |
|-----------|---|------|------|
| rentalId (path) | string | Yes | 予約ID |

#### レスポンス

| フィールド | 型 | 説明 |
|-----------|---|------|
| rentalId | string | 予約ID |
| keyId | string | 鍵ID |
| keyStatus | string | 更新後の鍵状態（"保管中"） |
| usageId | string | 会議室利用ID |
| usageStatus | string | 会議室利用状態（"利用終了"） |
| returnedAt | string | 返却日時 (ISO 8601) |
| usageMinutes | integer | 実利用時間（分、切り捨て） |

#### エラーレスポンス

| ステータスコード | 条件 | レスポンス |
|----------------|------|-----------|
| 400 | バーチャル会議室への鍵返却試行 | `{ "error": "key-return not allowed for virtual rooms" }` |
| 403 | オーナーと会議室の認可チェック失敗 | `{ "error": "forbidden" }` |
| 404 | rentalIdの予約が存在しない | `{ "error": "rental not found" }` |
| 409 | 鍵が「貸出中」以外（既に返却済み） | `{ "error": "key already returned" }` |

## データモデル変更

### 鍵 (keys)

| カラム | 型 | 説明 | 変更種別 |
|--------|---|------|---------|
| key_id | VARCHAR(36) | 鍵ID | 既存 |
| status | VARCHAR(20) | 貸出状態（保管中/貸出中） | 既存 |
| return_at | TIMESTAMP | 返却日時 | 既存 |

### 会議室利用 (room_usages)

| カラム | 型 | 説明 | 変更種別 |
|--------|---|------|---------|
| usage_status | VARCHAR(20) | 利用状態（利用開始/利用中/利用終了） | 既存 |
| ended_at | TIMESTAMP | 利用終了日時 | 既存 |
| usage_minutes | INTEGER | 実利用時間（分） | 追加 |

## ビジネスルール

- 会議室種別が「バーチャル」の予約に対して鍵返却APIを呼び出した場合は400を返す
- 鍵状態が「貸出中」以外（既に「保管中」）の場合は409を返す
- 実利用時間は（利用終了日時 - 利用開始日時）を分単位で計算し、小数点以下切り捨て
- 鍵状態更新と会議室利用状態更新は同一DBトランザクション内で実施する
- 返却日時・利用終了日時はサーバーサイドのタイムスタンプを使用する

## ティア完了条件（BDD）

```gherkin
Feature: 鍵の返却を記録する - バックエンド API

  Scenario: 物理会議室の予約R-001の鍵返却を記録する
    Given オーナー「山田花子」（owner-001）がBearerトークンを保持し、予約R-001（物理会議室、鍵: 貸出中、利用開始: 10:00）が存在する
    When POST /api/v1/rentals/R-001/key-return をリクエストする
    Then 200 OK で { keyStatus: "保管中", usageStatus: "利用終了", returnedAt: "2026-03-29T12:00:00Z", usageMinutes: 120 } が返される

  Scenario: すでに返却済みの鍵に返却操作を試みると409が返される
    Given 予約R-001の鍵がすでに「保管中」状態である
    When POST /api/v1/rentals/R-001/key-return をリクエストする
    Then 409 Conflict { error: "key already returned" } が返される
```
