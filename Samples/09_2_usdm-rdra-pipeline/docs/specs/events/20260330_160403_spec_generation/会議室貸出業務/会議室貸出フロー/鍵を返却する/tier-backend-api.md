# 鍵を返却する - バックエンドAPI仕様

## 変更概要

鍵を返却するのAPIエンドポイントを実装する。鍵を更新する。

## API 仕様

### 鍵返却

- **メソッド**: POST
- **パス**: /api/v1/reservations/:id/key/return
- **認証**: Bearer JWT
- **OpenAPI**: [openapi.yaml](../../../_cross-cutting/api/openapi.yaml) の paths./api/v1/reservations/{id}/key/return.post を参照

#### リクエスト

リクエストボディなし（GETリクエスト）

#### レスポンス

| フィールド | 型 | 説明 |
|-----------|---|------|
| data | KeyResponse | レスポンスデータ |

#### エラーレスポンス

| ステータスコード | 条件 | レスポンス |
|----------------|------|-----------|
| 400 | バリデーションエラー | {code: "VALIDATION_ERROR", message: "入力値が不正です"} |
| 401 | 認証エラー | {code: "UNAUTHORIZED", message: "認証が必要です"} |
| 403 | 認可エラー | {code: "FORBIDDEN", message: "権限がありません"} |
| 404 | リソース未存在 | {code: "NOT_FOUND", message: "リソースが見つかりません"} |

## データモデル変更

### keys

| カラム | 型 | 説明 | 変更種別 |
|--------|---|------|---------|
| (鍵の属性) | 情報.tsvの定義 | 鍵のデータ | 更新 |

### reservations

| カラム | 型 | 説明 | 変更種別 |
|--------|---|------|---------|
| (予約情報の属性) | 情報.tsvの定義 | 予約情報のデータ | 更新 |

## ビジネスルール

- 入力バリデーション（必須項目チェック、形式チェック）
- 状態遷移: 鍵状態 貸出中 → 返却済（鍵を返却する）
- 状態遷移: 予約状態 予約確定 → 利用済（鍵を返却する）
- 状態遷移: 会議室利用状態 利用中 → 利用終了（鍵を返却する）

## ティア完了条件（BDD）

```gherkin
Feature: 鍵を返却する - バックエンドAPI

  Scenario: 鍵返却APIが正常にレスポンスを返す
    Given 認証済みの会議室オーナーのJWTトークンが有効である
    When POST /api/v1/reservations/:id/key/return にリクエストを送信する
    Then HTTP 201 でKeyResponseが返却される
```
