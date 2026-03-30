# オーナー退会する - バックエンドAPI仕様

## 変更概要

オーナー退会するのAPIエンドポイントを実装する。オーナー情報を更新する。

## API 仕様

### オーナー退会

- **メソッド**: POST
- **パス**: /api/v1/owners/me/withdraw
- **認証**: Bearer JWT
- **OpenAPI**: [openapi.yaml](../../../_cross-cutting/api/openapi.yaml) の paths./api/v1/owners/me/withdraw.post を参照

#### リクエスト

リクエストボディなし（GETリクエスト）

#### レスポンス

| フィールド | 型 | 説明 |
|-----------|---|------|
| data | OwnerResponse | レスポンスデータ |

#### エラーレスポンス

| ステータスコード | 条件 | レスポンス |
|----------------|------|-----------|
| 400 | バリデーションエラー | {code: "VALIDATION_ERROR", message: "入力値が不正です"} |
| 401 | 認証エラー | {code: "UNAUTHORIZED", message: "認証が必要です"} |
| 403 | 認可エラー | {code: "FORBIDDEN", message: "権限がありません"} |
| 404 | リソース未存在 | {code: "NOT_FOUND", message: "リソースが見つかりません"} |

## データモデル変更

### owners

| カラム | 型 | 説明 | 変更種別 |
|--------|---|------|---------|
| (オーナー情報の属性) | 情報.tsvの定義 | オーナー情報のデータ | 更新 |

## ビジネスルール

- 入力バリデーション（必須項目チェック、形式チェック）
- 状態遷移: オーナー状態 承認済 → 退会（退会申請）

## ティア完了条件（BDD）

```gherkin
Feature: オーナー退会する - バックエンドAPI

  Scenario: オーナー退会APIが正常にレスポンスを返す
    Given 認証済みの会議室オーナーのJWTトークンが有効である
    When POST /api/v1/owners/me/withdraw にリクエストを送信する
    Then HTTP 201 でOwnerResponseが返却される
```
