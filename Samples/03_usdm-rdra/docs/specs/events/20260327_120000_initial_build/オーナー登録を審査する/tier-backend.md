# オーナー登録を審査する - バックエンド仕様

## 変更概要

オーナー登録申請の審査結果（承認・却下）を受け付け、オーナー情報の審査状態を更新するAPIを新規作成する。

## API 仕様

### オーナー審査情報取得API

- **メソッド**: GET
- **パス**: /api/admin/owners/:ownerId
- **認証**: サービス運営担当者のみ

#### リクエスト

| パラメータ | 型 | 必須 | 説明 |
|-----------|---|------|------|
| ownerId | string | Yes | 審査対象のオーナーID（パスパラメータ） |

#### レスポンス

| フィールド | 型 | 説明 |
|-----------|---|------|
| ownerId | string | オーナーID |
| name | string | 氏名 |
| contact | string | 連絡先 |
| email | string | メールアドレス |
| registrationDate | string | 登録日 |
| reviewStatus | string | 審査状態 |

### オーナー審査実行API

- **メソッド**: PUT
- **パス**: /api/admin/owners/:ownerId/review
- **認証**: サービス運営担当者のみ

#### リクエスト

| パラメータ | 型 | 必須 | 説明 |
|-----------|---|------|------|
| ownerId | string | Yes | 審査対象のオーナーID（パスパラメータ） |
| decision | string | Yes | 審査結果（「approved」または「rejected」） |

#### レスポンス

| フィールド | 型 | 説明 |
|-----------|---|------|
| ownerId | string | オーナーID |
| reviewStatus | string | 更新後の審査状態（「登録済み」または「却下」） |

## データモデル変更

### オーナー情報

| カラム | 型 | 説明 | 変更種別 |
|--------|---|------|---------|
| 審査状態 | VARCHAR | 「審査待ち」→「登録済み」または「却下」への状態遷移を管理 | 変更（状態遷移） |

## ビジネスルール

- 審査対象のオーナーの審査状態が「審査待ち」でない場合はエラーとする
- 承認（approved）の場合、審査状態を「登録済み」に更新する
- 却下（rejected）の場合、審査状態を「却下」に更新する
- オーナー登録審査条件に基づき、サービス運営担当者が判断する
- サービス運営担当者以外からのリクエストは認可エラーとする

## ティア完了条件（BDD）

```gherkin
Feature: オーナー登録を審査する - バックエンド

  Scenario: オーナー登録申請を承認する
    Given オーナー「鈴木一郎」の審査状態が「審査待ち」である
    When PUT /api/admin/owners/:ownerId/review にdecision「approved」を送信する
    Then ステータスコード200が返される
    And レスポンスのreviewStatusが「登録済み」である
    And オーナー情報テーブルの審査状態が「登録済み」に更新される

  Scenario: オーナー登録申請を却下する
    Given オーナー「田中二郎」の審査状態が「審査待ち」である
    When PUT /api/admin/owners/:ownerId/review にdecision「rejected」を送信する
    Then ステータスコード200が返される
    And レスポンスのreviewStatusが「却下」である
    And オーナー情報テーブルの審査状態が「却下」に更新される

  Scenario: 審査待ち以外のオーナーに対する審査はエラーとなる
    Given オーナー「佐藤花子」の審査状態が「登録済み」である
    When PUT /api/admin/owners/:ownerId/review にdecision「approved」を送信する
    Then ステータスコード409が返される
    And エラーメッセージに「審査待ち状態のオーナーのみ審査可能です」が含まれる

  Scenario: サービス運営担当者以外からのリクエストはエラーとなる
    Given 会議室オーナーの認証トークンを使用する
    When PUT /api/admin/owners/:ownerId/review にdecision「approved」を送信する
    Then ステータスコード403が返される
```
