# 予約を取消する - バックエンド API 仕様

## 変更概要

予約を取消するのAPIを実装する。

## API 仕様

### 予約を取消する API

- **メソッド**: POST
- **パス**: /api/v1/reservations/{id}/actions/cancel
- **認証**: Bearer JWT（利用者ロール）
- **OpenAPI**: [openapi.yaml](../../_cross-cutting/api/openapi.yaml) の paths 参照

#### リクエスト

主要パラメータは情報モデル（予約）から導出。

#### レスポンス

操作結果のJSONレスポンス。

#### エラーレスポンス

| ステータスコード | 条件 | レスポンス |
|----------------|------|-----------|
| 400 | バリデーションエラー | {"code": "VALIDATION_ERROR", "message": "入力値が不正です"} |
| 401 | 認証エラー | {"code": "UNAUTHORIZED", "message": "認証が必要です"} |
| 403 | 認可エラー | {"code": "FORBIDDEN", "message": "権限がありません"} |

## ビジネスルール

- RDRA モデルから導出されたビジネスルールを適用

## ティア完了条件（BDD）

```gherkin
Feature: 予約を取消する - バックエンド API

  Scenario: 正常リクエスト
    Given 認証済みの利用者
    When POST /api/v1/reservations/{id}/actions/cancel をリクエストする
    Then 正常レスポンスが返る
```
