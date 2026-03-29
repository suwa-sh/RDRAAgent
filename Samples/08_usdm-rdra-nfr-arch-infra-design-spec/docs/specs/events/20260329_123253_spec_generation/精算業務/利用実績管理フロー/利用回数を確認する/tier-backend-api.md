# 利用回数を確認する - バックエンドAPI仕様

## 変更概要

オーナー向け利用回数集計APIを追加する。集計軸（物件別/期間別）と期間を指定して、自身の会議室の利用回数統計を返す。ReBAC（所有権ベースアクセス制御）で自身の会議室データのみ参照可能にする。

## API 仕様

### オーナー向け利用回数統計取得API

- **メソッド**: GET
- **パス**: `/api/v1/owner/usage-stats`
- **認証**: OAuth2/OIDC Bearer Token（ownerロール）
- **OpenAPI**: [openapi.yaml](../../_cross-cutting/api/openapi.yaml) の `paths./api/v1/owner/usage-stats.get` を参照

#### リクエスト

| パラメータ | 型 | 必須 | 説明 |
|-----------|---|------|------|
| dimension | string | Yes | 集計軸: room（物件別）/ period（期間別） |
| from | string | Yes | 開始月（YYYY-MM） |
| to | string | Yes | 終了月（YYYY-MM、from ≤ to かつ最大12ヶ月） |

#### レスポンス（dimension=room 時）

| フィールド | 型 | 説明 |
|-----------|---|------|
| dimension | string | "room" |
| period | object | { from: string, to: string } |
| items[].room_id | string | 会議室ID |
| items[].room_name | string | 会議室名 |
| items[].count | integer | 利用回数 |
| items[].prev_count | integer | 前期同期間の利用回数 |
| items[].delta_rate | number | 前期比（%、小数第1位） |
| kpi.total_count | integer | 期間合計利用回数 |
| kpi.avg_count | number | 会議室平均利用回数 |
| kpi.max_count | integer | 最大利用回数 |

#### レスポンス（dimension=period 時）

| フィールド | 型 | 説明 |
|-----------|---|------|
| dimension | string | "period" |
| period | object | { from: string, to: string } |
| items[].month | string | 年月（YYYY-MM） |
| items[].count | integer | 月別利用回数 |
| kpi.total_count | integer | 期間合計利用回数 |
| kpi.avg_count | number | 月平均利用回数 |
| kpi.max_count | integer | 最大月利用回数 |

#### エラーレスポンス

| ステータスコード | 条件 | レスポンス |
|----------------|------|-----------|
| 400 | 必須パラメータ欠如・期間超過（12ヶ月超） | `{"error": "bad_request", "details": "..."}` |
| 401 | 認証トークンが無効 | `{"error": "unauthorized"}` |
| 403 | ownerロール以外 | `{"error": "forbidden"}` |

## データモデル変更

既存テーブルの参照のみ。変更なし。

集計クエリ:
- `利用履歴` テーブルを `room_id`（物件別）または `YEAR(利用日時)||'-'||LPAD(MONTH(利用日時),2,'0')`（期間別）で GROUP BY、COUNT(*) 集計
- 前期比は同一期間の前年同期間を比較: 前期 = from - 12ヶ月 〜 to - 12ヶ月

## ビジネスルール

- ReBAC認可: `Check('owner:{owner_id}', 'view', 'usage-stats')` で自身の会議室のみ参照可能
- 集計軸 `room`: 認証オーナーが所有する会議室IDの利用履歴のみ集計
- 集計軸 `period`: 認証オーナーが所有する全会議室の利用履歴を月次集計
- 前期比計算: `(当期回数 - 前期回数) / 前期回数 × 100`（前期回数=0の場合は `null`）
- 期間は最大12ヶ月まで（パフォーマンス制限）
- KVSキャッシュ: TTL 1時間（集計クエリ負荷軽減）

## ティア完了条件（BDD）

```gherkin
Feature: 利用回数を確認する - バックエンドAPI

  Scenario: 物件別の利用回数統計を取得する
    Given owner_id=O-001のownerロールの認証トークンが有効である
    When GET /api/v1/owner/usage-stats?dimension=room&from=2026-01&to=2026-03 にリクエストする
    Then HTTPステータス200で「渋谷A会議室: 24回（前期比: +20.0%）」と「新宿B会議室: 18回（前期比: -5.0%）」を含むレスポンスが返される

  Scenario: 他のオーナーの会議室データは含まれない
    Given owner_id=O-001のownerロールの認証トークンが有効である
    When GET /api/v1/owner/usage-stats?dimension=room&from=2026-01&to=2026-03 にリクエストする
    Then owner_id=O-001が所有する会議室のデータのみが返され、他のオーナーの会議室データは含まれない

  Scenario: 期間が12ヶ月を超えると400になる
    Given owner_id=O-001のownerロールの認証トークンが有効である
    When GET /api/v1/owner/usage-stats?dimension=room&from=2025-01&to=2026-03 にリクエストする
    Then HTTPステータス400が返される
```
