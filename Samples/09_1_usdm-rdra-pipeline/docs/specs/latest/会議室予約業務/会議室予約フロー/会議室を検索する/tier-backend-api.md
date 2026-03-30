# 会議室を検索する - バックエンド API 仕様

## 変更概要

会議室検索 API を実装する。機能性・価格帯・評価でフィルタリングし、ページネーション付きの一覧を返す。

## API 仕様

### 会議室検索 API

- **メソッド**: GET
- **パス**: /api/v1/rooms
- **認証**: Bearer JWT（利用者ロール）
- **OpenAPI**: [openapi.yaml](../../_cross-cutting/api/openapi.yaml) の `paths./api/v1/rooms.get` を参照

#### リクエスト

| パラメータ | 型 | 必須 | 説明 |
|-----------|---|------|------|
| features | string[] | No | 機能性フィルター（カンマ区切り: プロジェクター,Wi-Fi） |
| minPrice | integer | No | 最低価格（円） |
| maxPrice | integer | No | 最高価格（円） |
| minRating | number | No | 最低平均評価（0.0-5.0） |
| page | integer | No | ページ番号（デフォルト: 1） |
| per_page | integer | No | 1ページあたり件数（デフォルト: 20、最大: 100） |

#### レスポンス

| フィールド | 型 | 説明 |
|-----------|---|------|
| items | RoomListItem[] | 会議室一覧 |
| items[].id | string | 会議室ID |
| items[].name | string | 会議室名 |
| items[].address | string | 住所 |
| items[].price | integer | 価格（円/時間） |
| items[].capacity | integer | 収容人数 |
| items[].features | string[] | 機能性一覧 |
| items[].avgRating | number | 平均評価（0.0-5.0） |
| items[].reviewCount | integer | 評価件数 |
| items[].ownerName | string | オーナー名 |
| total | integer | 総件数 |
| page | integer | 現在ページ |
| per_page | integer | 1ページあたり件数 |

#### エラーレスポンス

| ステータスコード | 条件 | レスポンス |
|----------------|------|-----------|
| 400 | minPrice > maxPrice | {"code": "INVALID_PRICE_RANGE", "message": "最低価格は最高価格以下にしてください"} |
| 400 | minRating が 0-5 の範囲外 | {"code": "INVALID_RATING_RANGE", "message": "評価は0.0から5.0の範囲で指定してください"} |
| 401 | JWT トークンなし/無効 | {"code": "UNAUTHORIZED", "message": "認証が必要です"} |

## データモデル変更

### rooms テーブル（参照のみ）

| カラム | 型 | 説明 | 変更種別 |
|--------|---|------|---------|
| id | VARCHAR(36) | 会議室ID（UUID） | 既存 |
| name | VARCHAR(100) | 会議室名 | 既存 |
| address | VARCHAR(200) | 住所 | 既存 |
| price | INTEGER | 価格（円/時間） | 既存 |
| capacity | INTEGER | 収容人数 | 既存 |
| features | VARCHAR[] | 機能性配列 | 既存 |
| owner_id | VARCHAR(36) | オーナーID（FK） | 既存 |

### room_reviews テーブル（参照のみ - 集約）

| カラム | 型 | 説明 | 変更種別 |
|--------|---|------|---------|
| room_id | VARCHAR(36) | 会議室ID（FK） | 既存 |
| rating | INTEGER | 評価点（1-5） | 既存 |

## ビジネスルール

- 検索結果は承認済みオーナーの会議室のみ（退会済みオーナーの会議室は除外）
- 平均評価は小数点第1位まで算出（四捨五入）
- 評価件数 0 の会議室も検索結果に含める（評価なしとして表示）

## ティア完了条件（BDD）

```gherkin
Feature: 会議室を検索する - バックエンド API

  Scenario: 条件なし検索で全会議室を返す
    Given 承認済みオーナーの会議室が25件登録済み
    When GET /api/v1/rooms?page=1&per_page=20 をリクエストする
    Then HTTP 200 が返る
    And items に20件の会議室が含まれる
    And total が 25 である
    And page が 1 である

  Scenario: 機能性フィルターで絞り込む
    Given 「Wi-Fi」対応の会議室が5件、未対応が10件登録済み
    When GET /api/v1/rooms?features=Wi-Fi をリクエストする
    Then HTTP 200 が返る
    And items の全件が features に「Wi-Fi」を含む

  Scenario: 価格帯の逆転でバリデーションエラー
    Given 利用者「田中太郎」がログイン済み
    When GET /api/v1/rooms?minPrice=5000&maxPrice=1000 をリクエストする
    Then HTTP 400 が返る
    And code が「INVALID_PRICE_RANGE」である
```
