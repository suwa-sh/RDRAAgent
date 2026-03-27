# 利用回数を確認する - バックエンド仕様

## 変更概要

会議室オーナー向けの利用回数取得APIを新規作成する。自身の会議室の売上実績・利用履歴から利用回数を集計して返却する。

## API 仕様

### 利用回数取得API

- **メソッド**: GET
- **パス**: /api/owner/usage-count
- **認証**: 会議室オーナー認証

#### リクエスト

| パラメータ | 型 | 必須 | 説明 |
|-----------|---|------|------|
| period_from | string | No | 対象期間開始日（YYYY-MM-DD、デフォルト: 当月1日） |
| period_to | string | No | 対象期間終了日（YYYY-MM-DD、デフォルト: 当月末日） |

#### レスポンス

| フィールド | 型 | 説明 |
|-----------|---|------|
| owner_id | string | オーナーID |
| period_from | string | 対象期間開始日 |
| period_to | string | 対象期間終了日 |
| rooms | array | 会議室別利用回数の配列 |
| rooms[].room_id | string | 会議室ID |
| rooms[].room_name | string | 会議室名 |
| rooms[].usage_count | number | 利用回数 |
| rooms[].total_hours | number | 利用時間合計（時間） |

### 会議室別利用履歴詳細取得API

- **メソッド**: GET
- **パス**: /api/owner/usage-count/{room_id}/details
- **認証**: 会議室オーナー認証

#### リクエスト

| パラメータ | 型 | 必須 | 説明 |
|-----------|---|------|------|
| period_from | string | No | 対象期間開始日（YYYY-MM-DD） |
| period_to | string | No | 対象期間終了日（YYYY-MM-DD） |

#### レスポンス

| フィールド | 型 | 説明 |
|-----------|---|------|
| room_id | string | 会議室ID |
| room_name | string | 会議室名 |
| items | array | 利用履歴の配列 |
| items[].usage_datetime | string | 利用日時 |
| items[].user_name | string | 利用者名 |
| items[].usage_hours | number | 利用時間（時間） |
| items[].usage_fee | number | 利用料金 |

## データモデル変更

### 売上実績（参照）

| カラム | 型 | 説明 | 変更種別 |
|--------|---|------|---------|
| 実績ID | VARCHAR | 売上実績の一意識別子 | 追加 |
| 会議室ID | VARCHAR | 会議室の識別子 | 追加 |
| オーナーID | VARCHAR | オーナーの識別子 | 追加 |
| 集計期間 | VARCHAR | 集計対象期間 | 追加 |
| 利用回数 | INT | 利用回数 | 追加 |
| 売上金額 | DECIMAL | 売上金額 | 追加 |

## ビジネスルール

- オーナーは自身が所有する会議室の利用回数のみ参照可能とする
- 対象期間を指定しない場合は当月の利用回数を返却する
- 利用回数は売上実績テーブルから取得し、詳細は利用履歴テーブルから取得する

## ティア完了条件（BDD）

```gherkin
Feature: 利用回数を確認する - バックエンド

  Scenario: 自身の会議室の利用回数を取得する
    Given オーナー「O001」の会議室「R001」の2026年3月の利用回数が10回である
    When GET /api/owner/usage-count?period_from=2026-03-01&period_to=2026-03-31 を実行する
    Then ステータスコード200が返却される
    And rooms に会議室「R001」のusage_count=10が含まれる

  Scenario: 他のオーナーの会議室にはアクセスできない
    Given オーナー「O001」で認証済みである
    And 会議室「R999」はオーナー「O002」の所有である
    When GET /api/owner/usage-count/R999/details を実行する
    Then ステータスコード403が返却される
```
