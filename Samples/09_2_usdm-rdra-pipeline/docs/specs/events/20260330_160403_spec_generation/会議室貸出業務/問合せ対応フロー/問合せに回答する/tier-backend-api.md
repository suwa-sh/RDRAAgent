# 問合せに回答する - バックエンドAPI仕様

## 変更概要

問合せに回答するのAPIエンドポイントを実装する。問合せを更新する。

## API 仕様

### 問合せ回答

- **メソッド**: POST
- **パス**: /api/v1/inquiries/:id/replies
- **認証**: Bearer JWT
- **OpenAPI**: [openapi.yaml](../../../_cross-cutting/api/openapi.yaml) の paths./api/v1/inquiries/{id}/replies.post を参照

#### リクエスト

| パラメータ | 型 | 必須 | 説明 |
|-----------|---|------|------|
| (リクエストボディ) | CreateReplyRequest | Yes | リクエストデータ |

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
| (問合せの属性) | 情報.tsvの定義 | 問合せのデータ | 更新 |

## ビジネスルール

- 入力バリデーション（必須項目チェック、形式チェック）


## ティア完了条件（BDD）

```gherkin
Feature: 問合せに回答する - バックエンドAPI

  Scenario: 問合せ回答APIが正常にレスポンスを返す
    Given 認証済みの会議室オーナーのJWTトークンが有効である
    When POST /api/v1/inquiries/:id/replies にリクエストを送信する
    Then HTTP 201 でInquiryResponseが返却される
```
