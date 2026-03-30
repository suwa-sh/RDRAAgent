# 会議室を予約する - バックエンドAPI仕様

## 変更概要

会議室を予約するのAPIエンドポイントを実装する。予約情報, 決済情報を登録する。

## API 仕様

### 会議室予約

- **メソッド**: POST
- **パス**: /api/v1/reservations
- **認証**: Bearer JWT
- **OpenAPI**: [openapi.yaml](../../../_cross-cutting/api/openapi.yaml) の paths./api/v1/reservations.post を参照

#### リクエスト

| パラメータ | 型 | 必須 | 説明 |
|-----------|---|------|------|
| (リクエストボディ) | CreateReservationRequest | Yes | リクエストデータ |

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
| (予約情報の属性) | 情報.tsvの定義 | 予約情報のデータ | 追加 |

## ビジネスルール

- 入力バリデーション（必須項目チェック、形式チェック）
- 状態遷移: 予約状態 予約申請中 → 予約確定（会議室を予約する）

## ティア完了条件（BDD）

```gherkin
Feature: 会議室を予約する - バックエンドAPI

  Scenario: 会議室予約APIが正常にレスポンスを返す
    Given 認証済みの利用者のJWTトークンが有効である
    When POST /api/v1/reservations にリクエストを送信する
    Then HTTP 201 でReservationResponseが返却される
```
