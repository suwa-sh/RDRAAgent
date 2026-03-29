# オーナー登録申請を行う - バックエンドAPI仕様

## 変更概要

オーナー登録申請を受け付けるAPIエンドポイントを新規作成する。メールアドレスの重複チェック、オーナー情報の永続化、審査待ち状態への遷移を行う。

## API 仕様

### オーナー登録申請

- **メソッド**: POST
- **パス**: `/api/v1/owners/applications`
- **認証**: 不要（新規登録フロー）
- **OpenAPI**: [openapi.yaml](../../../_cross-cutting/api/openapi.yaml) の `paths./api/v1/owners/applications.post` を参照

#### リクエスト

| パラメータ | 型 | 必須 | 説明 |
|-----------|---|------|------|
| name | string | Yes | 氏名（最大50文字） |
| phone | string | Yes | 連絡先電話番号（例: 090-1234-5678） |
| email | string | Yes | メールアドレス（RFC 5322準拠） |

#### レスポンス

| フィールド | 型 | 説明 |
|-----------|---|------|
| owner_id | string | 採番されたオーナーID（UUID） |
| status | string | 審査状態（固定値: "審査待ち"） |
| created_at | string | 申請日時（ISO 8601形式） |

#### エラーレスポンス

| ステータスコード | 条件 | レスポンス |
|----------------|------|-----------|
| 400 | 必須項目未入力またはメール形式不正 | `{"error": "validation_error", "fields": {"email": "invalid_format"}}` |
| 409 | 同一メールアドレスのオーナーが既に存在する | `{"error": "email_already_exists"}` |
| 500 | サーバー内部エラー | `{"error": "internal_server_error"}` |

## データモデル変更

### owners（新規テーブル）

| カラム | 型 | 説明 | 変更種別 |
|--------|---|------|---------|
| owner_id | UUID | オーナーID（PK） | 追加 |
| name | VARCHAR(50) | 氏名 | 追加 |
| phone | VARCHAR(20) | 連絡先電話番号 | 追加 |
| email | VARCHAR(255) | メールアドレス（UNIQUE） | 追加 |
| status | VARCHAR(20) | 審査状態（審査待ち/登録済み/却下/退会） | 追加 |
| applied_at | TIMESTAMP | 申請日時 | 追加 |
| created_at | TIMESTAMP | レコード作成日時 | 追加 |
| updated_at | TIMESTAMP | レコード更新日時 | 追加 |

## ビジネスルール

- メールアドレスはシステム全体で一意であること（オーナー登録審査条件）
- 申請受付時はオーナーの状態を必ず「審査待ち」で作成する（状態モデル: オーナー）
- 個人情報（氏名・連絡先・メールアドレス）はRDB保管時に暗号化する（NFR E.6.1.1）
- 申請日時は UTC で記録する

## ティア完了条件（BDD）

```gherkin
Feature: オーナー登録申請を行う - バックエンドAPI

  Scenario: 正常な申請情報でオーナーレコードが作成される
    Given オーナー登録APIが起動している
    When POST /api/v1/owners/applications に {"name": "田中一郎", "phone": "090-1234-5678", "email": "tanaka@example.com"} を送信する
    Then HTTP 201 が返り、レスポンスボディに owner_id と status: "審査待ち" が含まれる

  Scenario: 重複メールアドレスで409エラーが返る
    Given メールアドレス「tanaka@example.com」のオーナーが既にDBに存在する
    When POST /api/v1/owners/applications に同じメールアドレスで申請リクエストを送信する
    Then HTTP 409 が返り、{"error": "email_already_exists"} が含まれる

  Scenario: 必須項目欠落で400エラーが返る
    Given オーナー登録APIが起動している
    When POST /api/v1/owners/applications に {"email": "tanaka@example.com"} のみを送信する（nameが欠落）
    Then HTTP 400 が返り、{"error": "validation_error"} が含まれる
```
