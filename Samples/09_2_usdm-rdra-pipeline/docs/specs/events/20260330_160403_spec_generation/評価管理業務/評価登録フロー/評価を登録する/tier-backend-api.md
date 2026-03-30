# 評価を登録する - バックエンドAPI仕様

## 変更概要

評価を登録するのAPIエンドポイントを実装する。会議室評価を登録する。

## API 仕様

### 会議室評価登録

- **メソッド**: POST
- **パス**: /api/v1/reservations/:id/room-reviews
- **認証**: Bearer JWT
- **OpenAPI**: [openapi.yaml](../../../_cross-cutting/api/openapi.yaml) の paths./api/v1/reservations/{id}/room-reviews.post を参照

#### リクエスト

| パラメータ | 型 | 必須 | 説明 |
|-----------|---|------|------|
| (リクエストボディ) | CreateRoomReviewRequest | Yes | リクエストデータ |

#### レスポンス

| フィールド | 型 | 説明 |
|-----------|---|------|
| data | RoomReviewResponse | レスポンスデータ |

#### エラーレスポンス

| ステータスコード | 条件 | レスポンス |
|----------------|------|-----------|
| 400 | バリデーションエラー | {code: "VALIDATION_ERROR", message: "入力値が不正です"} |
| 401 | 認証エラー | {code: "UNAUTHORIZED", message: "認証が必要です"} |
| 403 | 認可エラー | {code: "FORBIDDEN", message: "権限がありません"} |
| 404 | リソース未存在 | {code: "NOT_FOUND", message: "リソースが見つかりません"} |

## データモデル変更

### room_reviews

| カラム | 型 | 説明 | 変更種別 |
|--------|---|------|---------|
| (会議室評価の属性) | 情報.tsvの定義 | 会議室評価のデータ | 追加 |

## ビジネスルール

- 入力バリデーション（必須項目チェック、形式チェック）


## ティア完了条件（BDD）

```gherkin
Feature: 評価を登録する - バックエンドAPI

  Scenario: 会議室評価登録APIが正常にレスポンスを返す
    Given 認証済みの利用者のJWTトークンが有効である
    When POST /api/v1/reservations/:id/room-reviews にリクエストを送信する
    Then HTTP 201 でRoomReviewResponseが返却される
```
