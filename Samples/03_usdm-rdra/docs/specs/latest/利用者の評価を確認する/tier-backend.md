# 利用者の評価を確認する - バックエンド仕様

## 変更概要

利用者の過去の利用評価を取得するAPIを新規作成する。

## API 仕様

### 利用者評価取得API

- **メソッド**: GET
- **パス**: /api/owner/users/{user_id}/ratings
- **認証**: 会議室オーナー認証

#### リクエスト

| パラメータ | 型 | 必須 | 説明 |
|-----------|---|------|------|
| user_id | string | Yes | 利用者ID（パスパラメータ） |

#### レスポンス

| フィールド | 型 | 説明 |
|-----------|---|------|
| user_id | string | 利用者ID |
| user_name | string | 利用者名 |
| average_score | number | 平均評価スコア |
| ratings | array | 評価一覧 |
| ratings[].rating_id | string | 評価ID |
| ratings[].owner_name | string | 評価したオーナー名 |
| ratings[].score | number | 評価スコア |
| ratings[].comment | string | コメント |
| ratings[].rated_at | string | 評価日時 |

## データモデル変更

### 利用者評価

| カラム | 型 | 説明 | 変更種別 |
|--------|---|------|---------|
| 評価ID | VARCHAR | 評価の一意識別子 | 追加 |
| オーナーID | VARCHAR | 評価したオーナーのID | 追加 |
| 利用者ID | VARCHAR | 評価対象の利用者ID | 追加 |
| 評価スコア | DECIMAL | 評価スコア | 追加 |
| コメント | TEXT | 評価コメント | 追加 |
| 評価日時 | DATETIME | 評価日時 | 追加 |

## ビジネスルール

- 会議室オーナーのみがアクセス可能
- 評価一覧は評価日時の降順で返却する
- 存在しない利用者IDの場合は404エラーを返却する

## ティア完了条件（BDD）

```gherkin
Feature: 利用者の評価を確認する - バックエンド

  Scenario: 利用者の評価一覧を取得する
    Given 利用者ID「USR-001」に対する評価が3件登録されている
    When GET /api/owner/users/USR-001/ratings を実行する
    Then ステータスコード200が返却される
    And 評価が3件返却される
    And average_score が計算済みの値で返却される

  Scenario: 評価のない利用者の評価を取得する
    Given 利用者ID「USR-002」に対する評価が0件である
    When GET /api/owner/users/USR-002/ratings を実行する
    Then ステータスコード200が返却される
    And 空の評価一覧が返却される
    And average_score が null で返却される

  Scenario: 存在しない利用者の評価を取得する
    When GET /api/owner/users/USR-999/ratings を実行する
    Then ステータスコード404が返却される
    And エラーメッセージ「指定された利用者が見つかりません」が返却される
```
