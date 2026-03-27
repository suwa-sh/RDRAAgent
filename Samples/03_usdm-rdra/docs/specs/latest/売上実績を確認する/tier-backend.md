# 売上実績を確認する - バックエンド仕様

## 変更概要

会議室オーナー向けの売上実績取得APIを新規作成する。自身の会議室の売上実績（利用回数・売上金額）の参照を実装する。

## API 仕様

### 売上実績取得API

- **メソッド**: GET
- **パス**: /api/owner/sales
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
| total_revenue | number | 売上金額合計 |
| total_usage_count | number | 利用回数合計 |
| rooms | array | 会議室別売上実績の配列 |
| rooms[].room_id | string | 会議室ID |
| rooms[].room_name | string | 会議室名 |
| rooms[].aggregation_period | string | 集計期間 |
| rooms[].usage_count | number | 利用回数 |
| rooms[].revenue | number | 売上金額 |

## データモデル変更

### 売上実績（参照）

| カラム | 型 | 説明 | 変更種別 |
|--------|---|------|---------|
| 実績ID | VARCHAR | 売上実績の一意識別子 | 既存参照 |
| 会議室ID | VARCHAR | 会議室の識別子 | 既存参照 |
| オーナーID | VARCHAR | オーナーの識別子 | 既存参照 |
| 集計期間 | VARCHAR | 集計対象期間 | 既存参照 |
| 利用回数 | INT | 利用回数 | 既存参照 |
| 売上金額 | DECIMAL | 売上金額 | 既存参照 |

## ビジネスルール

- オーナーは自身が所有する会議室の売上実績のみ参照可能とする
- 対象期間を指定しない場合は当月の売上実績を返却する
- 売上金額合計と利用回数合計をレスポンスに含める

## ティア完了条件（BDD）

```gherkin
Feature: 売上実績を確認する - バックエンド

  Scenario: 自身の会議室の売上実績を取得する
    Given オーナー「O001」の会議室「R001」の2026年3月の売上金額が150000円・利用回数が10回である
    When GET /api/owner/sales?period_from=2026-03-01&period_to=2026-03-31 を実行する
    Then ステータスコード200が返却される
    And rooms に会議室「R001」のrevenue=150000、usage_count=10が含まれる
    And total_revenue が150000以上となる

  Scenario: 他のオーナーの売上実績にはアクセスできない
    Given オーナー「O001」で認証済みである
    When GET /api/owner/sales を実行する
    Then rooms にオーナー「O001」所有の会議室のみ含まれる
    And 他のオーナーの会議室のデータは含まれない

  Scenario: 売上実績がない場合
    Given オーナー「O001」で認証済みである
    And 2025年1月の売上実績が存在しない
    When GET /api/owner/sales?period_from=2025-01-01&period_to=2025-01-31 を実行する
    Then ステータスコード200が返却される
    And rooms が空配列である
    And total_revenue が0である
```
