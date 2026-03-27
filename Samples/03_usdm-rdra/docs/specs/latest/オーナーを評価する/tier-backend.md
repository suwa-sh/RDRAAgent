# オーナーを評価する - バックエンド仕様

## 変更概要

オーナー評価登録APIを新規作成する。利用済みの会議室のオーナーに対して利用者が評価スコアとコメントを登録する。

## API 仕様

### オーナー評価登録API

- **メソッド**: POST
- **パス**: /api/rooms/{room_id}/owner-reviews
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
| review_type | string | 評価種別（「オーナー評価」） |
| created_at | datetime | 評価日時 |

## データモデル変更

既存の会議室評価テーブルを使用（「会議室を評価する」UCで定義済み）。review_type カラムで「会議室評価」と「オーナー評価」を区別する。

## ビジネスルール

- 利用者が当該会議室を利用済み（会議室利用が「利用終了」状態）である場合のみ評価可能
- 評価スコアは1〜5の整数値
- コメントは任意
- 評価種別は「オーナー評価」を設定
- 同一利用に対する重複オーナー評価は不可
- オーナーIDは会議室情報から取得する

## ティア完了条件（BDD）

```gherkin
Feature: オーナーを評価する - バックエンド

  Scenario: オーナー評価を登録する
    Given 利用者「田中太郎」（user_id: U001）が会議室「新宿カンファレンスルームA」（room_id: R001、owner_id: O001）の利用を完了している（usage_id: US001）
    When POST /api/rooms/R001/owner-reviews に usage_id="US001", rating_score=5, comment="丁寧な対応でとても良かったです" をリクエストする
    Then ステータスコード201が返される
    And レスポンスの rating_score が 5 である
    And レスポンスの review_type が「オーナー評価」である
    And レスポンスの owner_id が「O001」である

  Scenario: 利用していない会議室のオーナーを評価しようとするとエラーを返す
    Given 利用者「田中太郎」が会議室「渋谷ミーティングスペースB」（room_id: R002）を利用したことがない
    When POST /api/rooms/R002/owner-reviews に usage_id="US999", rating_score=4 をリクエストする
    Then ステータスコード403が返される
    And エラーメッセージ「利用済みの会議室のオーナーのみ評価できます」が返される

  Scenario: 評価スコアが範囲外の場合エラーを返す
    Given 利用者「田中太郎」が会議室「新宿カンファレンスルームA」の利用を完了している
    When POST /api/rooms/R001/owner-reviews に usage_id="US001", rating_score=0 をリクエストする
    Then ステータスコード400が返される
    And エラーメッセージ「評価スコアは1〜5の範囲で入力してください」が返される
```
