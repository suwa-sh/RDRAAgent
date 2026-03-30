# オーナー登録を審査する - バックエンドAPI仕様

## 変更概要

オーナー申請を審査し承認または却下するのためのAPIエンドポイントを実装する。

## API 仕様

### オーナー登録を審査するAPI

- **メソッド**: POST
- **パス**: /api/v1/owners/{owner_id}/actions/review
- **認証**: Bearer Token (JWT)
- **OpenAPI**: [openapi.yaml](../../_cross-cutting/api/openapi.yaml) の `paths./api/v1/owners/{id}/actions/review.post` を参照

#### リクエスト

| パラメータ | 型 | 必須 | 説明 |
|-----------|---|------|------|
| オーナー | object | Yes | オーナー情報データ |

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
| 403 | サービス運営担当者以外のアクセス | { code: "FORBIDDEN", message: "アクセス権限がありません" } |
| 404 | リソース未存在 | { code: "NOT_FOUND", message: "指定されたリソースが見つかりません" } |

## データモデル変更

### owners

| カラム | 型 | 説明 | 変更種別 |
|--------|---|------|---------|
| id | uuid | オーナー情報ID | 既存 |
| updated_at | datetime | 更新日時 | 更新 |

## ビジネスルール

- オーナー審査条件: RDRA条件定義に基づく判定ロジック
- 状態遷移: オーナー申請状態を申請中から審査中に遷移
- 状態遷移: オーナー申請状態を審査中から承認に遷移
- 状態遷移: オーナー申請状態を審査中から却下に遷移

## ティア完了条件（BDD）

```gherkin
Feature: オーナー登録を審査する - バックエンドAPI

  Scenario: 正常リクエスト
    Given 有効なJWTトークンが設定されている
    When POST /api/v1/owners/{owner_id}/actions/review にリクエストを送信する
    Then HTTP 201 が返却される

  Scenario: 認証エラー
    Given JWTトークンが未設定である
    When POST /api/v1/owners/{owner_id}/actions/review にリクエストを送信する
    Then HTTP 401 が返却される
```
