# 会議室を検索する - バックエンド API 仕様

## 変更概要

会議室検索 API を実装する。公開状態フィルタ・複数検索条件（エリア・収容人数・価格帯・設備・評価スコア・利用可能日時・会議室種別・会議ツール種別・同時接続数）に対応したクエリ処理と、KVS によるキャッシュを提供する。

## API 仕様

### 会議室一覧検索 API

- **メソッド**: GET
- **パス**: `/api/v1/rooms`
- **認証**: 任意（未認証でも可。認証済みの場合はユーザー情報を活用可）
- **OpenAPI**: [openapi.yaml](../../_cross-cutting/api/openapi.yaml) の `paths./api/v1/rooms.get` を参照

#### リクエスト

| パラメータ | 型 | 必須 | 説明 |
|-----------|---|------|------|
| area | string | No | エリア（部分一致、例: 渋谷区） |
| area_min | number | No | 広さ最小値（m²） |
| area_max | number | No | 広さ最大値（m²） |
| capacity_min | number | No | 収容人数下限 |
| price_max | number | No | 時間単価上限（円） |
| facilities | string[] | No | 設備・機能（カンマ区切り、AND 条件） |
| rating_min | number | No | 評価スコア下限（0.0-5.0） |
| available_from | string | No | 利用可能開始日時（ISO 8601） |
| available_to | string | No | 利用可能終了日時（ISO 8601） |
| room_type | string | No | 会議室種別（physical/virtual） |
| tool_type | string | No | 会議ツール種別（zoom/teams/google_meet）※バーチャルのみ有効 |
| max_connections_min | number | No | 同時接続数下限※バーチャルのみ有効 |
| sort | string | No | ソート順（new/rating/price_asc/price_desc）。デフォルト: new |
| page | number | No | ページ番号（デフォルト: 1） |
| per_page | number | No | 1ページ件数（デフォルト: 20、上限: 50） |

#### レスポンス

| フィールド | 型 | 説明 |
|-----------|---|------|
| rooms | Room[] | 会議室一覧 |
| rooms[].room_id | string | 会議室ID |
| rooms[].name | string | 会議室名 |
| rooms[].room_type | string | 会議室種別（physical/virtual） |
| rooms[].area | string | 所在地（物理のみ） |
| rooms[].capacity | number | 収容人数 |
| rooms[].price_per_hour | number | 時間単価（円） |
| rooms[].facilities | string[] | 設備・機能一覧 |
| rooms[].image_url | string | サムネイル画像URL |
| rooms[].avg_rating | number | 平均評価スコア（小数第1位） |
| rooms[].tool_type | string | 会議ツール種別（バーチャルのみ） |
| rooms[].max_connections | number | 同時接続数（バーチャルのみ） |
| total | number | 総件数 |
| page | number | 現在ページ番号 |
| per_page | number | 1ページ件数 |
| total_pages | number | 総ページ数 |

#### エラーレスポンス

| ステータスコード | 条件 | レスポンス |
|----------------|------|-----------|
| 400 | available_from が過去日時 | `{"error": "available_from must be a future datetime"}` |
| 400 | per_page が 50 超 | `{"error": "per_page must be 50 or less"}` |
| 500 | DB 接続エラー | `{"error": "internal server error"}` |

## データモデル変更

### rooms テーブル（参照のみ）

| カラム | 型 | 説明 | 変更種別 |
|--------|---|------|---------|
| room_id | VARCHAR(36) | 会議室ID（UUID） | 参照のみ |
| name | VARCHAR(100) | 会議室名 | 参照のみ |
| room_type | VARCHAR(20) | 会議室種別（physical/virtual） | 参照のみ |
| location | VARCHAR(200) | 所在地（物理のみ） | 参照のみ |
| capacity | INTEGER | 収容人数 | 参照のみ |
| price_per_hour | INTEGER | 時間単価（円） | 参照のみ |
| facilities | JSONB | 設備・機能（配列） | 参照のみ |
| publication_status | VARCHAR(20) | 公開状態（published/unpublished/pending） | 参照のみ（公開中のみ返却） |
| tool_type | VARCHAR(20) | 会議ツール種別（バーチャルのみ） | 参照のみ |
| max_connections | INTEGER | 同時接続数（バーチャルのみ） | 参照のみ |

## ビジネスルール

- 公開状態が「公開中（published）」の会議室のみ検索結果に含める
- available_from/available_to 指定時: 当該日時範囲に確定状態の予約が存在しない会議室のみ返す
- 平均評価スコアは rooms テーブルの非正規化カラム（更新は評価登録 UC の責務）または集計クエリで算出
- KVS キャッシュ: 検索条件をキーにして結果を60秒キャッシュ。会議室情報変更・評価登録時はキャッシュを無効化
- バーチャル会議室の tool_type・max_connections フィルタは room_type=virtual の場合のみ有効

## ティア完了条件（BDD）

```gherkin
Feature: 会議室を検索する - バックエンド API

  Scenario: 渋谷区・収容人数10人以上の物理会議室を検索する
    Given バックエンド API が起動しており公開中の物理会議室が5件存在する
    When GET /api/v1/rooms?area=渋谷区&capacity_min=10&room_type=physical を送信する
    Then HTTP 200 と、渋谷区内・収容人数10人以上の公開中の物理会議室一覧が返る

  Scenario: バーチャル会議室をZoom・20接続以上で検索する
    Given バックエンド API が起動しており公開中のバーチャル会議室（Zoom、30接続）が3件存在する
    When GET /api/v1/rooms?room_type=virtual&tool_type=zoom&max_connections_min=20 を送信する
    Then HTTP 200 と、Zoom を使用した同時接続数20以上のバーチャル会議室一覧が返る

  Scenario: 過去日時を available_from に指定した場合にバリデーションエラーが返る
    Given バックエンド API が起動している
    When GET /api/v1/rooms?available_from=2020-01-01T10:00:00Z を送信する
    Then HTTP 400 と {"error": "available_from must be a future datetime"} が返る
```
