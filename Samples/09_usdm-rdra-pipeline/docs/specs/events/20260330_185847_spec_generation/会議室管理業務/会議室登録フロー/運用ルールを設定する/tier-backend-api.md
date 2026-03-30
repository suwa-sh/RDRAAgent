# 運用ルールを設定する - バックエンドAPI仕様

## 変更概要

キャンセルポリシーや貸出可否を設定するのためのAPIエンドポイントを実装する。

## API 仕様

### 運用ルールを設定するAPI

- **メソッド**: PUT
- **パス**: /api/v1/rooms/{room_id}/rules
- **認証**: Bearer Token (JWT)
- **OpenAPI**: [openapi.yaml](../../_cross-cutting/api/openapi.yaml) の `paths./api/v1/rooms/{id}/rules.put` を参照

#### リクエスト

| パラメータ | 型 | 必須 | 説明 |
|-----------|---|------|------|
| 運用ルール | object | Yes | 運用ルールデータ |

#### レスポンス

| フィールド | 型 | 説明 |
|-----------|---|------|
| id | string | 作成/更新されたリソースID |
| status | string | 処理結果ステータス |

#### エラーレスポンス

| ステータスコード | 条件 | レスポンス |
|----------------|------|-----------|
| 400 | バリデーションエラー | { code: "VALIDATION_ERROR", message: "入力内容に誤りがあります" } |
| 401 | 認証トークン無効 | { code: "UNAUTHORIZED", message: "認証が必要です" } |
| 403 | 会議室オーナー以外のアクセス | { code: "FORBIDDEN", message: "アクセス権限がありません" } |
| 404 | リソース未存在 | { code: "NOT_FOUND", message: "指定されたリソースが見つかりません" } |

## データモデル変更

### operation_rules

| カラム | 型 | 説明 | 変更種別 |
|--------|---|------|---------|
| id | uuid | 運用ルールID | 既存 |
| updated_at | datetime | 更新日時 | 更新 |

## ビジネスルール

- 入力バリデーション（必須チェック、形式チェック）


## ティア完了条件（BDD）

```gherkin
Feature: 運用ルールを設定する - バックエンドAPI

  Scenario: 正常リクエスト
    Given 有効なJWTトークンが設定されている
    When PUT /api/v1/rooms/{room_id}/rules にリクエストを送信する
    Then HTTP 201 が返却される

  Scenario: 認証エラー
    Given JWTトークンが未設定である
    When PUT /api/v1/rooms/{room_id}/rules にリクエストを送信する
    Then HTTP 401 が返却される
```
