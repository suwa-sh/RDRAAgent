# オーナーへ問合せする - バックエンド API 仕様

## 変更概要

問合せ登録 API を実装する。問合せ先区分=owner として問合せレコードを「未対応」状態で作成する。

## API 仕様

### 問合せ登録 API

- **メソッド**: POST
- **パス**: `/api/v1/inquiries`
- **認証**: Bearer トークン（利用者ロール必須）
- **OpenAPI**: [openapi.yaml](../../_cross-cutting/api/openapi.yaml) の `paths./api/v1/inquiries.post` を参照

#### リクエスト

| パラメータ | 型 | 必須 | 説明 |
|-----------|---|------|------|
| inquiry_type | string | Yes | 問合せ種別（owner/service） |
| target_id | string | Yes | 問合せ先ID（オーナーID） |
| room_id | string | No | 関連する会議室ID |
| content | string | Yes | 問合せ内容（1〜500文字） |

#### レスポンス

| フィールド | 型 | 説明 |
|-----------|---|------|
| inquiry_id | string | 問合せID |
| status | string | 問合せ状態（"未対応"） |
| created_at | string | 作成日時 |

#### エラーレスポンス

| ステータスコード | 条件 | レスポンス |
|----------------|------|-----------|
| 400 | 問合せ内容が空・500文字超 | `{"error": "content must be 1-500 characters"}` |
| 401 | 未認証 | `{"error": "unauthorized"}` |

## データモデル変更

### inquiries テーブル（新規 INSERT）

| カラム | 型 | 説明 | 変更種別 |
|--------|---|------|---------|
| inquiry_id | VARCHAR(36) | 問合せID（UUID） | 新規作成 |
| user_id | VARCHAR(36) | 利用者ID | 新規作成 |
| inquiry_type | VARCHAR(20) | 問合せ種別（owner/service） | 新規作成 |
| target_id | VARCHAR(36) | 問合せ先ID | 新規作成 |
| room_id | VARCHAR(36) | 関連会議室ID（NULL可） | 新規作成 |
| content | TEXT | 問合せ内容 | 新規作成 |
| status | VARCHAR(20) | 問合せ状態（未対応/回答済み/対応済み） | 新規作成 |
| created_at | TIMESTAMP WITH TZ | 作成日時 | 新規作成 |

## ビジネスルール

- 問合せ内容は1〜500文字
- inquiry_type=owner の場合: target_id はオーナーID
- 作成と同時に認可サービスへ `user:{user_id}, inquiry:{inquiry_id}` の関係性タプルを追加

## ティア完了条件（BDD）

```gherkin
Feature: オーナーへ問合せする - バックエンド API

  Scenario: オーナー宛問合せが未対応状態で作成される
    Given 利用者 user-001 のトークンが有効
    When POST /api/v1/inquiries に {"inquiry_type":"owner","target_id":"owner-001","room_id":"room-001","content":"駐車場はありますか？"} を送信する
    Then HTTP 201 と、status="未対応" の問合せレスポンスが返る
```
