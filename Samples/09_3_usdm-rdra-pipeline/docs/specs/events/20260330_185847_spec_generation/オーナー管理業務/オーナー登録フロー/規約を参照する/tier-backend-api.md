# 規約を参照する - バックエンドAPI仕様

## 変更概要

サービス規約の内容を確認するのためのAPIエンドポイントを実装する。

## API 仕様

### 規約を参照するAPI

- **メソッド**: GET
- **パス**: /api/v1/terms
- **認証**: Bearer Token (JWT)
- **OpenAPI**: [openapi.yaml](../../_cross-cutting/api/openapi.yaml) の `paths./api/v1/terms.get` を参照

#### リクエスト

| パラメータ | 型 | 必須 | 説明 |
|-----------|---|------|------|
| page | integer | No | ページ番号（デフォルト: 1） |
| per_page | integer | No | 1ページあたり件数（デフォルト: 20） |

#### レスポンス

| フィールド | 型 | 説明 |
|-----------|---|------|
| items | array | サービス規約の配列 |
| total | integer | 全件数 |

#### エラーレスポンス

| ステータスコード | 条件 | レスポンス |
|----------------|------|-----------|
| 400 | バリデーションエラー | { code: "VALIDATION_ERROR", message: "入力内容に誤りがあります" } |
| 401 | 認証トークン無効 | { code: "UNAUTHORIZED", message: "認証が必要です" } |
| 403 | 会議室オーナー以外のアクセス | { code: "FORBIDDEN", message: "アクセス権限がありません" } |
| 404 | リソース未存在 | { code: "NOT_FOUND", message: "指定されたリソースが見つかりません" } |

## データモデル変更

### service_terms

| カラム | 型 | 説明 | 変更種別 |
|--------|---|------|---------|
| id | uuid | サービス規約ID | 既存 |


## ビジネスルール

- 入力バリデーション（必須チェック、形式チェック）


## ティア完了条件（BDD）

```gherkin
Feature: 規約を参照する - バックエンドAPI

  Scenario: 正常リクエスト
    Given 有効なJWTトークンが設定されている
    When GET /api/v1/terms にリクエストを送信する
    Then HTTP 200 が返却される

  Scenario: 認証エラー
    Given JWTトークンが未設定である
    When GET /api/v1/terms にリクエストを送信する
    Then HTTP 401 が返却される
```
