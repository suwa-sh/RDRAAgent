# 規約を参照する - バックエンドAPI仕様

## 変更概要

規約を参照するのAPIエンドポイントを実装する。オーナー申請を取得する。

## API 仕様

### 利用規約取得

- **メソッド**: GET
- **パス**: /api/v1/terms
- **認証**: Bearer JWT
- **OpenAPI**: [openapi.yaml](../../../_cross-cutting/api/openapi.yaml) の paths./api/v1/terms.get を参照

#### リクエスト

リクエストボディなし（GETリクエスト）

#### レスポンス

| フィールド | 型 | 説明 |
|-----------|---|------|
| data | TermsResponse | レスポンスデータ |

#### エラーレスポンス

| ステータスコード | 条件 | レスポンス |
|----------------|------|-----------|
| 400 | バリデーションエラー | {code: "VALIDATION_ERROR", message: "入力値が不正です"} |
| 401 | 認証エラー | {code: "UNAUTHORIZED", message: "認証が必要です"} |
| 403 | 認可エラー | {code: "FORBIDDEN", message: "権限がありません"} |
| 404 | リソース未存在 | {code: "NOT_FOUND", message: "リソースが見つかりません"} |

## データモデル変更

### owner_applications

| カラム | 型 | 説明 | 変更種別 |
|--------|---|------|---------|
| (オーナー申請の属性) | 情報.tsvの定義 | オーナー申請のデータ | 参照のみ |

## ビジネスルール

- 入力バリデーション（必須項目チェック、形式チェック）


## ティア完了条件（BDD）

```gherkin
Feature: 規約を参照する - バックエンドAPI

  Scenario: 利用規約取得APIが正常にレスポンスを返す
    Given 認証済みの会議室オーナーのJWTトークンが有効である
    When GET /api/v1/terms にリクエストを送信する
    Then HTTP 200 でTermsResponseが返却される
```
