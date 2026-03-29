# 手数料売上を分析する - バックエンドAPI仕様

## 変更概要

手数料売上の集計・分析APIエンドポイントを追加する。売上分析区分（会議室別・貸出別・月別・オーナー別）と期間を指定して手数料売上を集計し、チャート用データを返す。

## API 仕様

### 手数料売上集計取得API

- **メソッド**: GET
- **パス**: `/api/v1/admin/fee-sales/summary`
- **認証**: OAuth2/OIDC Bearer Token（adminロール必須、MFA必須）
- **OpenAPI**: [openapi.yaml](../../_cross-cutting/api/openapi.yaml) の `paths./api/v1/admin/fee-sales/summary.get` を参照

#### リクエスト

| パラメータ | 型 | 必須 | 説明 |
|-----------|---|------|------|
| dimension | string | Yes | 集計軸: room/lease/monthly/owner |
| from | string (ISO8601 date) | Yes | 集計期間開始日 例: 2026-01-01 |
| to | string (ISO8601 date) | Yes | 集計期間終了日 例: 2026-01-31 |
| page | integer | No | ページ番号（デフォルト: 1）。明細テーブル用 |
| per_page | integer | No | 1ページあたり件数（デフォルト: 20、最大: 100） |

#### レスポンス

| フィールド | 型 | 説明 |
|-----------|---|------|
| dimension | string | 集計軸 |
| period.from | string | 集計開始日 |
| period.to | string | 集計終了日 |
| summary.total_fee_amount | integer | 集計期間の手数料合計（円） |
| summary.previous_fee_amount | integer | 前期同期間の手数料合計（円、前期比計算用） |
| summary.change_rate | decimal | 前期比（%）: (当期-前期)/前期×100 |
| items[] | array | 集計明細配列 |
| items[].key | string | 集計キー（会議室ID/貸出ID/年月/オーナーID） |
| items[].label | string | 集計キーの表示名（会議室名/年月表示/オーナー名） |
| items[].fee_amount | integer | 手数料合計（円） |
| items[].fee_rate | decimal | 平均手数料率（%）（月別以外） |
| items[].count | integer | 件数 |
| items[].change_rate | decimal | 前期比（%） |
| pagination.total | integer | 総件数 |
| pagination.page | integer | 現在ページ |
| pagination.per_page | integer | 1ページあたり件数 |

#### エラーレスポンス

| ステータスコード | 条件 | レスポンス |
|----------------|------|-----------|
| 400 | from > to（開始日が終了日より後） | `{"error": "invalid_date_range", "message": "fromはtoより前の日付を指定してください"}` |
| 400 | dimensionが無効な値 | `{"error": "invalid_dimension", "message": "dimensionはroom/lease/monthly/ownerのいずれかを指定してください"}` |
| 401 | 認証トークンが無効 | `{"error": "unauthorized", "message": "認証が必要です"}` |
| 403 | adminロール以外のアクセス | `{"error": "forbidden", "message": "このAPIへのアクセス権限がありません"}` |

### 手数料売上CSV出力API

- **メソッド**: GET
- **パス**: `/api/v1/admin/fee-sales/export`
- **認証**: OAuth2/OIDC Bearer Token（adminロール必須）
- **OpenAPI**: [openapi.yaml](../../_cross-cutting/api/openapi.yaml) の `paths./api/v1/admin/fee-sales/export.get` を参照

#### リクエスト

| パラメータ | 型 | 必須 | 説明 |
|-----------|---|------|------|
| dimension | string | Yes | 集計軸: room/lease/monthly/owner |
| from | string | Yes | 集計期間開始日 |
| to | string | Yes | 集計期間終了日 |

#### レスポンス

Content-Type: `text/csv; charset=UTF-8`

BOM付きCSV（Excel対応）。カラム構成はdimensionにより動的に変化する。

#### エラーレスポンス

| ステータスコード | 条件 | レスポンス |
|----------------|------|-----------|
| 400 | 無効なリクエストパラメータ | JSON形式のエラーレスポンス |
| 403 | adminロール以外 | `{"error": "forbidden"}` |

## データモデル変更

### 手数料売上（fee_sales テーブル）

既存テーブルの参照のみ。変更なし。

| カラム | 型 | 説明 | 変更種別 |
|--------|---|------|---------|
| fee_id | VARCHAR(36) | 手数料ID（PK） | 既存 |
| room_id | VARCHAR(36) | 会議室ID（FK） | 既存 |
| lease_id | VARCHAR(36) | 貸出ID | 既存 |
| fee_rate | DECIMAL(5,2) | 手数料率（%） | 既存 |
| fee_amount | INTEGER | 手数料金額（円） | 既存 |
| recorded_at | DATE | 計上日 | 既存 |

### 利用履歴（usage_history テーブル）

既存テーブルの参照のみ。変更なし。

## ビジネスルール

- 集計期間は最大1年（366日）以内とする
- 前期比は前期の同期間（例: 当月なら前月同日〜同日）と比較する
- 手数料金額が0円の明細は集計対象外とする
- 集計結果は最大1000件まで返す。超過する場合はpaginationで制御する
- 管理者ロール（adminロール）を持つユーザーのみAPIアクセス可能
- アクセスログ（アクター、期間、集計軸）を監査ログとして記録する

## ティア完了条件（BDD）

```gherkin
Feature: 手数料売上を分析する - バックエンドAPI

  Scenario: 月別集計APIで2026年1月のデータを取得する
    Given adminロールの認証トークンが有効である
    When GET /api/v1/admin/fee-sales/summary?dimension=monthly&from=2026-01-01&to=2026-01-31 にリクエストする
    Then HTTPステータス200で月別集計データが返され、summary.total_fee_amountが正の整数である

  Scenario: 無効な期間でAPIリクエストするとバリデーションエラーになる
    Given adminロールの認証トークンが有効である
    When GET /api/v1/admin/fee-sales/summary?dimension=monthly&from=2026-03-31&to=2026-01-01 にリクエストする
    Then HTTPステータス400で {"error": "invalid_date_range"} が返される

  Scenario: adminロール以外のトークンでアクセスすると403になる
    Given ownerロールの認証トークンが有効である
    When GET /api/v1/admin/fee-sales/summary?dimension=monthly&from=2026-01-01&to=2026-01-31 にリクエストする
    Then HTTPステータス403が返される
```
