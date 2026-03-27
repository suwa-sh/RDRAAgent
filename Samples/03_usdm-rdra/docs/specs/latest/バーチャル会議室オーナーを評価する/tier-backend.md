# バーチャル会議室オーナーを評価する - バックエンド仕様

## 変更概要

バーチャル会議室オーナー評価登録APIを新規作成する。既存のオーナー評価登録と同じ会議室評価テーブルを使用し、評価種別「オーナー評価」として登録する。

## API 仕様

### バーチャル会議室オーナー評価登録API

- **メソッド**: POST
- **パス**: /api/rooms/{room_id}/owner-reviews
- **認証**: Bearer トークン（利用者）

#### リクエスト

| パラメータ | 型 | 必須 | 説明 |
|-----------|---|------|------|
| rating_score | number | Yes | 評価スコア（1〜5） |
| comment | string | No | 評価コメント |

#### レスポンス

| フィールド | 型 | 説明 |
|-----------|---|------|
| review_id | string | 評価ID |
| user_id | string | 利用者ID |
| room_id | string | 会議室ID |
| owner_id | string | オーナーID |
| room_type | string | 会議室種別（バーチャル） |
| rating_score | number | 評価スコア |
| comment | string | 評価コメント |
| reviewed_at | datetime | 評価日時 |

## データモデル変更

なし（会議室評価テーブルの既存カラムを使用。room_type カラムは「バーチャル会議室を評価する」で追加済み）

## ビジネスルール

- 評価スコアは1〜5の整数のみ
- 利用者が実際に利用したバーチャル会議室のオーナーのみ評価可能
- 評価種別は「オーナー評価」として登録される
- 会議室種別は対象会議室の種別から自動設定される

## ティア完了条件（BDD）

```gherkin
Feature: バーチャル会議室オーナーを評価する - バックエンド

  Scenario: バーチャル会議室オーナーの評価を正常に登録する
    Given 利用者「田中太郎」の認証トークンがある
    And 利用者「田中太郎」がバーチャル会議室「VR001」（オーナー: 鈴木花子）を利用済みである
    When POST /api/rooms/VR001/owner-reviews に以下をリクエストする
      | rating_score | 5                                     |
      | comment      | 会議URL発行が迅速で丁寧な対応でした    |
    Then ステータスコード201が返される
    And レスポンスの room_type が「バーチャル」である
    And レスポンスの rating_score が 5 である

  Scenario: 利用していない会議室のオーナー評価はエラーとなる
    Given 利用者「田中太郎」の認証トークンがある
    And 利用者「田中太郎」がバーチャル会議室「VR002」を利用していない
    When POST /api/rooms/VR002/owner-reviews をリクエストする
    Then ステータスコード403が返される
    And エラーメッセージに「この会議室を利用していないためオーナーを評価できません」が含まれる

  Scenario: 評価スコアが範囲外の場合にエラーとなる
    Given 利用者「田中太郎」の認証トークンがある
    When POST /api/rooms/VR001/owner-reviews に rating_score「0」でリクエストする
    Then ステータスコード400が返される
    And エラーメッセージに「評価スコアは1〜5の範囲で入力してください」が含まれる
```
