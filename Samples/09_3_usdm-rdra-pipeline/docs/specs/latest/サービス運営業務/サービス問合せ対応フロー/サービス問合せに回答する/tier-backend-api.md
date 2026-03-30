# サービス問合せに回答する - バックエンドAPI仕様

## 変更概要

利用者からのサービス問合せに対応するのためのAPIエンドポイントを実装する。

## API 仕様

### サービス問合せに回答するAPI

- **メソッド**: POST
- **パス**: /api/v1/service-inquiries/{inquiry_id}/actions/reply
- **認証**: Bearer Token (JWT)
- **OpenAPI**: [openapi.yaml](../../_cross-cutting/api/openapi.yaml) の `paths./api/v1/service-inquiries/{id}/actions/reply.post` を参照

#### リクエスト

| パラメータ | 型 | 必須 | 説明 |
|-----------|---|------|------|
| 問合せ | object | Yes | 問合せデータ |

#### レスポンス

| フィールド | 型 | 説明 |
|-----------|---|------|
| id | string | 作成/更新されたリソースID |
| status | string | 処理結果ステータス |

#### エラーレスポンス

| ステータスコード | 条件 | レスポンス |
|----------------|------|-----------|
| 400 | バリデーションエラー | { code: "VALIDATION_ERROR", message: "入力内容に誤りがあります" } |
| 401 | 認証トークン無効 | { code: "UNAUTHORIZED", message: "認証が必要です" } |
| 403 | サービス運営担当者以外のアクセス | { code: "FORBIDDEN", message: "アクセス権限がありません" } |
| 404 | リソース未存在 | { code: "NOT_FOUND", message: "指定されたリソースが見つかりません" } |

## データモデル変更

### inquiries

| カラム | 型 | 説明 | 変更種別 |
|--------|---|------|---------|
| id | uuid | 問合せID | 既存 |
| updated_at | datetime | 更新日時 | 更新 |

## ビジネスルール

- 入力バリデーション（必須チェック、形式チェック）
- 状態遷移: 問合せ状態を受付から対応中に遷移
- 状態遷移: 問合せ状態を対応中から回答済に遷移

## ティア完了条件（BDD）

```gherkin
Feature: サービス問合せに回答する - バックエンドAPI

  Scenario: 正常リクエスト
    Given 有効なJWTトークンが設定されている
    When POST /api/v1/service-inquiries/{inquiry_id}/actions/reply にリクエストを送信する
    Then HTTP 201 が返却される

  Scenario: 認証エラー
    Given JWTトークンが未設定である
    When POST /api/v1/service-inquiries/{inquiry_id}/actions/reply にリクエストを送信する
    Then HTTP 401 が返却される
```
