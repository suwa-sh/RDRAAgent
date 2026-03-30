# 予約を変更する - バックエンドAPI仕様

## 変更概要

予約を変更するのAPIエンドポイントを実装する。予約情報を更新する。

## API 仕様

### 予約変更

- **メソッド**: PUT
- **パス**: /api/v1/reservations/:id
- **認証**: Bearer JWT
- **OpenAPI**: [openapi.yaml](../../../_cross-cutting/api/openapi.yaml) の paths./api/v1/reservations/{id}.put を参照

#### リクエスト

| パラメータ | 型 | 必須 | 説明 |
|-----------|---|------|------|
| (リクエストボディ) | UpdateReservationRequest | Yes | リクエストデータ |

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

- 入力バリデーション（必須項目チェック、形式チェック）
- 状態遷移: 予約状態 予約確定 → 変更中（変更申請）
- 状態遷移: 予約状態 変更中 → 予約確定（変更確定）

## ティア完了条件（BDD）

```gherkin
Feature: 予約を変更する - バックエンドAPI

  Scenario: 予約変更APIが正常にレスポンスを返す
    Given 認証済みの利用者のJWTトークンが有効である
    When PUT /api/v1/reservations/:id にリクエストを送信する
    Then HTTP 200 でReservationResponseが返却される
```
