# 利用者を評価する - バックエンド仕様

## 変更概要

利用者の評価を登録するAPIを新規作成する。

## API 仕様

### 評価対象一覧取得API

- **メソッド**: GET
- **パス**: /api/owner/ratings/targets
- **認証**: 会議室オーナー認証

#### リクエスト

| パラメータ | 型 | 必須 | 説明 |
|-----------|---|------|------|
| なし | | | |

#### レスポンス

| フィールド | 型 | 説明 |
|-----------|---|------|
| targets | array | 評価対象一覧 |
| targets[].usage_id | string | 会議室利用ID |
| targets[].user_id | string | 利用者ID |
| targets[].user_name | string | 利用者名 |
| targets[].room_name | string | 会議室名 |
| targets[].start_datetime | string | 利用開始日時 |
| targets[].end_datetime | string | 利用終了日時 |

### 利用者評価登録API

- **メソッド**: POST
- **パス**: /api/owner/ratings
- **認証**: 会議室オーナー認証

#### リクエスト

| パラメータ | 型 | 必須 | 説明 |
|-----------|---|------|------|
| user_id | string | Yes | 評価対象の利用者ID |
| usage_id | string | Yes | 対応する会議室利用ID |
| score | number | Yes | 評価スコア（1~5） |
| comment | string | No | 評価コメント |

#### レスポンス

| フィールド | 型 | 説明 |
|-----------|---|------|
| rating_id | string | 登録された評価ID |
| user_id | string | 利用者ID |
| score | number | 評価スコア |
| rated_at | string | 評価日時 |

## データモデル変更

### 利用者評価

| カラム | 型 | 説明 | 変更種別 |
|--------|---|------|---------|
| 評価ID | VARCHAR | 評価の一意識別子 | 追加 |
| オーナーID | VARCHAR | 評価したオーナーのID | 追加 |
| 利用者ID | VARCHAR | 評価対象の利用者ID | 追加 |
| 評価スコア | DECIMAL | 評価スコア（1~5） | 追加 |
| コメント | TEXT | 評価コメント | 追加 |
| 評価日時 | DATETIME | 評価日時 | 追加 |

## ビジネスルール

- 評価スコアは1~5の整数のみ許容
- 会議室利用が「利用終了」状態の場合のみ評価可能
- 同一の会議室利用に対して同一オーナーは1回のみ評価可能
- 評価結果は使用許諾条件の判断材料として利用される

## ティア完了条件（BDD）

```gherkin
Feature: 利用者を評価する - バックエンド

  Scenario: 利用者の評価を登録する
    Given 会議室利用ID「USG-001」が「利用終了」状態である
    And 利用者ID「USR-001」に対するオーナー「山田花子」の評価が未登録である
    When POST /api/owner/ratings を user_id="USR-001", usage_id="USG-001", score=4, comment="マナー良好" で実行する
    Then ステータスコード201が返却される
    And 評価IDが返却される

  Scenario: 評価スコアが範囲外で登録しようとする
    When POST /api/owner/ratings を score=6 で実行する
    Then ステータスコード400が返却される
    And エラーメッセージ「評価スコアは1~5の範囲で入力してください」が返却される

  Scenario: 利用終了していない利用に対して評価しようとする
    Given 会議室利用ID「USG-002」が「利用中」状態である
    When POST /api/owner/ratings を usage_id="USG-002" で実行する
    Then ステータスコード400が返却される
    And エラーメッセージ「利用終了後に評価してください」が返却される

  Scenario: 同一利用に対して重複評価しようとする
    Given 会議室利用ID「USG-001」に対するオーナー「山田花子」の評価が既に登録済みである
    When POST /api/owner/ratings を usage_id="USG-001" で実行する
    Then ステータスコード409が返却される
    And エラーメッセージ「この利用に対する評価は既に登録済みです」が返却される
```
