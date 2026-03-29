# 問合せに対応する - バックエンドAPI仕様

## 変更概要

管理者向け問合せ一覧・詳細・回答・状態更新APIエンドポイントを追加する。問合せ状態の遷移（未対応→回答済み→対応済み）を制御する。

## API 仕様

### 管理者向け問合せ一覧取得API

- **メソッド**: GET
- **パス**: `/api/v1/admin/inquiries`
- **認証**: OAuth2/OIDC Bearer Token（adminロール必須）
- **OpenAPI**: [openapi.yaml](../../_cross-cutting/api/openapi.yaml) の `paths./api/v1/admin/inquiries.get` を参照

#### リクエスト

| パラメータ | 型 | 必須 | 説明 |
|-----------|---|------|------|
| status | string | No | 状態フィルター: pending/answered/resolved（未指定で全件） |
| keyword | string | No | キーワード検索（問合せ内容・利用者名） |
| page | integer | No | ページ番号 |
| per_page | integer | No | 1ページあたり件数（デフォルト: 20） |

#### レスポンス

| フィールド | 型 | 説明 |
|-----------|---|------|
| inquiries[].inquiry_id | string | 問合せID |
| inquiries[].user_name | string | 利用者名 |
| inquiries[].category | string | 問合せカテゴリー |
| inquiries[].content_preview | string | 問合せ内容（先頭100文字） |
| inquiries[].status | string | 問合せ状態 |
| inquiries[].created_at | string | 問合せ日時 |
| inquiries[].answered_at | string\|null | 回答日時 |
| summary.pending_count | integer | 未対応件数 |
| pagination.total | integer | 総件数 |

### 問合せ回答API

- **メソッド**: POST
- **パス**: `/api/v1/admin/inquiries/{inquiry_id}/answer`
- **認証**: OAuth2/OIDC Bearer Token（adminロール必須）
- **OpenAPI**: [openapi.yaml](../../_cross-cutting/api/openapi.yaml) の `paths./api/v1/admin/inquiries/{inquiry_id}/answer.post` を参照

#### リクエスト

| パラメータ | 型 | 必須 | 説明 |
|-----------|---|------|------|
| answer_content | string | Yes | 回答内容（1〜2000文字） |

ヘッダー:
- `X-Idempotency-Key`: 冪等キー（UUID v4）

#### レスポンス

| フィールド | 型 | 説明 |
|-----------|---|------|
| inquiry_id | string | 問合せID |
| status | string | 更新後の状態（回答済み） |
| answered_at | string | 回答日時 |

#### エラーレスポンス

| ステータスコード | 条件 | レスポンス |
|----------------|------|-----------|
| 400 | answer_contentが空または2000文字超 | `{"error": "invalid_answer_content"}` |
| 404 | 問合せが存在しない | `{"error": "not_found"}` |
| 409 | 既に対応済みの問合せへの回答 | `{"error": "already_resolved"}` |
| 403 | adminロール以外 | `{"error": "forbidden"}` |

### 問合せ状態更新API

- **メソッド**: PUT
- **パス**: `/api/v1/admin/inquiries/{inquiry_id}/status`
- **認証**: OAuth2/OIDC Bearer Token（adminロール必須）
- **OpenAPI**: [openapi.yaml](../../_cross-cutting/api/openapi.yaml) の `paths./api/v1/admin/inquiries/{inquiry_id}/status.put` を参照

#### リクエスト

| パラメータ | 型 | 必須 | 説明 |
|-----------|---|------|------|
| status | string | Yes | 新しい状態: resolved（対応済み） |

#### エラーレスポンス

| ステータスコード | 条件 | レスポンス |
|----------------|------|-----------|
| 400 | 無効な状態遷移（例: 未対応→対応済み） | `{"error": "invalid_status_transition", "message": "未対応状態から直接対応済みにすることはできません。先に回答を送信してください"}` |
| 404 | 問合せが存在しない | `{"error": "not_found"}` |

## データモデル変更

問合せ（inquiries テーブル）は「サービスへ問合せするUC」で定義済み。answer_contentとanswered_atカラムを利用する。

## ビジネスルール

- 状態遷移ルール: 未対応→回答済み（回答送信時）、回答済み→対応済み（対応完了時）のみ有効
- 「未対応→対応済み」のスキップは禁止（必ず回答済みを経由すること）
- 回答送信時はanswer_content（回答内容）とanswered_at（回答日時）を記録
- 個人情報アクセス（利用者情報・問合せ内容）は監査ログに記録
- 回答送信は状態変更を伴うためX-Idempotency-Keyで冪等性を確保

## ティア完了条件（BDD）

```gherkin
Feature: 問合せに対応する - バックエンドAPI

  Scenario: 未対応の問合せに回答を送信する
    Given adminロールの認証トークンが有効であり、inquiry_id=INQ-001のstatus=pendingの問合せが存在する
    When POST /api/v1/admin/inquiries/INQ-001/answer に {"answer_content": "予約詳細画面からキャンセルできます"} でリクエストする
    Then HTTPステータス200でstatus="回答済み"とanswered_atが返される

  Scenario: 対応済みの問合せに再回答しようとすると409エラーになる
    Given inquiry_id=INQ-001のstatus=resolvedの問合せが存在する
    When POST /api/v1/admin/inquiries/INQ-001/answer に回答内容を送信する
    Then HTTPステータス409で {"error": "already_resolved"} が返される

  Scenario: 未対応から直接対応済みにしようとすると400エラーになる
    Given inquiry_id=INQ-002のstatus=pendingの問合せが存在する
    When PUT /api/v1/admin/inquiries/INQ-002/status に {"status": "resolved"} を送信する
    Then HTTPステータス400で {"error": "invalid_status_transition"} が返される
```
