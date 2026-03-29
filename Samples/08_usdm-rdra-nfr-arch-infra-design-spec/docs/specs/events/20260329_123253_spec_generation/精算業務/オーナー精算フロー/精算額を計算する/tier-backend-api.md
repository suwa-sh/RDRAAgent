# 精算額を計算する - バックエンドAPI仕様

## 変更概要

精算額計算APIエンドポイントを追加する。対象月の利用履歴と手数料売上を集計し、オーナー別精算額を計算して精算情報を「精算計算済み」に遷移させる。

## API 仕様

### 精算額計算API

- **メソッド**: POST
- **パス**: `/api/v1/admin/settlements/calculate`
- **認証**: OAuth2/OIDC Bearer Token（adminロール必須）
- **OpenAPI**: [openapi.yaml](../../_cross-cutting/api/openapi.yaml) の `paths./api/v1/admin/settlements/calculate.post` を参照

#### リクエスト

| パラメータ | 型 | 必須 | 説明 |
|-----------|---|------|------|
| target_month | string | Yes | 精算対象月（YYYY-MM形式、例: 2026-02） |
| force | boolean | No | 既計算済み月を強制再計算（デフォルト: false） |

ヘッダー:
- `X-Idempotency-Key`: 冪等キー（UUID v4）

#### レスポンス

| フィールド | 型 | 説明 |
|-----------|---|------|
| target_month | string | 精算対象月 |
| settlement_count | integer | 計算したオーナー数 |
| settlements[] | array | オーナー別精算情報 |
| settlements[].settlement_id | string | 精算ID |
| settlements[].owner_id | string | オーナーID |
| settlements[].owner_name | string | オーナー名 |
| settlements[].total_usage_amount | integer | 利用料合計（円） |
| settlements[].total_fee_amount | integer | 手数料合計（円） |
| settlements[].settlement_amount | integer | 精算額（円）: 利用料合計 - 手数料合計 |
| settlements[].status | string | 精算状態（精算計算済み） |

#### エラーレスポンス

| ステータスコード | 条件 | レスポンス |
|----------------|------|-----------|
| 400 | 当月以降の対象月を指定 | `{"error": "invalid_target_month", "message": "精算対象月は前月以前を指定してください"}` |
| 400 | forceなしで既計算済み月を指定 | `{"error": "already_calculated", "message": "指定月の精算額は計算済みです。force=trueで再計算できます"}` |
| 403 | adminロール以外 | `{"error": "forbidden"}` |

### 精算一覧取得API（管理者）

- **メソッド**: GET
- **パス**: `/api/v1/admin/settlements`
- **認証**: OAuth2/OIDC Bearer Token（adminロール必須）
- **OpenAPI**: [openapi.yaml](../../_cross-cutting/api/openapi.yaml) の `paths./api/v1/admin/settlements.get` を参照

#### リクエスト

| パラメータ | 型 | 必須 | 説明 |
|-----------|---|------|------|
| status | string | No | 状態フィルター: pending/calculated/paid |
| target_month | string | No | 対象月フィルター（YYYY-MM） |
| page | integer | No | ページ番号 |

#### レスポンス

| フィールド | 型 | 説明 |
|-----------|---|------|
| settlements[].settlement_id | string | 精算ID |
| settlements[].owner_name | string | オーナー名 |
| settlements[].target_month | string | 精算対象月 |
| settlements[].settlement_amount | integer | 精算額（円） |
| settlements[].status | string | 精算状態 |
| pagination.total | integer | 総件数 |

## データモデル変更

### 精算情報（settlements テーブル）

| カラム | 型 | 説明 | 変更種別 |
|--------|---|------|---------|
| settlement_id | VARCHAR(36) | 精算ID（PK） | 既存 |
| owner_id | VARCHAR(36) | オーナーID（FK） | 既存 |
| target_month | VARCHAR(7) | 精算対象月（YYYY-MM） | 既存 |
| total_usage_amount | INTEGER | 利用料合計（円） | 追加 |
| total_fee_amount | INTEGER | 手数料合計（円） | 追加 |
| settlement_amount | INTEGER | 精算額（円） | 既存 |
| status | VARCHAR(20) | 精算状態（未精算/精算計算済み/支払済み） | 既存 |
| calculated_at | DATETIME\|NULL | 計算完了日時 | 追加 |
| idempotency_key | VARCHAR(36) | 冪等キー（UNIQUE制約） | 追加 |

## ビジネスルール

- 精算額 = 利用料合計 - 手数料合計
- 利用料合計は対象月の利用終了済み（利用状態=利用終了）の利用履歴の利用料金をSUM
- 手数料合計は対象月の手数料売上の手数料金額をSUM
- 精算額が0以下の場合は精算対象外として記録する（計算済みとして登録するが精算実行対象外）
- 計算処理は冪等性を保証する（同一X-Idempotency-Keyで重複計算しない）
- 計算実行は監査ログに記録する（CTR-002）

## ティア完了条件（BDD）

```gherkin
Feature: 精算額を計算する - バックエンドAPI

  Scenario: 2026年2月の精算額を計算する
    Given adminロールの認証トークンが有効であり、2026年2月の利用履歴が存在する
    When POST /api/v1/admin/settlements/calculate に {"target_month": "2026-02"} でリクエストする
    Then HTTPステータス200でオーナー別の精算額一覧とstatus="精算計算済み"が返される

  Scenario: 計算済み月をforce=falseで再計算しようとすると400エラーになる
    Given 2026年2月の精算情報が「精算計算済み」状態である
    When POST /api/v1/admin/settlements/calculate に {"target_month": "2026-02"} でリクエストする
    Then HTTPステータス400で {"error": "already_calculated"} が返される

  Scenario: 当月を精算対象月として指定すると400エラーになる
    Given 現在日時が2026-03-29である
    When POST /api/v1/admin/settlements/calculate に {"target_month": "2026-03"} でリクエストする
    Then HTTPステータス400で {"error": "invalid_target_month"} が返される
```
