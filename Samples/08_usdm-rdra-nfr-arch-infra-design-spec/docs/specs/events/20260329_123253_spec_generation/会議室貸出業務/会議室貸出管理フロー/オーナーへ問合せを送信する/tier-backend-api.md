# オーナーへ問合せを送信する - バックエンド API 仕様

## 変更概要

問合せ登録 API を追加する。問合せ種別「オーナー宛問合せ」として問合せレコードを「未対応」状態で作成し、MQにオーナー通知イベントを発行する。

## API 仕様

### 問合せ登録

- **メソッド**: POST
- **パス**: `/api/v1/inquiries`
- **認証**: Bearer Token (OAuth2/OIDC)
- **OpenAPI**: [openapi.yaml](../../_cross-cutting/api/openapi.yaml) の `paths./api/v1/inquiries.post` を参照

#### リクエスト

| パラメータ | 型 | 必須 | 説明 |
|-----------|---|------|------|
| inquiryType (body) | string | Yes | 問合せ種別: "owner"（オーナー宛）または "service"（サービス運営宛） |
| recipientId (body) | string | Yes | 問合せ先ID（inquiryType=ownerの場合はオーナーID） |
| content (body) | string | Yes | 問合せ内容（最大1000文字） |

#### レスポンス

| フィールド | 型 | 説明 |
|-----------|---|------|
| inquiryId | string | 問合せID（UUID） |
| userId | string | 送信者（利用者）ID |
| inquiryType | string | 問合せ種別（"owner"） |
| recipientId | string | 問合せ先ID（オーナーID） |
| status | string | 問合せ状態（"未対応"） |
| createdAt | string | 問合せ日時 (ISO 8601) |

#### エラーレスポンス

| ステータスコード | 条件 | レスポンス |
|----------------|------|-----------|
| 400 | content が空または1000文字超、またはinquiryTypeが不正 | `{ "error": "invalid request" }` |
| 404 | recipientIdのオーナーが存在しない | `{ "error": "owner not found" }` |

## 非同期イベント（該当する場合）

### 問合せ通知イベント

- **チャネル**: `inquiry-notification`
- **方向**: publish
- **AsyncAPI**: [asyncapi.yaml](../../_cross-cutting/api/asyncapi.yaml) の `channels.inquiry-notification` を参照
- **発行条件**: 問合せレコード作成後に常時発行（オーナーへのメール通知トリガー）

## データモデル変更

### 問合せ (inquiries)

| カラム | 型 | 説明 | 変更種別 |
|--------|---|------|---------|
| inquiry_id | VARCHAR(36) | 問合せID (UUID) | 既存 |
| user_id | VARCHAR(36) | 送信者（利用者）ID | 既存 |
| inquiry_type | VARCHAR(20) | 問合せ先区分（owner/service） | 既存 |
| recipient_id | VARCHAR(36) | 問合せ先ID（オーナーIDまたはサービスID） | 既存 |
| content | TEXT | 問合せ内容 | 既存 |
| reply_content | TEXT | 回答内容（初期はnull） | 既存 |
| status | VARCHAR(20) | 問合せ状態（未対応/回答済み/対応済み） | 既存 |
| created_at | TIMESTAMP | 問合せ日時 | 既存 |
| replied_at | TIMESTAMP | 回答日時（初期はnull） | 既存 |

## ビジネスルール

- inquiryType="owner" の場合、recipientId はオーナーIDとして検索する（オーナーが存在しない場合は404）
- 問合せレコード作成後、MQに inquiry-notification イベントを発行してオーナーへの通知を非同期で行う
- 問合せ状態は登録時に常に「未対応」で作成する

## ティア完了条件（BDD）

```gherkin
Feature: オーナーへ問合せを送信する - バックエンド API

  Scenario: 利用者「田中太郎」がオーナー「山田花子」への問合せを送信する
    Given 利用者「田中太郎」（user-001）がBearerトークンを保持し、オーナー「山田花子」（owner-001）が存在する
    When POST /api/v1/inquiries { inquiryType: "owner", recipientId: "owner-001", content: "駐車場はありますか？" } をリクエストする
    Then 201 Created で { inquiryId, status: "未対応", createdAt } が返され、inquiry-notificationがMQに発行される

  Scenario: 存在しないオーナーへの問合せ送信は404が返される
    Given 利用者「田中太郎」（user-001）がBearerトークンを保持し、オーナーID「owner-999」は存在しない
    When POST /api/v1/inquiries { inquiryType: "owner", recipientId: "owner-999", content: "問合せ" } をリクエストする
    Then 404 Not Found { error: "owner not found" } が返される
```
