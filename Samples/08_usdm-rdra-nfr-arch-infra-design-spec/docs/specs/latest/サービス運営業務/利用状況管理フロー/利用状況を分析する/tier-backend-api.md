# 利用状況を分析する - バックエンドAPI仕様

## 変更概要

利用状況分析APIエンドポイントを追加する。利用履歴と売上実績を統合集計し、KPIサマリーと集計軸別の明細データを返す。

## API 仕様

### 利用状況分析取得API

- **メソッド**: GET
- **パス**: `/api/v1/admin/usage-analytics`
- **認証**: OAuth2/OIDC Bearer Token（adminロール必須）
- **OpenAPI**: [openapi.yaml](../../_cross-cutting/api/openapi.yaml) の `paths./api/v1/admin/usage-analytics.get` を参照

#### リクエスト

| パラメータ | 型 | 必須 | 説明 |
|-----------|---|------|------|
| dimension | string | Yes | 集計軸: user/room/period |
| from | string (date) | Yes | 集計期間開始日 |
| to | string (date) | Yes | 集計期間終了日 |
| page | integer | No | ページ番号（デフォルト: 1） |
| per_page | integer | No | 1ページあたり件数（デフォルト: 20、最大: 100） |

#### レスポンス

| フィールド | 型 | 説明 |
|-----------|---|------|
| kpi.total_usage_count | integer | 総利用回数 |
| kpi.total_sales_amount | integer | 総売上金額（円） |
| kpi.avg_occupancy_rate | decimal | 平均稼働率（%）（物件別のみ） |
| kpi.active_user_count | integer | アクティブユーザー数（ユニーク利用者） |
| kpi.previous_total_usage_count | integer | 前期総利用回数（前期比計算用） |
| kpi.change_rate | decimal | 前期比（%） |
| items[] | array | 集計軸別の明細データ |
| items[].key | string | 集計キー（利用者ID/会議室ID/年月） |
| items[].label | string | 集計キーの表示名 |
| items[].usage_count | integer | 利用回数 |
| items[].sales_amount | integer | 売上金額（円） |
| items[].occupancy_rate | decimal | 稼働率（%）（物件別のみ） |
| items[].change_rate | decimal | 前期比（%） |
| pagination.total | integer | 総件数 |

#### エラーレスポンス

| ステータスコード | 条件 | レスポンス |
|----------------|------|-----------|
| 400 | from > to | `{"error": "invalid_date_range"}` |
| 400 | 集計期間が365日超 | `{"error": "date_range_too_large", "message": "集計期間は最大365日以内を指定してください"}` |
| 400 | 無効なdimension | `{"error": "invalid_dimension"}` |
| 403 | adminロール以外 | `{"error": "forbidden"}` |

## データモデル変更

既存テーブル（usage_history, sales_results）の参照のみ。変更なし。

## ビジネスルール

- 集計期間は最大365日以内
- 稼働率計算は物件別集計時のみ実施（利用時間/利用可能時間×100）
- 前期比は集計期間と同等長の直前期間と比較する
- アクティブユーザー数は集計期間内にユニークな利用者IDをCOUNT DISTINCTで算出
- KVSキャッシュTTLは5分（リアルタイム性と性能のバランス）
- アクセスログを監査ログに記録する（CTR-002）

## ティア完了条件（BDD）

```gherkin
Feature: 利用状況を分析する - バックエンドAPI

  Scenario: 期間別の利用状況分析データを取得する
    Given adminロールの認証トークンが有効である
    When GET /api/v1/admin/usage-analytics?dimension=period&from=2026-01-01&to=2026-03-31 にリクエストする
    Then HTTPステータス200でKPIサマリーと月別集計データが返される

  Scenario: 集計期間が365日を超える場合に400エラーになる
    Given adminロールの認証トークンが有効である
    When GET /api/v1/admin/usage-analytics?dimension=period&from=2025-01-01&to=2026-12-31 にリクエストする
    Then HTTPステータス400で {"error": "date_range_too_large"} が返される
```
