# 会議室の評価を確認する - バックエンド仕様

## 変更概要

会議室に紐づく評価を一覧取得するAPIエンドポイントを新規作成する。所有者チェックを行い、自身の会議室の評価のみ取得可能とする。

## API 仕様

### 会議室評価一覧取得API

- **メソッド**: GET
- **パス**: /api/rooms/:room_id/reviews
- **認証**: 会議室オーナー認証必須（所有者のみ）

#### リクエスト

| パラメータ | 型 | 必須 | 説明 |
|-----------|---|------|------|
| room_id | string | Yes | 会議室ID（パスパラメータ） |

#### レスポンス

| フィールド | 型 | 説明 |
|-----------|---|------|
| room_id | string | 会議室ID |
| room_name | string | 会議室名 |
| average_score | number | 平均評価スコア |
| total_count | number | 評価総件数 |
| reviews | object[] | 評価一覧 |
| reviews[].review_id | string | 評価ID |
| reviews[].reviewer_name | string | 評価者名 |
| reviews[].score | number | 評価スコア |
| reviews[].comment | string | コメント |
| reviews[].reviewed_at | string | 評価日時 |

## データモデル変更

### 会議室評価

| カラム | 型 | 説明 | 変更種別 |
|--------|---|------|---------|
| review_id | VARCHAR | 評価ID（PK） | 追加 |
| reviewer_id | VARCHAR | 利用者ID（FK） | 追加 |
| room_id | VARCHAR | 会議室ID（FK） | 追加 |
| owner_id | VARCHAR | オーナーID（FK） | 追加 |
| score | INT | 評価スコア | 追加 |
| comment | TEXT | コメント | 追加 |
| reviewed_at | TIMESTAMP | 評価日時 | 追加 |

## ビジネスルール

- 会議室の所有者のみ評価一覧を取得可能
- 評価は評価日時の降順でソートする
- 平均評価スコアは全評価スコアの算術平均（小数点第1位まで）

## ティア完了条件（BDD）

```gherkin
Feature: 会議室の評価を確認する - バックエンド

  Scenario: 所有する会議室の評価一覧を取得する
    Given 会議室オーナー「山田太郎」の認証トークンがある
    And 会議室「room-001」に評価が3件登録済み
    When GET /api/rooms/room-001/reviews を送信する
    Then ステータスコード200が返される
    And レスポンスの total_count が3である
    And レスポンスの reviews が評価日時の降順で並んでいる

  Scenario: 他のオーナーの会議室評価を取得しようとした場合
    Given 会議室オーナー「山田太郎」の認証トークンがある
    And 会議室「room-002」はオーナー「佐藤花子」の所有
    When GET /api/rooms/room-002/reviews を送信する
    Then ステータスコード403が返される

  Scenario: 評価がない場合の取得
    Given 会議室オーナー「山田太郎」の認証トークンがある
    And 会議室「room-001」に評価が0件
    When GET /api/rooms/room-001/reviews を送信する
    Then ステータスコード200が返される
    And レスポンスの total_count が0である
    And レスポンスの reviews が空配列である
```
