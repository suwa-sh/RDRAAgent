# プロフィールを登録する - バックエンド API 仕様

## 変更概要

プロフィールを登録するのAPIを実装する。

## API 仕様

### プロフィールを登録する API

- **メソッド**: POST
- **パス**: /api/v1/owners/profile
- **認証**: Bearer JWT（会議室オーナーロール）
- **OpenAPI**: [openapi.yaml](../../_cross-cutting/api/openapi.yaml) の paths 参照

#### リクエスト

主要パラメータは情報モデル（オーナープロフィール）から導出。

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
Feature: プロフィールを登録する - バックエンド API

  Scenario: 正常リクエスト
    Given 認証済みの会議室オーナー
    When POST /api/v1/owners/profile をリクエストする
    Then 正常レスポンスが返る
```
