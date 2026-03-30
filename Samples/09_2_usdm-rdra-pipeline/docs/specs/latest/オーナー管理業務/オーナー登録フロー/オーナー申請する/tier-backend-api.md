# オーナー申請する - バックエンドAPI仕様

## 変更概要

オーナー申請するのAPIエンドポイントを実装する。オーナー申請を登録する。

## API 仕様

### オーナー申請提出

- **メソッド**: POST
- **パス**: /api/v1/owners/applications
- **認証**: Bearer JWT
- **OpenAPI**: [openapi.yaml](../../../_cross-cutting/api/openapi.yaml) の paths./api/v1/owners/applications.post を参照

#### リクエスト

| パラメータ | 型 | 必須 | 説明 |
|-----------|---|------|------|
| (リクエストボディ) | CreateApplicationRequest | Yes | リクエストデータ |

#### レスポンス

| フィールド | 型 | 説明 |
|-----------|---|------|
| data | ApplicationResponse | レスポンスデータ |

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
| (オーナー申請の属性) | 情報.tsvの定義 | オーナー申請のデータ | 追加 |

## ビジネスルール

- 入力バリデーション（必須項目チェック、形式チェック）


## ティア完了条件（BDD）

```gherkin
Feature: オーナー申請する - バックエンドAPI

  Scenario: オーナー申請提出APIが正常にレスポンスを返す
    Given 認証済みの会議室オーナーのJWTトークンが有効である
    When POST /api/v1/owners/applications にリクエストを送信する
    Then HTTP 201 でApplicationResponseが返却される
```
