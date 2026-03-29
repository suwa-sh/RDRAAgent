# オーナー情報を変更する - バックエンドAPI仕様

## 変更概要

オーナー情報を更新するAPIエンドポイントを新規作成する。自分自身のデータのみ変更可能とし、メールアドレス変更時はIdPと同期する。

## API 仕様

### オーナー情報更新

- **メソッド**: PUT
- **パス**: `/api/v1/owners/{owner_id}`
- **認証**: Bearer JWT（会議室オーナーロール）
- **OpenAPI**: [openapi.yaml](../../../_cross-cutting/api/openapi.yaml) の `paths./api/v1/owners/{owner_id}.put` を参照

#### リクエスト

| パラメータ | 型 | 必須 | 説明 |
|-----------|---|------|------|
| owner_id | string (path) | Yes | 変更対象のオーナーID（UUID） |
| name | string (body) | No | 氏名（最大50文字） |
| phone | string (body) | No | 連絡先電話番号 |
| email | string (body) | No | メールアドレス（変更時はIdP同期） |

#### レスポンス

| フィールド | 型 | 説明 |
|-----------|---|------|
| owner_id | string | オーナーID |
| name | string | 更新後の氏名 |
| phone | string | 更新後の連絡先 |
| email | string | 更新後のメールアドレス |
| updated_at | string | 更新日時（ISO 8601形式） |

#### エラーレスポンス

| ステータスコード | 条件 | レスポンス |
|----------------|------|-----------|
| 400 | バリデーションエラー（形式不正等） | `{"error": "validation_error"}` |
| 403 | 自分以外のオーナー情報を変更しようとした | `{"error": "forbidden"}` |
| 404 | 指定owner_idが存在しない | `{"error": "owner_not_found"}` |
| 409 | 新しいメールアドレスが既登録 | `{"error": "email_already_exists"}` |
| 422 | 退会済みオーナーが変更を試みた | `{"error": "invalid_status"}` |

## データモデル変更

### owners（既存テーブルへの変更）

| カラム | 型 | 説明 | 変更種別 |
|--------|---|------|---------|
| updated_at | TIMESTAMP | レコード更新日時 | 追加 |

## ビジネスルール

- オーナーは自分のデータのみ変更可能（ReBAC: owner→self 所有権チェック）
- 退会済みオーナーの情報変更は不可（状態モデル: オーナー）
- メールアドレス変更時はIdPのユーザー情報も同期更新する。IdP更新失敗時はRDB更新もロールバック
- 変更されたフィールドのみ更新する（部分更新）。提供されないフィールドは現在値を保持

## ティア完了条件（BDD）

```gherkin
Feature: オーナー情報を変更する - バックエンドAPI

  Scenario: 連絡先の変更が正常に反映される
    Given owner_id="abc-123"の登録済みオーナーが存在する
    When PUT /api/v1/owners/abc-123 に {"phone": "090-9999-8888"} を送信する（ownerロールのJWT付き）
    Then HTTP 200 が返り、レスポンスのphoneが「090-9999-8888」になる

  Scenario: 他のオーナー情報変更で403エラーが返る
    Given owner_id="abc-123"のオーナーがowner_id="xyz-789"に対してリクエストする
    When PUT /api/v1/owners/xyz-789 にリクエストを送信する
    Then HTTP 403 が返り、{"error": "forbidden"} が含まれる

  Scenario: 退会済みオーナーの情報変更で422エラーが返る
    Given owner_id="def-456"のオーナーが退会状態である
    When PUT /api/v1/owners/def-456 に {"phone": "090-1111-2222"} を送信する
    Then HTTP 422 が返り、{"error": "invalid_status"} が含まれる
```
