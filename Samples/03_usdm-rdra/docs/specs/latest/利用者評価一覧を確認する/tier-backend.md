# 利用者評価一覧を確認する - バックエンド仕様

## 変更概要

会議室オーナーが受けた利用者評価の一覧を取得するAPIを新規作成する。

## API 仕様

### 受領評価一覧取得API

- **メソッド**: GET
- **パス**: /api/owner/ratings/received
- **認証**: 会議室オーナー認証

#### リクエスト

| パラメータ | 型 | 必須 | 説明 |
|-----------|---|------|------|
| sort | string | No | ソート順（"date_desc"（デフォルト）/ "score_desc" / "score_asc"） |
| page | number | No | ページ番号（デフォルト: 1） |
| per_page | number | No | 1ページあたりの件数（デフォルト: 20） |

#### レスポンス

| フィールド | 型 | 説明 |
|-----------|---|------|
| summary.average_score | number | 全評価の平均スコア |
| summary.total_count | number | 総評価件数 |
| ratings | array | 評価一覧 |
| ratings[].rating_id | string | 評価ID |
| ratings[].user_name | string | 評価した利用者名 |
| ratings[].room_name | string | 対象会議室名 |
| ratings[].score | number | 評価スコア |
| ratings[].comment | string | コメント |
| ratings[].rated_at | string | 評価日時 |
| pagination.page | number | 現在ページ |
| pagination.per_page | number | 1ページあたり件数 |
| pagination.total_pages | number | 総ページ数 |

## データモデル変更

### 利用者評価

| カラム | 型 | 説明 | 変更種別 |
|--------|---|------|---------|
| 評価ID | VARCHAR | 評価の一意識別子 | 追加 |
| オーナーID | VARCHAR | 評価対象のオーナーID | 追加 |
| 利用者ID | VARCHAR | 評価した利用者のID | 追加 |
| 評価スコア | DECIMAL | 評価スコア | 追加 |
| コメント | TEXT | 評価コメント | 追加 |
| 評価日時 | DATETIME | 評価日時 | 追加 |

## ビジネスルール

- ログイン中のオーナーが受けた評価のみ返却する
- デフォルトのソート順は評価日時の降順
- ページネーションをサポート

## ティア完了条件（BDD）

```gherkin
Feature: 利用者評価一覧を確認する - バックエンド

  Scenario: オーナーが受けた評価一覧を取得する
    Given オーナー「山田花子」に対する利用者評価が5件登録されている
    When GET /api/owner/ratings/received を実行する
    Then ステータスコード200が返却される
    And summary.total_count が 5 で返却される
    And summary.average_score が計算済みの値で返却される
    And 評価が5件返却される

  Scenario: 評価スコア順でソートする
    Given オーナー「山田花子」に対する利用者評価が複数件存在する
    When GET /api/owner/ratings/received?sort=score_desc を実行する
    Then 評価スコアの降順で返却される

  Scenario: 評価がない場合に空の一覧を取得する
    Given オーナー「新規オーナー」に対する利用者評価が0件である
    When GET /api/owner/ratings/received を実行する
    Then ステータスコード200が返却される
    And summary.total_count が 0 で返却される
    And 空の評価一覧が返却される
```
