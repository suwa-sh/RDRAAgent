# 予約を取消する - バックエンドAPI仕様

## 変更概要

予約を取消するのAPIエンドポイントを実装する。予約情報を更新する。

## API 仕様

### 予約取消

- **メソッド**: POST
- **パス**: /api/v1/reservations/:id/cancel
- **認証**: Bearer JWT
- **OpenAPI**: [openapi.yaml](../../../_cross-cutting/api/openapi.yaml) の paths./api/v1/reservations/{id}/cancel.post を参照

#### リクエスト

| パラメータ | 型 | 必須 | 説明 |
|-----------|---|------|------|
| (リクエストボディ) | CancelReservationRequest | Yes | リクエストデータ |

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

## ビジネスルール

- キャンセルポリシー: 条件.tsvの定義に従う
- 状態遷移: 予約状態 予約申請中 → 取消済（予約を取消する）
- 状態遷移: 予約状態 予約確定 → 取消済（予約を取消する）

## ティア完了条件（BDD）

```gherkin
Feature: 予約を取消する - バックエンドAPI

  Scenario: 予約取消APIが正常にレスポンスを返す
    Given 認証済みの利用者のJWTトークンが有効である
    When POST /api/v1/reservations/:id/cancel にリクエストを送信する
    Then HTTP 201 でReservationResponseが返却される
```
