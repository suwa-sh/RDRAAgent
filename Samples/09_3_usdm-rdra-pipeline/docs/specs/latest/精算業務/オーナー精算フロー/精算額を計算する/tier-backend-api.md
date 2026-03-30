# 精算額を計算する - バックエンドAPI仕様

## 変更概要

会議室別の利用履歴から精算額を算出するのためのAPIエンドポイントを実装する。

## API 仕様

### 精算額を計算するAPI

- **メソッド**: POST
- **パス**: /api/v1/settlements/actions/calculate
- **認証**: Bearer Token (JWT)
- **OpenAPI**: [openapi.yaml](../../_cross-cutting/api/openapi.yaml) の `paths./api/v1/settlements/actions/calculate.post` を参照

#### リクエスト

| パラメータ | 型 | 必須 | 説明 |
|-----------|---|------|------|
| 利用履歴 | object | Yes | 利用履歴データ |
| 手数料 | object | Yes | 手数料情報データ |
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

## データモデル変更

### usage_history

| カラム | 型 | 説明 | 変更種別 |
|--------|---|------|---------|
| id | uuid | 利用履歴ID | 既存 |
| updated_at | datetime | 更新日時 | 更新 |

## ビジネスルール

- 精算条件: RDRA条件定義に基づく判定ロジック


## ティア完了条件（BDD）

```gherkin
Feature: 精算額を計算する - バックエンドAPI

  Scenario: 正常リクエスト
    Given 有効なJWTトークンが設定されている
    When POST /api/v1/settlements/actions/calculate にリクエストを送信する
    Then HTTP 201 が返却される

  Scenario: 認証エラー
    Given JWTトークンが未設定である
    When POST /api/v1/settlements/actions/calculate にリクエストを送信する
    Then HTTP 401 が返却される
```
