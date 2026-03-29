# 売上実績を確認する - バックエンドAPI仕様

## 変更概要

会議室オーナーが自身の会議室の売上実績を取得する API エンドポイントを追加する。ReBAC による所有権チェックを適用し、認証済みオーナーが所有する会議室の売上データのみを返す。

## API 仕様

### 売上実績集計取得

- **メソッド**: GET
- **パス**: `/api/v1/owner/sales-summary`
- **認証**: OAuth2/OIDC（ownerロール）+ ReBAC（Check: owner:{owner_id} can view room:{room_id}）
- **OpenAPI**: [openapi.yaml](../../_cross-cutting/api/openapi.yaml) の `paths./api/v1/owner/sales-summary.get` を参照

#### リクエスト

| パラメータ | 型 | 必須 | 説明 |
|-----------|---|------|------|
| dimension | string | Yes | 集計軸。`room`（物件別）または `period`（期間別） |
| from | string | Yes | 集計開始年月（YYYY-MM形式、例: 2026-01） |
| to | string | Yes | 集計終了年月（YYYY-MM形式、例: 2026-03） |

#### レスポンス

| フィールド | 型 | 説明 |
|-----------|---|------|
| summary.total_amount | integer | 集計期間の総売上金額（円） |
| summary.total_count | integer | 集計期間の総利用回数 |
| summary.growth_rate | number | 前期比（%）。前期データがない場合は null |
| items | array | 集計軸ごとのデータ配列 |
| items[].label | string | 会議室名（dimension=room）または年月（dimension=period、例: 2026-03） |
| items[].amount | integer | 売上金額（円） |
| items[].count | integer | 利用回数 |
| items[].growth_rate | number | 前期比（%）。前期データがない場合は null |

#### エラーレスポンス

| ステータスコード | 条件 | レスポンス |
|----------------|------|-----------|
| 400 | dimension が room/period 以外 | `{"error": "invalid_dimension", "message": "dimensionはroom またはperiodを指定してください"}` |
| 400 | from > to の期間逆転 | `{"error": "invalid_period", "message": "fromはto以前の年月を指定してください"}` |
| 400 | 集計期間が12ヶ月超 | `{"error": "period_too_long", "message": "集計期間は最大12ヶ月です"}` |
| 401 | 未認証 | `{"error": "unauthorized"}` |
| 403 | ownerロール以外のアクセス | `{"error": "forbidden"}` |

## データモデル変更

### 売上実績（sales_results）

| カラム | 型 | 説明 | 変更種別 |
|--------|---|------|---------|
| result_id | VARCHAR(26) | 実績ID（ULID） | 既存 |
| room_id | VARCHAR(26) | 会議室ID | 既存 |
| owner_id | VARCHAR(26) | オーナーID | 既存 |
| period | VARCHAR(7) | 集計期間（YYYY-MM） | 既存 |
| usage_count | INTEGER | 利用回数 | 既存 |
| sales_amount | BIGINT | 売上金額（円） | 既存 |

## ビジネスルール

- 認証済みオーナーIDに紐づく会議室の売上実績のみを返す（ReBAC 所有権チェック）
- dimension=room の場合: 会議室IDでGROUP BY して集計期間内の利用回数・売上金額を集計する
- dimension=period の場合: 集計期間内の各月（YYYY-MM）でGROUP BY して月別の利用回数・売上金額を集計する
- 前期比は同期間長の直前期を自動算出して比較する（例: 2026-01〜03 の場合、前期は 2025-10〜12）
- 前期データが存在しない場合は growth_rate を null として返す

## ティア完了条件（BDD）

```gherkin
Feature: 売上実績を確認する - バックエンドAPI

  Scenario: オーナーが自身の会議室の物件別売上実績を取得する
    Given 会議室オーナー「山田花子」（owner_id: O-002）が有効なアクセストークンを保持している
    When GET /api/v1/owner/sales-summary?dimension=room&from=2026-01&to=2026-03 をリクエストする
    Then レスポンス200が返り、owner_id=O-002の会議室のみの売上データが含まれる

  Scenario: 集計期間が12ヶ月を超える場合はエラーを返す
    Given 会議室オーナー「山田花子」が有効なアクセストークンを保持している
    When GET /api/v1/owner/sales-summary?dimension=room&from=2025-01&to=2026-03 をリクエストする
    Then レスポンス400が返り、エラーコード「period_too_long」が含まれる

  Scenario: 他のオーナーのデータが混入しない
    Given 会議室オーナー「山田花子」（owner_id: O-002）が有効なアクセストークンを保持している
    When GET /api/v1/owner/sales-summary?dimension=room&from=2026-01&to=2026-03 をリクエストする
    Then レスポンスに含まれる全 items の owner_id がすべて O-002 である
```
