# オーナー申請を審査する - バックエンドAPI仕様

## 変更概要

オーナー申請を審査するのAPIエンドポイントを実装する。オーナー申請を更新する。

## API 仕様

### オーナー申請審査

- **メソッド**: PUT
- **パス**: /api/v1/admin/owners/applications/:id/review
- **認証**: Bearer JWT
- **OpenAPI**: [openapi.yaml](../../../_cross-cutting/api/openapi.yaml) の paths./api/v1/admin/owners/applications/{id}/review.put を参照

#### リクエスト

| パラメータ | 型 | 必須 | 説明 |
|-----------|---|------|------|
| (リクエストボディ) | ReviewApplicationRequest | Yes | リクエストデータ |

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
| (オーナー申請の属性) | 情報.tsvの定義 | オーナー申請のデータ | 更新 |

### owners

| カラム | 型 | 説明 | 変更種別 |
|--------|---|------|---------|
| (オーナー情報の属性) | 情報.tsvの定義 | オーナー情報のデータ | 更新 |

## ビジネスルール

- オーナー審査基準: 条件.tsvの定義に従う
- 状態遷移: オーナー状態 申請中 → 審査中（審査開始）
- 状態遷移: オーナー状態 審査中 → 承認済（承認）
- 状態遷移: オーナー状態 審査中 → 却下（却下）

## ティア完了条件（BDD）

```gherkin
Feature: オーナー申請を審査する - バックエンドAPI

  Scenario: オーナー申請審査APIが正常にレスポンスを返す
    Given 認証済みのサービス運営担当者のJWTトークンが有効である
    When PUT /api/v1/admin/owners/applications/:id/review にリクエストを送信する
    Then HTTP 200 でApplicationResponseが返却される
```
