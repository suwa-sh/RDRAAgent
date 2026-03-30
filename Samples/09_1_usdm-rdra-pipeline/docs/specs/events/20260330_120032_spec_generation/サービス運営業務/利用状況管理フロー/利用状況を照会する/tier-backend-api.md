# 利用状況を照会する - バックエンド API 仕様

## 変更概要

利用状況を照会するのAPIを実装する。

## API 仕様

### 利用状況を照会する API

- **メソッド**: GET
- **パス**: /api/v1/admin/analytics/usage
- **認証**: Bearer JWT（サービス運営担当者ロール）
- **OpenAPI**: [openapi.yaml](../../_cross-cutting/api/openapi.yaml) の paths 参照

#### リクエスト

主要パラメータは情報モデル（利用履歴）から導出。

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
Feature: 利用状況を照会する - バックエンド API

  Scenario: 正常リクエスト
    Given 認証済みのサービス運営担当者
    When GET /api/v1/admin/analytics/usage をリクエストする
    Then 正常レスポンスが返る
```
