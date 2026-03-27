# 会議室を評価する - バックエンド仕様

## 変更概要

会議室評価登録APIを新規作成する。利用済みの会議室に対して利用者が評価スコアとコメントを登録する。

## API 仕様

### 会議室評価登録API

- **メソッド**: POST
- **パス**: /api/rooms/{room_id}/reviews
- **認証**: Bearer トークン（利用者）

#### リクエスト

| パラメータ | 型 | 必須 | 説明 |
|-----------|---|------|------|
| usage_id | string | Yes | 利用ID（会議室利用） |
| rating_score | number | Yes | 評価スコア（1〜5） |
| comment | string | No | 評価コメント |

#### レスポンス

| フィールド | 型 | 説明 |
|-----------|---|------|
| review_id | string | 評価ID |
| user_id | string | 利用者ID |
| room_id | string | 会議室ID |
| owner_id | string | オーナーID |
| rating_score | number | 評価スコア |
| comment | string | 評価コメント |
| review_type | string | 評価種別（「会議室評価」） |
| created_at | datetime | 評価日時 |

## データモデル変更

### 会議室評価

| カラム | 型 | 説明 | 変更種別 |
|--------|---|------|---------|
| review_id | VARCHAR | 評価ID | 追加 |
| user_id | VARCHAR | 利用者ID | 追加 |
| room_id | VARCHAR | 会議室ID | 追加 |
| owner_id | VARCHAR | オーナーID | 追加 |
| rating_score | INT | 評価スコア（1〜5） | 追加 |
| comment | TEXT | 評価コメント | 追加 |
| review_type | VARCHAR | 評価種別 | 追加 |
| created_at | DATETIME | 評価日時 | 追加 |

## ビジネスルール

- 利用者が当該会議室を利用済み（会議室利用が「利用終了」状態）である場合のみ評価可能
- 評価スコアは1〜5の整数値
- コメントは任意
- 評価種別は「会議室評価」を設定
- 同一利用に対する重複評価は不可

## ティア完了条件（BDD）

```gherkin
Feature: 会議室を評価する - バックエンド

  Scenario: 会議室評価を登録する
    Given 利用者「田中太郎」（user_id: U001）が会議室「新宿カンファレンスルームA」（room_id: R001）の利用を完了している（usage_id: US001）
    When POST /api/rooms/R001/reviews に usage_id="US001", rating_score=4, comment="設備が充実しており快適でした" をリクエストする
    Then ステータスコード201が返される
    And レスポンスの rating_score が 4 である
    And レスポンスの review_type が「会議室評価」である

  Scenario: 利用していない会議室を評価しようとするとエラーを返す
    Given 利用者「田中太郎」が会議室「渋谷ミーティングスペースB」（room_id: R002）を利用したことがない
    When POST /api/rooms/R002/reviews に usage_id="US999", rating_score=4 をリクエストする
    Then ステータスコード403が返される
    And エラーメッセージ「利用済みの会議室のみ評価できます」が返される

  Scenario: 評価スコアが範囲外の場合エラーを返す
    Given 利用者「田中太郎」が会議室「新宿カンファレンスルームA」の利用を完了している
    When POST /api/rooms/R001/reviews に usage_id="US001", rating_score=6 をリクエストする
    Then ステータスコード400が返される
    And エラーメッセージ「評価スコアは1〜5の範囲で入力してください」が返される
```
