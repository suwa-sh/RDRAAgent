# 手数料売上を分析する - バックエンド仕様

## 変更概要

手数料売上の集計・分析APIを新規作成する。売上分析区分（会議室別、貸出別、月別、オーナー別）に応じた集計処理を実装し、利用履歴との結合による分析データを提供する。

## API 仕様

### 手数料売上分析取得API

- **メソッド**: GET
- **パス**: /api/admin/commission-analysis
- **認証**: サービス運営担当者認証

#### リクエスト

| パラメータ | 型 | 必須 | 説明 |
|-----------|---|------|------|
| analysis_type | string | Yes | 売上分析区分（room, rental, monthly, owner） |
| period_from | string | Yes | 対象期間開始日（YYYY-MM-DD） |
| period_to | string | Yes | 対象期間終了日（YYYY-MM-DD） |

#### レスポンス

| フィールド | 型 | 説明 |
|-----------|---|------|
| analysis_type | string | 売上分析区分 |
| period_from | string | 対象期間開始日 |
| period_to | string | 対象期間終了日 |
| total_commission | number | 手数料合計金額 |
| items | array | 集計結果の配列 |
| items[].group_key | string | 集計キー（会議室ID/貸出ID/月/オーナーID） |
| items[].group_label | string | 集計キーの表示名 |
| items[].commission_amount | number | 手数料金額 |
| items[].commission_rate | number | 手数料率 |
| items[].count | number | 対象貸出件数 |

## データモデル変更

### 手数料売上

| カラム | 型 | 説明 | 変更種別 |
|--------|---|------|---------|
| 手数料ID | VARCHAR | 手数料の一意識別子 | 追加 |
| 会議室ID | VARCHAR | 対象会議室の識別子 | 追加 |
| 貸出ID | VARCHAR | 対象貸出の識別子 | 追加 |
| 手数料率 | DECIMAL | 適用された手数料率 | 追加 |
| 手数料金額 | DECIMAL | 手数料金額 | 追加 |
| 計上日 | DATE | 手数料の計上日 | 追加 |

### 利用履歴（参照）

| カラム | 型 | 説明 | 変更種別 |
|--------|---|------|---------|
| 履歴ID | VARCHAR | 利用履歴の一意識別子 | 既存参照 |
| 利用者ID | VARCHAR | 利用者の識別子 | 既存参照 |
| 会議室ID | VARCHAR | 会議室の識別子 | 既存参照 |
| 利用日時 | DATETIME | 利用日時 | 既存参照 |
| 利用時間 | INT | 利用時間（分） | 既存参照 |
| 利用料金 | DECIMAL | 利用料金 | 既存参照 |

## ビジネスルール

- 売上分析区分は会議室別、貸出別、月別、オーナー別の4種類を提供する
- 手数料売上は利用履歴と紐づけて集計する
- 対象期間は計上日を基準にフィルタリングする
- サービス運営担当者のみがアクセス可能とする

## ティア完了条件（BDD）

```gherkin
Feature: 手数料売上を分析する - バックエンド

  Scenario: 会議室別の手数料売上を取得する
    Given 会議室「R001」の2026年3月の手数料売上が3件登録されている
    When GET /api/admin/commission-analysis?analysis_type=room&period_from=2026-03-01&period_to=2026-03-31 を実行する
    Then ステータスコード200が返却される
    And items に会議室「R001」の集計結果が含まれる
    And total_commission が全会議室の手数料合計金額となる

  Scenario: 認証なしでアクセスした場合
    Given 未認証状態である
    When GET /api/admin/commission-analysis を実行する
    Then ステータスコード401が返却される

  Scenario: サービス運営担当者以外がアクセスした場合
    Given 利用者「佐藤次郎」で認証済みである
    When GET /api/admin/commission-analysis を実行する
    Then ステータスコード403が返却される
```
