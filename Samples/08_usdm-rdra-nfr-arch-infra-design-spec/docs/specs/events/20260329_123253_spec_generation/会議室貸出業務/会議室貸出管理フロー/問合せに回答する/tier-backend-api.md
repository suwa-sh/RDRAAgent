# 問合せに回答する - バックエンド API 仕様

## 変更概要

問合せ回答 API を追加する。問合せ状態「未対応」確認後、回答内容と回答日時を記録し状態を「回答済み」に更新する。MQに利用者への回答通知イベントを発行する。

## API 仕様

### 問合せ回答

- **メソッド**: PUT
- **パス**: `/api/v1/inquiries/{inquiryId}/reply`
- **認証**: Bearer Token (OAuth2/OIDC)
- **OpenAPI**: [openapi.yaml](../../_cross-cutting/api/openapi.yaml) の `paths./api/v1/inquiries/{inquiryId}/reply.put` を参照

#### リクエスト

| パラメータ | 型 | 必須 | 説明 |
|-----------|---|------|------|
| inquiryId (path) | string | Yes | 問合せID |
| replyContent (body) | string | Yes | 回答内容（最大1000文字） |

#### レスポンス

| フィールド | 型 | 説明 |
|-----------|---|------|
| inquiryId | string | 問合せID |
| status | string | 更新後の問合せ状態（"回答済み"） |
| repliedAt | string | 回答日時 (ISO 8601) |

#### エラーレスポンス

| ステータスコード | 条件 | レスポンス |
|----------------|------|-----------|
| 400 | replyContentが空または1000文字超 | `{ "error": "invalid reply content" }` |
| 403 | 問合せの宛先オーナーでない場合の認可チェック失敗 | `{ "error": "forbidden" }` |
| 404 | inquiryIdの問合せが存在しない | `{ "error": "inquiry not found" }` |
| 409 | 問合せ状態が「未対応」以外（既に回答済み） | `{ "error": "inquiry already replied" }` |

## 非同期イベント（該当する場合）

### 問合せ回答通知イベント

- **チャネル**: `inquiry-reply-notification`
- **方向**: publish
- **AsyncAPI**: [asyncapi.yaml](../../_cross-cutting/api/asyncapi.yaml) の `channels.inquiry-reply-notification` を参照
- **発行条件**: 問合せ回答処理成功後に常時発行（利用者へのメール通知トリガー）

## データモデル変更

### 問合せ (inquiries)

| カラム | 型 | 説明 | 変更種別 |
|--------|---|------|---------|
| reply_content | TEXT | 回答内容 | 既存（nullから更新） |
| status | VARCHAR(20) | 問合せ状態（未対応→回答済み） | 既存（更新） |
| replied_at | TIMESTAMP | 回答日時 | 既存（nullから更新） |

## ビジネスルール

- 問合せ状態が「未対応」以外（「回答済み」「対応済み」）への回答は409を返す
- 宛先オーナーIDと認証されたオーナーIDが一致することを認可サービスで確認する（Check(owner:ownerId, replier, inquiry:inquiryId)）
- 回答内容と回答日時を一括更新し、状態を「回答済み」に変更する
- 回答後にMQにinquiry-reply-notificationを発行して利用者への通知を非同期で行う

## ティア完了条件（BDD）

```gherkin
Feature: 問合せに回答する - バックエンド API

  Scenario: オーナー「山田花子」が未対応の問合せI-001に回答する
    Given オーナー「山田花子」（owner-001）がBearerトークンを保持し、問合せI-001（宛先: owner-001、状態: 未対応）が存在する
    When PUT /api/v1/inquiries/I-001/reply { replyContent: "会議室から徒歩2分のところにコインパーキングがあります" } をリクエストする
    Then 200 OK で { status: "回答済み", repliedAt: "2026-03-29T14:00:00Z" } が返され、inquiry-reply-notificationがMQに発行される

  Scenario: 回答済みの問合せへの重複回答は409が返される
    Given 問合せI-001がすでに「回答済み」状態である
    When PUT /api/v1/inquiries/I-001/reply { replyContent: "追加回答" } をリクエストする
    Then 409 Conflict { error: "inquiry already replied" } が返される
```
