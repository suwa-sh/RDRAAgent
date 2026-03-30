# ホストを評価する - バックエンドAPI仕様

## 変更概要

利用した会議室のホストを評価するのためのAPIエンドポイントを実装する。

## API 仕様

### ホストを評価するAPI

- **メソッド**: POST
- **パス**: /api/v1/host-reviews
- **認証**: Bearer Token (JWT)
- **OpenAPI**: [openapi.yaml](../../_cross-cutting/api/openapi.yaml) の `paths./api/v1/host-reviews.post` を参照

#### リクエスト

| パラメータ | 型 | 必須 | 説明 |
|-----------|---|------|------|
| 会議室評価 | object | Yes | 会議室評価データ |
| 予約 | object | Yes | 予約情報データ |

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

### room_reviews

| カラム | 型 | 説明 | 変更種別 |
|--------|---|------|---------|
| id | uuid | 会議室評価ID | 既存 |
| updated_at | datetime | 更新日時 | 更新 |

## ビジネスルール

- 入力バリデーション（必須チェック、形式チェック）


## ティア完了条件（BDD）

```gherkin
Feature: ホストを評価する - バックエンドAPI

  Scenario: 正常リクエスト
    Given 有効なJWTトークンが設定されている
    When POST /api/v1/host-reviews にリクエストを送信する
    Then HTTP 201 が返却される

  Scenario: 認証エラー
    Given JWTトークンが未設定である
    When POST /api/v1/host-reviews にリクエストを送信する
    Then HTTP 401 が返却される
```
