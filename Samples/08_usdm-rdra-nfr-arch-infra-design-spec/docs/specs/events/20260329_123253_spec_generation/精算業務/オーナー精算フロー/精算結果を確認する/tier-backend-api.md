# 精算結果を確認する - バックエンドAPI仕様

## 変更概要

オーナー向け精算一覧・詳細取得APIを追加する。ReBAC（所有権ベースアクセス制御）による認可チェックで、自身の精算情報のみ参照可能にする。

## API 仕様

### オーナー向け精算一覧取得API

- **メソッド**: GET
- **パス**: `/api/v1/owner/settlements`
- **認証**: OAuth2/OIDC Bearer Token（ownerロール）
- **OpenAPI**: [openapi.yaml](../../_cross-cutting/api/openapi.yaml) の `paths./api/v1/owner/settlements.get` を参照

#### リクエスト

| パラメータ | 型 | 必須 | 説明 |
|-----------|---|------|------|
| status | string | No | 状態フィルター: pending/calculated/processing/paid |
| page | integer | No | ページ番号（デフォルト: 1） |
| per_page | integer | No | 1ページあたり件数（デフォルト: 12） |

#### レスポンス

| フィールド | 型 | 説明 |
|-----------|---|------|
| total_paid_amount | integer | 累計受取金額（支払済みの合計、円） |
| settlements[].settlement_id | string | 精算ID |
| settlements[].target_month | string | 精算対象月（YYYY-MM） |
| settlements[].settlement_amount | integer | 精算額（円） |
| settlements[].payment_date | string\|null | 支払日（ISO8601 date） |
| settlements[].status | string | 精算状態 |
| pagination.total | integer | 総件数 |

#### エラーレスポンス

| ステータスコード | 条件 | レスポンス |
|----------------|------|-----------|
| 401 | 認証トークンが無効 | `{"error": "unauthorized"}` |
| 403 | ownerロール以外 | `{"error": "forbidden"}` |

### オーナー向け精算詳細取得API

- **メソッド**: GET
- **パス**: `/api/v1/owner/settlements/{settlement_id}`
- **認証**: OAuth2/OIDC Bearer Token（ownerロール）
- **OpenAPI**: [openapi.yaml](../../_cross-cutting/api/openapi.yaml) の `paths./api/v1/owner/settlements/{settlement_id}.get` を参照

#### レスポンス

| フィールド | 型 | 説明 |
|-----------|---|------|
| settlement_id | string | 精算ID |
| target_month | string | 精算対象月 |
| total_usage_amount | integer | 利用料合計（円） |
| total_fee_amount | integer | 手数料合計（円） |
| settlement_amount | integer | 精算額（円） |
| status | string | 精算状態 |
| payment_date | string\|null | 支払日 |
| payment_gateway_id | string\|null | 決済機関連携ID（支払済み時のみ） |

#### エラーレスポンス

| ステータスコード | 条件 | レスポンス |
|----------------|------|-----------|
| 403 | 他のオーナーの精算への不正アクセス | `{"error": "forbidden"}` |
| 404 | 精算IDが存在しない | `{"error": "not_found"}` |

## データモデル変更

既存テーブルの参照のみ。変更なし。

## ビジネスルール

- ReBAC認可サービスに `Check('owner:{owner_id}', 'view', 'settlement:{settlement_id}')` で問い合わせ、自身の精算のみアクセス可能
- 未精算/精算計算済み/支払処理中/支払済みの全状態の精算が表示対象
- 決済機関連携ID（payment_gateway_id）は支払済み状態のみ返す
- 個人情報（精算額・支払情報）アクセスは監査ログに記録する（CTR-002）

## ティア完了条件（BDD）

```gherkin
Feature: 精算結果を確認する - バックエンドAPI

  Scenario: 自身の精算一覧を取得する
    Given owner_id=O-001のownerロールの認証トークンが有効である
    When GET /api/v1/owner/settlements にリクエストする
    Then HTTPステータス200でowner_id=O-001の精算一覧と累計受取金額が返される

  Scenario: 他のオーナーの精算詳細にアクセスすると403になる
    Given owner_id=O-001のownerロールの認証トークンが有効である
    When GET /api/v1/owner/settlements/SETTLE-999（owner_id=O-999の精算）にリクエストする
    Then HTTPステータス403が返される
```
