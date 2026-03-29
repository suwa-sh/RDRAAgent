# 利用履歴を管理する - バックエンドAPI仕様

## 変更概要

管理者向け利用履歴一覧取得APIを追加する。会員別・物件別・期間別の集計軸とフィルタリングをサポートし、ページネーション付きで返す。

## API 仕様

### 利用履歴一覧取得API（管理者）

- **メソッド**: GET
- **パス**: `/api/v1/admin/usage-history`
- **認証**: OAuth2/OIDC Bearer Token（adminロール必須）
- **OpenAPI**: [openapi.yaml](../../_cross-cutting/api/openapi.yaml) の `paths./api/v1/admin/usage-history.get` を参照

#### リクエスト

| パラメータ | 型 | 必須 | 説明 |
|-----------|---|------|------|
| dimension | string | No | 集計軸: user/room/period（未指定で個別一覧） |
| from | string (date) | No | 利用日の開始日 |
| to | string (date) | No | 利用日の終了日 |
| user_id | string | No | 利用者IDフィルター |
| room_id | string | No | 会議室IDフィルター |
| sort | string | No | ソート: used_at_asc/used_at_desc/amount_desc（デフォルト: used_at_asc） |
| page | integer | No | ページ番号（デフォルト: 1） |
| per_page | integer | No | 1ページあたり件数（デフォルト: 20、最大: 100） |

#### レスポンス（個別一覧モード）

| フィールド | 型 | 説明 |
|-----------|---|------|
| items[].history_id | string | 履歴ID |
| items[].user_id | string | 利用者ID |
| items[].user_name | string | 利用者名 |
| items[].room_id | string | 会議室ID |
| items[].room_name | string | 会議室名 |
| items[].used_at | string | 利用開始日時（ISO8601） |
| items[].duration_minutes | integer | 利用時間（分） |
| items[].amount | integer | 利用料金（円） |
| summary.total_amount | integer | 合計料金（円） |
| summary.total_duration_minutes | integer | 合計利用時間（分） |
| summary.count | integer | 件数 |
| pagination.total | integer | 総件数 |
| pagination.page | integer | 現在ページ |

#### エラーレスポンス

| ステータスコード | 条件 | レスポンス |
|----------------|------|-----------|
| 400 | from > to | `{"error": "invalid_date_range"}` |
| 403 | adminロール以外 | `{"error": "forbidden"}` |

## データモデル変更

既存テーブルの参照のみ。変更なし。

## ビジネスルール

- 個人情報（利用者名）のアクセスは監査ログに記録する（CTR-002）
- 集計期間は最大1年（366日）以内
- dimension=userの場合は利用者IDでGROUP BY し件数・合計金額・合計時間を返す
- dimension=roomの場合は会議室IDでGROUP BY し同上を返す
- dimension=periodの場合は利用日の年月でGROUP BY し同上を返す

## ティア完了条件（BDD）

```gherkin
Feature: 利用履歴を管理する - バックエンドAPI

  Scenario: 物件別の利用履歴集計を取得する
    Given adminロールの認証トークンが有効である
    When GET /api/v1/admin/usage-history?dimension=room&from=2026-01-01&to=2026-01-31 にリクエストする
    Then HTTPステータス200で会議室別の利用集計データが返される

  Scenario: 利用者IDでフィルタリングして利用履歴を取得する
    Given adminロールの認証トークンが有効である
    When GET /api/v1/admin/usage-history?user_id=U-001 にリクエストする
    Then HTTPステータス200でuser_idがU-001の利用履歴のみが返される
```
