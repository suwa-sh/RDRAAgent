# オーナー申請する - バックエンドAPI仕様

## 変更概要

サービスへの参加申請を行うのためのAPIエンドポイントを実装する。

## API 仕様

### オーナー申請するAPI

- **メソッド**: POST
- **パス**: /api/v1/owners/{owner_id}/actions/apply
- **認証**: Bearer Token (JWT)
- **OpenAPI**: [openapi.yaml](../../_cross-cutting/api/openapi.yaml) の `paths./api/v1/owners/{id}/actions/apply.post` を参照

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
| 403 | 会議室オーナー以外のアクセス | { code: "FORBIDDEN", message: "アクセス権限がありません" } |
| 404 | リソース未存在 | { code: "NOT_FOUND", message: "指定されたリソースが見つかりません" } |

## データモデル変更

### owners

| カラム | 型 | 説明 | 変更種別 |
|--------|---|------|---------|
| id | uuid | オーナー情報ID | 既存 |
| updated_at | datetime | 更新日時 | 更新 |

## ビジネスルール

- 入力バリデーション（必須チェック、形式チェック）
- 状態遷移: オーナー申請状態を未申請から申請中に遷移
- 状態遷移: オーナー申請状態を却下から申請中に遷移

## ティア完了条件（BDD）

```gherkin
Feature: オーナー申請する - バックエンドAPI

  Scenario: 正常リクエスト
    Given 有効なJWTトークンが設定されている
    When POST /api/v1/owners/{owner_id}/actions/apply にリクエストを送信する
    Then HTTP 201 が返却される

  Scenario: 認証エラー
    Given JWTトークンが未設定である
    When POST /api/v1/owners/{owner_id}/actions/apply にリクエストを送信する
    Then HTTP 401 が返却される
```
