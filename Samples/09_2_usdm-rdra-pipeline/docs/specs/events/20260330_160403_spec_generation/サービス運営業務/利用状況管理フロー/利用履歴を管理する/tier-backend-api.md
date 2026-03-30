# 利用履歴を管理する - バックエンドAPI仕様

## 変更概要

利用履歴を管理するのAPIエンドポイントを実装する。利用履歴を取得する。

## API 仕様

### 利用履歴一覧取得

- **メソッド**: GET
- **パス**: /api/v1/admin/usage-history
- **認証**: Bearer JWT
- **OpenAPI**: [openapi.yaml](../../../_cross-cutting/api/openapi.yaml) の paths./api/v1/admin/usage-history.get を参照

#### リクエスト

リクエストボディなし（GETリクエスト）

#### レスポンス

| フィールド | 型 | 説明 |
|-----------|---|------|
| data | UsageHistoryListResponse | レスポンスデータ |

#### エラーレスポンス

| ステータスコード | 条件 | レスポンス |
|----------------|------|-----------|
| 400 | バリデーションエラー | {code: "VALIDATION_ERROR", message: "入力値が不正です"} |
| 401 | 認証エラー | {code: "UNAUTHORIZED", message: "認証が必要です"} |
| 403 | 認可エラー | {code: "FORBIDDEN", message: "権限がありません"} |
| 404 | リソース未存在 | {code: "NOT_FOUND", message: "リソースが見つかりません"} |

## データモデル変更

### usage_history

| カラム | 型 | 説明 | 変更種別 |
|--------|---|------|---------|
| (利用履歴の属性) | 情報.tsvの定義 | 利用履歴のデータ | 参照のみ |

## ビジネスルール

- 入力バリデーション（必須項目チェック、形式チェック）


## ティア完了条件（BDD）

```gherkin
Feature: 利用履歴を管理する - バックエンドAPI

  Scenario: 利用履歴一覧取得APIが正常にレスポンスを返す
    Given 認証済みのサービス運営担当者のJWTトークンが有効である
    When GET /api/v1/admin/usage-history にリクエストを送信する
    Then HTTP 200 でUsageHistoryListResponseが返却される
```
