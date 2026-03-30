# オーナー精算を実行する - バックエンドAPI仕様

## 変更概要

オーナー精算を実行するのAPIエンドポイントを実装する。精算情報, 利用実績を登録する。

## API 仕様

### 精算実行

- **メソッド**: POST
- **パス**: /api/v1/admin/settlements/execute
- **認証**: Bearer JWT
- **OpenAPI**: [openapi.yaml](../../../_cross-cutting/api/openapi.yaml) の paths./api/v1/admin/settlements/execute.post を参照

#### リクエスト

| パラメータ | 型 | 必須 | 説明 |
|-----------|---|------|------|
| (リクエストボディ) | ExecuteSettlementRequest | Yes | リクエストデータ |

#### レスポンス

| フィールド | 型 | 説明 |
|-----------|---|------|
| data | SettlementExecutionResponse | レスポンスデータ |

#### エラーレスポンス

| ステータスコード | 条件 | レスポンス |
|----------------|------|-----------|
| 400 | バリデーションエラー | {code: "VALIDATION_ERROR", message: "入力値が不正です"} |
| 401 | 認証エラー | {code: "UNAUTHORIZED", message: "認証が必要です"} |
| 403 | 認可エラー | {code: "FORBIDDEN", message: "権限がありません"} |
| 404 | リソース未存在 | {code: "NOT_FOUND", message: "リソースが見つかりません"} |

## 非同期イベント

### 決済機関への精算依頼

- **チャネル**: settlement-request-queue
- **方向**: publish
- **AsyncAPI**: [asyncapi.yaml](../../../_cross-cutting/api/asyncapi.yaml) の channels.settlement-request-queue を参照

#### メッセージスキーマ

| フィールド | 型 | 説明 |
|-----------|---|------|
| settlement_id | string | 精算ID |
| owner_id | string | オーナーID |
| amount | number | 精算金額 |
| month | string | 精算月 |

## データモデル変更

### settlements

| カラム | 型 | 説明 | 変更種別 |
|--------|---|------|---------|
| (精算情報の属性) | 情報.tsvの定義 | 精算情報のデータ | 追加 |

### usage_records

| カラム | 型 | 説明 | 変更種別 |
|--------|---|------|---------|
| (利用実績の属性) | 情報.tsvの定義 | 利用実績のデータ | 参照のみ |

## ビジネスルール

- 精算ルール: 条件.tsvの定義に従う


## ティア完了条件（BDD）

```gherkin
Feature: オーナー精算を実行する - バックエンドAPI

  Scenario: 精算実行APIが正常にレスポンスを返す
    Given 認証済みのサービス運営担当者のJWTトークンが有効である
    When POST /api/v1/admin/settlements/execute にリクエストを送信する
    Then HTTP 201 でSettlementExecutionResponseが返却される
```
