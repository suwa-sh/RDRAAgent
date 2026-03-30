# 売上実績を確認する - バックエンドAPI仕様

## 変更概要

売上実績を確認するのAPIエンドポイントを実装する。売上実績を取得する。

## API 仕様

### 売上実績取得

- **メソッド**: GET
- **パス**: /api/v1/owners/me/revenue-stats
- **認証**: Bearer JWT
- **OpenAPI**: [openapi.yaml](../../../_cross-cutting/api/openapi.yaml) の paths./api/v1/owners/me/revenue-stats.get を参照

#### リクエスト

リクエストボディなし（GETリクエスト）

#### レスポンス

| フィールド | 型 | 説明 |
|-----------|---|------|
| data | RevenueStatsResponse | レスポンスデータ |

#### エラーレスポンス

| ステータスコード | 条件 | レスポンス |
|----------------|------|-----------|
| 400 | バリデーションエラー | {code: "VALIDATION_ERROR", message: "入力値が不正です"} |
| 401 | 認証エラー | {code: "UNAUTHORIZED", message: "認証が必要です"} |
| 403 | 認可エラー | {code: "FORBIDDEN", message: "権限がありません"} |
| 404 | リソース未存在 | {code: "NOT_FOUND", message: "リソースが見つかりません"} |

## データモデル変更

### revenue_records

| カラム | 型 | 説明 | 変更種別 |
|--------|---|------|---------|
| (売上実績の属性) | 情報.tsvの定義 | 売上実績のデータ | 参照のみ |

## ビジネスルール

- 入力バリデーション（必須項目チェック、形式チェック）


## ティア完了条件（BDD）

```gherkin
Feature: 売上実績を確認する - バックエンドAPI

  Scenario: 売上実績取得APIが正常にレスポンスを返す
    Given 認証済みの会議室オーナーのJWTトークンが有効である
    When GET /api/v1/owners/me/revenue-stats にリクエストを送信する
    Then HTTP 200 でRevenueStatsResponseが返却される
```
