# 手数料売上を分析する - バックエンドAPI仕様

## 変更概要

手数料売上を分析するのAPIエンドポイントを実装する。手数料売上を取得する。

## API 仕様

### 手数料売上分析

- **メソッド**: GET
- **パス**: /api/v1/admin/commission-stats
- **認証**: Bearer JWT
- **OpenAPI**: [openapi.yaml](../../../_cross-cutting/api/openapi.yaml) の paths./api/v1/admin/commission-stats.get を参照

#### リクエスト

リクエストボディなし（GETリクエスト）

#### レスポンス

| フィールド | 型 | 説明 |
|-----------|---|------|
| data | CommissionStatsResponse | レスポンスデータ |

#### エラーレスポンス

| ステータスコード | 条件 | レスポンス |
|----------------|------|-----------|
| 400 | バリデーションエラー | {code: "VALIDATION_ERROR", message: "入力値が不正です"} |
| 401 | 認証エラー | {code: "UNAUTHORIZED", message: "認証が必要です"} |
| 403 | 認可エラー | {code: "FORBIDDEN", message: "権限がありません"} |
| 404 | リソース未存在 | {code: "NOT_FOUND", message: "リソースが見つかりません"} |

## データモデル変更

### commission_records

| カラム | 型 | 説明 | 変更種別 |
|--------|---|------|---------|
| (手数料売上の属性) | 情報.tsvの定義 | 手数料売上のデータ | 参照のみ |

## ビジネスルール

- 入力バリデーション（必須項目チェック、形式チェック）


## ティア完了条件（BDD）

```gherkin
Feature: 手数料売上を分析する - バックエンドAPI

  Scenario: 手数料売上分析APIが正常にレスポンスを返す
    Given 認証済みのサービス運営担当者のJWTトークンが有効である
    When GET /api/v1/admin/commission-stats にリクエストを送信する
    Then HTTP 200 でCommissionStatsResponseが返却される
```
