# 利用状況を分析する - バックエンド仕様

## 変更概要

利用状況の集計・分析APIを新規作成する。利用履歴集計区分（会員別、物件別、期間別）に応じた集計処理を実装し、利用履歴と売上実績を統合した分析データを提供する。

## API 仕様

### 利用状況分析取得API

- **メソッド**: GET
- **パス**: /api/admin/usage-analysis
- **認証**: サービス運営担当者認証

#### リクエスト

| パラメータ | 型 | 必須 | 説明 |
|-----------|---|------|------|
| aggregation_type | string | Yes | 利用履歴集計区分（member, room, period） |
| period_from | string | Yes | 対象期間開始日（YYYY-MM-DD） |
| period_to | string | Yes | 対象期間終了日（YYYY-MM-DD） |

#### レスポンス

| フィールド | 型 | 説明 |
|-----------|---|------|
| aggregation_type | string | 利用履歴集計区分 |
| period_from | string | 対象期間開始日 |
| period_to | string | 対象期間終了日 |
| total_usage_count | number | 利用回数合計 |
| total_revenue | number | 売上合計金額 |
| items | array | 集計結果の配列 |
| items[].group_key | string | 集計キー（利用者ID/会議室ID/月） |
| items[].group_label | string | 集計キーの表示名 |
| items[].usage_count | number | 利用回数 |
| items[].total_hours | number | 利用時間合計（時間） |
| items[].total_revenue | number | 利用料金合計 |

## データモデル変更

### 利用履歴

| カラム | 型 | 説明 | 変更種別 |
|--------|---|------|---------|
| 履歴ID | VARCHAR | 利用履歴の一意識別子 | 追加 |
| 利用者ID | VARCHAR | 利用者の識別子 | 追加 |
| 会議室ID | VARCHAR | 会議室の識別子 | 追加 |
| 利用日時 | DATETIME | 利用日時 | 追加 |
| 利用時間 | INT | 利用時間（分） | 追加 |
| 利用料金 | DECIMAL | 利用料金 | 追加 |

### 売上実績

| カラム | 型 | 説明 | 変更種別 |
|--------|---|------|---------|
| 実績ID | VARCHAR | 売上実績の一意識別子 | 追加 |
| 会議室ID | VARCHAR | 会議室の識別子 | 追加 |
| オーナーID | VARCHAR | オーナーの識別子 | 追加 |
| 集計期間 | VARCHAR | 集計対象期間 | 追加 |
| 利用回数 | INT | 利用回数 | 追加 |
| 売上金額 | DECIMAL | 売上金額 | 追加 |

## ビジネスルール

- 利用履歴集計区分は会員別、物件別、期間別の3種類を提供する
- 会員別集計は利用者IDをキーに利用回数・利用時間・利用料金を集計する
- 物件別集計は会議室IDをキーに利用回数・利用時間・利用料金を集計する
- 期間別集計は月をキーに利用回数・利用時間・利用料金を集計する
- 売上実績は利用履歴から導出された会議室ごとの集約データとして参照する
- サービス運営担当者のみがアクセス可能とする

## ティア完了条件（BDD）

```gherkin
Feature: 利用状況を分析する - バックエンド

  Scenario: 会員別の利用状況を取得する
    Given 利用者「U001」の2026年3月の利用履歴が5件登録されている
    When GET /api/admin/usage-analysis?aggregation_type=member&period_from=2026-03-01&period_to=2026-03-31 を実行する
    Then ステータスコード200が返却される
    And items に利用者「U001」の集計結果（usage_count=5）が含まれる

  Scenario: 認証なしでアクセスした場合
    Given 未認証状態である
    When GET /api/admin/usage-analysis を実行する
    Then ステータスコード401が返却される

  Scenario: サービス運営担当者以外がアクセスした場合
    Given 利用者「佐藤次郎」で認証済みである
    When GET /api/admin/usage-analysis を実行する
    Then ステータスコード403が返却される
```
