# サービスに問合せる - バックエンドAPI仕様

## 変更概要

サービス運営への問合せを送信するのためのAPIエンドポイントを実装する。

## API 仕様

### サービスに問合せるAPI

- **メソッド**: POST
- **パス**: /api/v1/service-inquiries
- **認証**: Bearer Token (JWT)
- **OpenAPI**: [openapi.yaml](../../_cross-cutting/api/openapi.yaml) の `paths./api/v1/service-inquiries.post` を参照

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
| 403 | 利用者以外のアクセス | { code: "FORBIDDEN", message: "アクセス権限がありません" } |
| 404 | リソース未存在 | { code: "NOT_FOUND", message: "指定されたリソースが見つかりません" } |

## データモデル変更

### inquiries

| カラム | 型 | 説明 | 変更種別 |
|--------|---|------|---------|
| id | uuid | 問合せID | 既存 |
| updated_at | datetime | 更新日時 | 更新 |

## ビジネスルール

- 入力バリデーション（必須チェック、形式チェック）
- 状態遷移: 問合せ状態を初期から受付に遷移

## ティア完了条件（BDD）

```gherkin
Feature: サービスに問合せる - バックエンドAPI

  Scenario: 正常リクエスト
    Given 有効なJWTトークンが設定されている
    When POST /api/v1/service-inquiries にリクエストを送信する
    Then HTTP 201 が返却される

  Scenario: 認証エラー
    Given JWTトークンが未設定である
    When POST /api/v1/service-inquiries にリクエストを送信する
    Then HTTP 401 が返却される
```
