# サービスへ問合せする - バックエンドAPI仕様

## 変更概要

問合せ作成APIエンドポイントを追加する。利用者からのサービス宛問合せを受け付け、問合せ状態「未対応」で登録する。

## API 仕様

### 問合せ作成API

- **メソッド**: POST
- **パス**: `/api/v1/inquiries`
- **認証**: OAuth2/OIDC Bearer Token（userロール）
- **OpenAPI**: [openapi.yaml](../../_cross-cutting/api/openapi.yaml) の `paths./api/v1/inquiries.post` を参照

#### リクエスト

| パラメータ | 型 | 必須 | 説明 |
|-----------|---|------|------|
| inquiry_type | string | Yes | 問合せ先区分: service（サービス運営宛） |
| category | string | No | 問合せカテゴリー: usage/reservation/billing/technical/other |
| content | string | Yes | 問合せ内容（1〜1000文字） |

ヘッダー:
- `X-Idempotency-Key`: 冪等キー（UUID v4、フロントエンドが生成）

#### レスポンス

| フィールド | 型 | 説明 |
|-----------|---|------|
| inquiry_id | string | 作成された問合せID |
| status | string | 問合せ状態（未対応） |
| created_at | string | 問合せ日時（ISO8601） |

#### エラーレスポンス

| ステータスコード | 条件 | レスポンス |
|----------------|------|-----------|
| 400 | contentが空または1000文字超 | `{"error": "invalid_content", "message": "問合せ内容は1〜1000文字で入力してください"}` |
| 400 | inquiry_typeが無効 | `{"error": "invalid_inquiry_type"}` |
| 401 | 認証トークンが無効 | `{"error": "unauthorized"}` |

### 問合せ一覧取得API（利用者向け）

- **メソッド**: GET
- **パス**: `/api/v1/inquiries`
- **認証**: OAuth2/OIDC Bearer Token（userロール）
- **OpenAPI**: [openapi.yaml](../../_cross-cutting/api/openapi.yaml) の `paths./api/v1/inquiries.get` を参照

#### リクエスト

| パラメータ | 型 | 必須 | 説明 |
|-----------|---|------|------|
| page | integer | No | ページ番号（デフォルト: 1） |
| per_page | integer | No | 1ページあたり件数（デフォルト: 10） |

#### レスポンス

| フィールド | 型 | 説明 |
|-----------|---|------|
| inquiries[].inquiry_id | string | 問合せID |
| inquiries[].category | string | 問合せカテゴリー |
| inquiries[].content | string | 問合せ内容（先頭100文字） |
| inquiries[].status | string | 問合せ状態（未対応/回答済み/対応済み） |
| inquiries[].created_at | string | 問合せ日時 |
| inquiries[].answered_at | string\|null | 回答日時 |
| pagination.total | integer | 総件数 |

## データモデル変更

### 問合せ（inquiries テーブル）

| カラム | 型 | 説明 | 変更種別 |
|--------|---|------|---------|
| inquiry_id | VARCHAR(36) | 問合せID（PK） | 追加 |
| user_id | VARCHAR(36) | 利用者ID（FK） | 追加 |
| inquiry_destination | VARCHAR(20) | 問合せ先区分（service/owner） | 追加 |
| destination_id | VARCHAR(36)\|NULL | 問合せ先ID（ownerの場合はowner_id） | 追加 |
| category | VARCHAR(20) | 問合せカテゴリー | 追加 |
| content | TEXT | 問合せ内容（最大1000文字） | 追加 |
| answer_content | TEXT\|NULL | 回答内容 | 追加 |
| status | VARCHAR(20) | 問合せ状態（未対応/回答済み/対応済み） | 追加 |
| created_at | DATETIME | 問合せ日時 | 追加 |
| answered_at | DATETIME\|NULL | 回答日時 | 追加 |
| idempotency_key | VARCHAR(36) | 冪等キー（UNIQUE制約） | 追加 |

## ビジネスルール

- inquiry_typeが「service」の場合、問合せ先区分は「サービス運営宛問合せ」として登録
- 問合せ状態は作成時に「未対応」に設定
- 冪等キー（X-Idempotency-Key）をidempotency_keyカラムに保存し重複登録を防止（ON CONFLICT）
- 問合せ内容（content）はPIIとして扱い、アクセスを監査ログに記録する

## ティア完了条件（BDD）

```gherkin
Feature: サービスへ問合せする - バックエンドAPI

  Scenario: 問合せを正常に作成する
    Given userロールの認証トークンが有効である
    When POST /api/v1/inquiries に {"inquiry_type": "service", "category": "reservation", "content": "予約のキャンセル方法を教えてください"} でリクエストする
    Then HTTPステータス201で問合せIDとstatus="未対応"が返される

  Scenario: 問合せ内容が空の場合に400エラーになる
    Given userロールの認証トークンが有効である
    When POST /api/v1/inquiries に {"inquiry_type": "service", "content": ""} でリクエストする
    Then HTTPステータス400で {"error": "invalid_content"} が返される

  Scenario: 同一冪等キーで再送しても重複登録されない
    Given userロールの認証トークンが有効であり、同一X-Idempotency-Keyで問合せが既に作成済みである
    When POST /api/v1/inquiries に同一のX-Idempotency-Keyで再送する
    Then HTTPステータス201で前回と同じ問合せIDが返される（重複作成なし）
```
