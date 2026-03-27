# 精算額を計算する - バックエンド仕様

## 変更概要

精算額計算API・精算一覧取得API・精算内訳取得APIを新規作成する。精算ルールに基づき利用料合計から手数料を差し引いた精算額の算出処理を実装する。

## API 仕様

### 精算額計算API

- **メソッド**: POST
- **パス**: /api/admin/settlements/calculate
- **認証**: サービス運営担当者認証

#### リクエスト

| パラメータ | 型 | 必須 | 説明 |
|-----------|---|------|------|
| target_month | string | Yes | 精算対象月（YYYY-MM） |

#### レスポンス

| フィールド | 型 | 説明 |
|-----------|---|------|
| target_month | string | 精算対象月 |
| calculated_count | number | 計算対象オーナー数 |
| items | array | 精算結果の配列 |
| items[].settlement_id | string | 精算ID |
| items[].owner_id | string | オーナーID |
| items[].owner_name | string | オーナー名 |
| items[].total_usage_fee | number | 利用料合計 |
| items[].total_commission | number | 手数料合計 |
| items[].settlement_amount | number | 精算額 |
| items[].status | string | 精算状態（精算計算済み） |

### 精算一覧取得API

- **メソッド**: GET
- **パス**: /api/admin/settlements
- **認証**: サービス運営担当者認証

#### リクエスト

| パラメータ | 型 | 必須 | 説明 |
|-----------|---|------|------|
| target_month | string | Yes | 精算対象月（YYYY-MM） |

#### レスポンス

| フィールド | 型 | 説明 |
|-----------|---|------|
| items | array | 精算一覧の配列 |
| items[].settlement_id | string | 精算ID |
| items[].owner_id | string | オーナーID |
| items[].owner_name | string | オーナー名 |
| items[].total_usage_fee | number | 利用料合計 |
| items[].total_commission | number | 手数料合計 |
| items[].settlement_amount | number | 精算額 |
| items[].status | string | 精算状態 |
| items[].settlement_date | string | 精算日 |

### 精算内訳取得API

- **メソッド**: GET
- **パス**: /api/admin/settlements/{settlement_id}
- **認証**: サービス運営担当者認証

#### レスポンス

| フィールド | 型 | 説明 |
|-----------|---|------|
| settlement_id | string | 精算ID |
| owner_id | string | オーナーID |
| owner_name | string | オーナー名 |
| target_month | string | 精算対象月 |
| total_usage_fee | number | 利用料合計 |
| total_commission | number | 手数料合計 |
| settlement_amount | number | 精算額 |
| status | string | 精算状態 |
| settlement_date | string | 精算日 |
| usage_details | array | 利用明細の配列 |
| usage_details[].room_name | string | 会議室名 |
| usage_details[].usage_fee | number | 利用料金 |
| usage_details[].commission | number | 手数料金額 |

## データモデル変更

### 精算情報

| カラム | 型 | 説明 | 変更種別 |
|--------|---|------|---------|
| 精算ID | VARCHAR | 精算の一意識別子 | 追加 |
| オーナーID | VARCHAR | オーナーの識別子 | 追加 |
| 精算対象月 | VARCHAR | 精算対象の年月 | 追加 |
| 利用料合計 | DECIMAL | 利用料金の合計 | 追加 |
| 手数料合計 | DECIMAL | 手数料の合計 | 追加 |
| 精算額 | DECIMAL | オーナーへの支払額 | 追加 |
| 精算状態 | VARCHAR | 精算の状態 | 追加 |
| 精算日 | DATE | 精算処理日 | 追加 |

## ビジネスルール

- 精算ルール: 精算額 = 利用料合計 - 手数料合計
- 月末締めで精算額を計算する
- 精算計算により精算状態を「未精算」から「精算計算済み」に遷移する
- 利用実績のないオーナーは精算対象外とする
- 既に精算計算済みの月を再計算する場合は確認を求める
- サービス運営担当者のみがアクセス可能とする

## ティア完了条件（BDD）

```gherkin
Feature: 精算額を計算する - バックエンド

  Scenario: 精算額を計算する
    Given オーナー「O001」の2026年3月の利用料合計が100000円、手数料合計が10000円である
    When POST /api/admin/settlements/calculate に target_month=「2026-03」を送信する
    Then ステータスコード200が返却される
    And items にオーナー「O001」のsettlement_amount=90000が含まれる
    And status が「精算計算済み」である

  Scenario: 利用実績のない月の精算額を計算する
    Given 2025年1月の利用履歴が0件である
    When POST /api/admin/settlements/calculate に target_month=「2025-01」を送信する
    Then ステータスコード200が返却される
    And calculated_count が0となる

  Scenario: サービス運営担当者以外がアクセスした場合
    Given 利用者「佐藤次郎」で認証済みである
    When POST /api/admin/settlements/calculate を実行する
    Then ステータスコード403が返却される
```
