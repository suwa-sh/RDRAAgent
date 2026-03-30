# サービス問合せを送信する - バックエンドAPI仕様

## 変更概要

サービス問合せを送信するのAPIエンドポイントを実装する。問合せを登録する。

## API 仕様

### サービス問合せ送信

- **メソッド**: POST
- **パス**: /api/v1/support/inquiries
- **認証**: Bearer JWT
- **OpenAPI**: [openapi.yaml](../../../_cross-cutting/api/openapi.yaml) の paths./api/v1/support/inquiries.post を参照

#### リクエスト

| パラメータ | 型 | 必須 | 説明 |
|-----------|---|------|------|
| (リクエストボディ) | CreateSupportInquiryRequest | Yes | リクエストデータ |

#### レスポンス

| フィールド | 型 | 説明 |
|-----------|---|------|
| data | InquiryResponse | レスポンスデータ |

#### エラーレスポンス

| ステータスコード | 条件 | レスポンス |
|----------------|------|-----------|
| 400 | バリデーションエラー | {code: "VALIDATION_ERROR", message: "入力値が不正です"} |
| 401 | 認証エラー | {code: "UNAUTHORIZED", message: "認証が必要です"} |
| 403 | 認可エラー | {code: "FORBIDDEN", message: "権限がありません"} |
| 404 | リソース未存在 | {code: "NOT_FOUND", message: "リソースが見つかりません"} |

## データモデル変更

### inquiries

| カラム | 型 | 説明 | 変更種別 |
|--------|---|------|---------|
| (問合せの属性) | 情報.tsvの定義 | 問合せのデータ | 追加 |

## ビジネスルール

- 入力バリデーション（必須項目チェック、形式チェック）


## ティア完了条件（BDD）

```gherkin
Feature: サービス問合せを送信する - バックエンドAPI

  Scenario: サービス問合せ送信APIが正常にレスポンスを返す
    Given 認証済みの利用者のJWTトークンが有効である
    When POST /api/v1/support/inquiries にリクエストを送信する
    Then HTTP 201 でInquiryResponseが返却される
```
