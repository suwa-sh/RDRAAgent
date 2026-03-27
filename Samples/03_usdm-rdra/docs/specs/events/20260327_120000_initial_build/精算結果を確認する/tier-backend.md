# 精算結果を確認する - バックエンド仕様

## 変更概要

会議室オーナー向けの精算結果取得API・精算内訳取得APIを新規作成する。自身の精算履歴と支払状況の参照を実装する。

## API 仕様

### 精算結果一覧取得API

- **メソッド**: GET
- **パス**: /api/owner/settlements
- **認証**: 会議室オーナー認証

#### リクエスト

| パラメータ | 型 | 必須 | 説明 |
|-----------|---|------|------|
| page | number | No | ページ番号（デフォルト: 1） |
| per_page | number | No | 1ページあたりの件数（デフォルト: 12） |

#### レスポンス

| フィールド | 型 | 説明 |
|-----------|---|------|
| total_count | number | 精算履歴の総件数 |
| items | array | 精算結果の配列 |
| items[].settlement_id | string | 精算ID |
| items[].target_month | string | 精算対象月 |
| items[].total_usage_fee | number | 利用料合計 |
| items[].total_commission | number | 手数料合計 |
| items[].settlement_amount | number | 精算額 |
| items[].status | string | 精算状態 |

### 精算内訳取得API

- **メソッド**: GET
- **パス**: /api/owner/settlements/{settlement_id}
- **認証**: 会議室オーナー認証

#### レスポンス

| フィールド | 型 | 説明 |
|-----------|---|------|
| settlement_id | string | 精算ID |
| target_month | string | 精算対象月 |
| total_usage_fee | number | 利用料合計 |
| total_commission | number | 手数料合計 |
| settlement_amount | number | 精算額 |
| status | string | 精算状態 |
| payment_amount | number | 支払金額 |
| payment_date | string | 支払日 |
| payment_status | string | 支払状態 |

## データモデル変更

### 精算情報（参照）

| カラム | 型 | 説明 | 変更種別 |
|--------|---|------|---------|
| 精算ID | VARCHAR | 精算の一意識別子 | 既存参照 |
| オーナーID | VARCHAR | オーナーの識別子 | 既存参照 |
| 精算対象月 | VARCHAR | 精算対象の年月 | 既存参照 |
| 利用料合計 | DECIMAL | 利用料金の合計 | 既存参照 |
| 手数料合計 | DECIMAL | 手数料の合計 | 既存参照 |
| 精算額 | DECIMAL | オーナーへの支払額 | 既存参照 |
| 精算状態 | VARCHAR | 精算の状態 | 既存参照 |

### オーナー精算（参照）

| カラム | 型 | 説明 | 変更種別 |
|--------|---|------|---------|
| 精算実行ID | VARCHAR | 精算実行の一意識別子 | 既存参照 |
| 支払金額 | DECIMAL | 支払金額 | 既存参照 |
| 支払日 | DATE | 支払日 | 既存参照 |
| 支払状態 | VARCHAR | 支払の状態 | 既存参照 |

## ビジネスルール

- オーナーは自身の精算結果のみ参照可能とする
- 精算履歴は精算対象月の降順で表示する
- 精算内訳にはオーナー精算（支払情報）も含めて返却する

## ティア完了条件（BDD）

```gherkin
Feature: 精算結果を確認する - バックエンド

  Scenario: 自身の精算結果一覧を取得する
    Given オーナー「O001」の精算履歴が3件存在する
    When GET /api/owner/settlements を実行する
    Then ステータスコード200が返却される
    And total_count が3となる
    And items が精算対象月の降順で返却される

  Scenario: 精算内訳を取得する
    Given オーナー「O001」の精算「S001」が支払済みである
    When GET /api/owner/settlements/S001 を実行する
    Then ステータスコード200が返却される
    And settlement_amount と payment_amount が含まれる
    And payment_date と payment_status が含まれる

  Scenario: 他のオーナーの精算結果にアクセスした場合
    Given オーナー「O001」で認証済みである
    And 精算「S999」はオーナー「O002」の精算である
    When GET /api/owner/settlements/S999 を実行する
    Then ステータスコード403が返却される
```
