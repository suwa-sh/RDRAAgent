# 利用者使用許諾する - バックエンドAPI仕様

## 変更概要

利用者使用許諾するのAPIエンドポイントを実装する。予約情報, 利用者評価を更新する。

## API 仕様

### 利用者使用許諾

- **メソッド**: POST
- **パス**: /api/v1/reservations/:id/approve
- **認証**: Bearer JWT
- **OpenAPI**: [openapi.yaml](../../../_cross-cutting/api/openapi.yaml) の paths./api/v1/reservations/{id}/approve.post を参照

#### リクエスト

| パラメータ | 型 | 必須 | 説明 |
|-----------|---|------|------|
| (リクエストボディ) | ApproveReservationRequest | Yes | リクエストデータ |

#### レスポンス

| フィールド | 型 | 説明 |
|-----------|---|------|
| data | ReservationResponse | レスポンスデータ |

#### エラーレスポンス

| ステータスコード | 条件 | レスポンス |
|----------------|------|-----------|
| 400 | バリデーションエラー | {code: "VALIDATION_ERROR", message: "入力値が不正です"} |
| 401 | 認証エラー | {code: "UNAUTHORIZED", message: "認証が必要です"} |
| 403 | 認可エラー | {code: "FORBIDDEN", message: "権限がありません"} |
| 404 | リソース未存在 | {code: "NOT_FOUND", message: "リソースが見つかりません"} |

## データモデル変更

### reservations

| カラム | 型 | 説明 | 変更種別 |
|--------|---|------|---------|
| (予約情報の属性) | 情報.tsvの定義 | 予約情報のデータ | 更新 |

### user_reviews

| カラム | 型 | 説明 | 変更種別 |
|--------|---|------|---------|
| (利用者評価の属性) | 情報.tsvの定義 | 利用者評価のデータ | 参照のみ |

## ビジネスルール

- 利用者許諾条件: 条件.tsvの定義に従う


## ティア完了条件（BDD）

```gherkin
Feature: 利用者使用許諾する - バックエンドAPI

  Scenario: 利用者使用許諾APIが正常にレスポンスを返す
    Given 認証済みの会議室オーナーのJWTトークンが有効である
    When POST /api/v1/reservations/:id/approve にリクエストを送信する
    Then HTTP 201 でReservationResponseが返却される
```
