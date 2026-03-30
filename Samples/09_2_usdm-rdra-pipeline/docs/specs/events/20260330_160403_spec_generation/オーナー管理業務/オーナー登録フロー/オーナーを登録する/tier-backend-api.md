# オーナーを登録する - バックエンドAPI仕様

## 変更概要

オーナー登録のAPIエンドポイントを実装する。オーナー情報を登録する。

## API 仕様

### オーナー登録

- **メソッド**: POST
- **パス**: /api/v1/owners
- **認証**: Bearer JWT
- **OpenAPI**: [openapi.yaml](../../../_cross-cutting/api/openapi.yaml) の paths./api/v1/owners.post を参照

#### リクエスト

| パラメータ | 型 | 必須 | 説明 |
|-----------|---|------|------|
| name | string | Yes | 氏名 |
| email | string | Yes | メールアドレス |
| phone | string | Yes | 電話番号 |
| profile | string | No | プロフィール |

#### レスポンス

| フィールド | 型 | 説明 |
|-----------|---|------|
| owner_id | string | オーナーID |
| status | string | オーナー状態 |

#### エラーレスポンス

| ステータスコード | 条件 | レスポンス |
|----------------|------|-----------|
| 400 | バリデーションエラー | {code: "VALIDATION_ERROR", message: "入力値が不正です"} |
| 401 | 認証エラー | {code: "UNAUTHORIZED", message: "認証が必要です"} |
| 409 | メールアドレス重複 | {code: "CONFLICT", message: "このメールアドレスは既に登録されています"} |

## データモデル変更

### owners

| カラム | 型 | 説明 | 変更種別 |
|--------|---|------|---------|
| owner_id | uuid | オーナーID | 追加 |
| name | string | 氏名 | 追加 |
| email | string | メールアドレス | 追加 |
| phone | string | 電話番号 | 追加 |
| profile | text | プロフィール | 追加 |
| current_status | string | オーナー状態(申請中) | 追加 |

## ビジネスルール

- 入力バリデーション（氏名必須、メールアドレス形式、電話番号形式）
- メールアドレスの一意性チェック
- 状態遷移: オーナー状態 未登録 → 申請中

## ティア完了条件（BDD）

```gherkin
Feature: オーナーを登録する - バックエンドAPI

  Scenario: オーナー登録APIが正常にレスポンスを返す
    Given 認証済みの会議室オーナーのJWTトークンが有効である
    When POST /api/v1/owners に氏名「田中太郎」、メールアドレス「tanaka@example.com」、電話番号「090-1234-5678」を送信する
    Then HTTP 201 で {owner_id, status: "申請中"} が返却される
```
