# 精算内容を確認する - バックエンドAPI仕様

## 変更概要

精算内容を確認するのAPIエンドポイントを実装する。精算情報を取得する。

## API 仕様

### 精算情報一覧取得

- **メソッド**: GET
- **パス**: /api/v1/owners/me/settlements
- **認証**: Bearer JWT
- **OpenAPI**: [openapi.yaml](../../../_cross-cutting/api/openapi.yaml) の paths./api/v1/owners/me/settlements.get を参照

#### リクエスト

リクエストボディなし（GETリクエスト）

#### レスポンス

| フィールド | 型 | 説明 |
|-----------|---|------|
| data | SettlementListResponse | レスポンスデータ |

#### エラーレスポンス

| ステータスコード | 条件 | レスポンス |
|----------------|------|-----------|
| 400 | バリデーションエラー | {code: "VALIDATION_ERROR", message: "入力値が不正です"} |
| 401 | 認証エラー | {code: "UNAUTHORIZED", message: "認証が必要です"} |
| 403 | 認可エラー | {code: "FORBIDDEN", message: "権限がありません"} |
| 404 | リソース未存在 | {code: "NOT_FOUND", message: "リソースが見つかりません"} |

## データモデル変更

### settlements

| カラム | 型 | 説明 | 変更種別 |
|--------|---|------|---------|
| (精算情報の属性) | 情報.tsvの定義 | 精算情報のデータ | 参照のみ |

## ビジネスルール

- 入力バリデーション（必須項目チェック、形式チェック）


## ティア完了条件（BDD）

```gherkin
Feature: 精算内容を確認する - バックエンドAPI

  Scenario: 精算情報一覧取得APIが正常にレスポンスを返す
    Given 認証済みの会議室オーナーのJWTトークンが有効である
    When GET /api/v1/owners/me/settlements にリクエストを送信する
    Then HTTP 200 でSettlementListResponseが返却される
```
