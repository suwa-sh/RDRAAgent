# 精算を実行する - バックエンド仕様

## 変更概要

精算実行APIを新規作成する。決済機関と連携してオーナーへの精算支払処理を実装する。精算状態の遷移とオーナー精算の記録を行う。

## API 仕様

### 精算実行API

- **メソッド**: POST
- **パス**: /api/admin/settlements/execute
- **認証**: サービス運営担当者認証

#### リクエスト

| パラメータ | 型 | 必須 | 説明 |
|-----------|---|------|------|
| settlement_ids | array | Yes | 実行対象の精算IDの配列 |

#### レスポンス

| フィールド | 型 | 説明 |
|-----------|---|------|
| executed_count | number | 実行件数 |
| total_amount | number | 支払合計金額 |
| results | array | 実行結果の配列 |
| results[].settlement_id | string | 精算ID |
| results[].owner_id | string | オーナーID |
| results[].owner_name | string | オーナー名 |
| results[].payment_amount | number | 支払金額 |
| results[].payment_status | string | 支払状態（成功/失敗） |
| results[].payment_reference_id | string | 決済機関連携ID |

## データモデル変更

### オーナー精算

| カラム | 型 | 説明 | 変更種別 |
|--------|---|------|---------|
| 精算実行ID | VARCHAR | 精算実行の一意識別子 | 追加 |
| 精算ID | VARCHAR | 精算情報の識別子 | 追加 |
| 決済機関連携ID | VARCHAR | 決済機関側の取引識別子 | 追加 |
| 支払金額 | DECIMAL | 支払金額 | 追加 |
| 支払日 | DATE | 支払日 | 追加 |
| 支払状態 | VARCHAR | 支払の状態 | 追加 |

## ビジネスルール

- 精算計算済みの精算のみ実行可能とする
- 支払精算ポリシーに基づき決済方法ごとの処理手順を適用する
- 決済機関との連携はイベント「精算支払連携」として実行する
- 支払成功時は精算状態を「支払済み」に遷移する
- 支払失敗時は精算状態を変更せず、エラー情報を記録する
- 決済状態を「引き落とし済み」に遷移する（支払成功時）

## ティア完了条件（BDD）

```gherkin
Feature: 精算を実行する - バックエンド

  Scenario: 精算を実行する
    Given 精算「S001」の状態が「精算計算済み」で精算額が90000円である
    When POST /api/admin/settlements/execute に settlement_ids=["S001"] を送信する
    Then ステータスコード200が返却される
    And results[0].payment_status が「成功」である
    And results[0].payment_amount が90000である

  Scenario: 精算計算済みでない精算を実行しようとした場合
    Given 精算「S002」の状態が「未精算」である
    When POST /api/admin/settlements/execute に settlement_ids=["S002"] を送信する
    Then ステータスコード422が返却される
    And エラーメッセージ「精算計算済みの精算のみ実行可能です」が返却される

  Scenario: 決済機関連携失敗時
    Given 精算「S003」の状態が「精算計算済み」である
    And 決済機関との通信が失敗する状態である
    When POST /api/admin/settlements/execute に settlement_ids=["S003"] を送信する
    Then ステータスコード200が返却される
    And results[0].payment_status が「失敗」である
    And 精算「S003」の状態は「精算計算済み」のまま変更されない
```
