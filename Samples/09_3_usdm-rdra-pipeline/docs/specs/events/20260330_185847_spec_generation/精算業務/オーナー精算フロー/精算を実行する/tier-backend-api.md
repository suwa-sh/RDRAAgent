# 精算を実行する - バックエンドAPI仕様

## 変更概要

算出した精算額を決済機関経由でオーナーに支払うのためのAPIエンドポイントを実装する。

## API 仕様

### 精算を実行するAPI

- **メソッド**: POST
- **パス**: /api/v1/settlements/actions/execute
- **認証**: Bearer Token (JWT)
- **OpenAPI**: [openapi.yaml](../../_cross-cutting/api/openapi.yaml) の `paths./api/v1/settlements/actions/execute.post` を参照

#### リクエスト

| パラメータ | 型 | 必須 | 説明 |
|-----------|---|------|------|
| 精算 | object | Yes | 精算情報データ |

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

## 非同期イベント

### 精算支払通知

- **チャネル**: settlement-payment-notifications
- **方向**: publish
- **AsyncAPI**: [asyncapi.yaml](../../_cross-cutting/api/asyncapi.yaml) の `channels.settlement-payment-notifications` を参照

## データモデル変更

### settlements

| カラム | 型 | 説明 | 変更種別 |
|--------|---|------|---------|
| id | uuid | 精算情報ID | 既存 |
| updated_at | datetime | 更新日時 | 更新 |

## ビジネスルール

- 入力バリデーション（必須チェック、形式チェック）


## ティア完了条件（BDD）

```gherkin
Feature: 精算を実行する - バックエンドAPI

  Scenario: 正常リクエスト
    Given 有効なJWTトークンが設定されている
    When POST /api/v1/settlements/actions/execute にリクエストを送信する
    Then HTTP 201 が返却される

  Scenario: 認証エラー
    Given JWTトークンが未設定である
    When POST /api/v1/settlements/actions/execute にリクエストを送信する
    Then HTTP 401 が返却される
```
