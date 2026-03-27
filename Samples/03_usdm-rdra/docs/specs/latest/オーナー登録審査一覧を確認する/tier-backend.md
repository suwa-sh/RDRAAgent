# オーナー登録審査一覧を確認する - バックエンド仕様

## 変更概要

オーナー登録申請の一覧を審査状態でフィルタリングして取得するAPIを新規作成する。

## API 仕様

### オーナー審査一覧取得API

- **メソッド**: GET
- **パス**: /api/admin/owners
- **認証**: サービス運営担当者のみ

#### リクエスト

| パラメータ | 型 | 必須 | 説明 |
|-----------|---|------|------|
| reviewStatus | string | No | フィルタ条件の審査状態（「審査待ち」「登録済み」「却下」「退会」）。未指定時は全件取得 |

#### レスポンス

| フィールド | 型 | 説明 |
|-----------|---|------|
| owners | array | オーナー情報の配列 |
| owners[].ownerId | string | オーナーID |
| owners[].name | string | 氏名 |
| owners[].email | string | メールアドレス |
| owners[].registrationDate | string | 登録日 |
| owners[].reviewStatus | string | 審査状態 |
| totalCount | number | 該当件数 |

## データモデル変更

### オーナー情報

| カラム | 型 | 説明 | 変更種別 |
|--------|---|------|---------|
| - | - | 既存テーブルへの変更なし（参照のみ） | なし |

## ビジネスルール

- サービス運営担当者以外からのリクエストは認可エラーとする
- reviewStatusパラメータ未指定時は全審査状態のオーナーを返却する
- 一覧は登録日の降順（新しい申請が先頭）でソートする
- オーナー登録審査条件に関連する情報（審査状態）を一覧に含める

## ティア完了条件（BDD）

```gherkin
Feature: オーナー登録審査一覧を確認する - バックエンド

  Scenario: 審査待ちのオーナー一覧を取得する
    Given オーナー「鈴木一郎」の審査状態が「審査待ち」である
    And オーナー「佐藤花子」の審査状態が「登録済み」である
    When GET /api/admin/owners?reviewStatus=審査待ち を送信する
    Then ステータスコード200が返される
    And レスポンスのownersにオーナー「鈴木一郎」が含まれる
    And レスポンスのownersにオーナー「佐藤花子」が含まれない

  Scenario: 全オーナー一覧を取得する
    Given オーナー「鈴木一郎」の審査状態が「審査待ち」である
    And オーナー「佐藤花子」の審査状態が「登録済み」である
    When GET /api/admin/owners を送信する
    Then ステータスコード200が返される
    And レスポンスのownersにオーナー「鈴木一郎」と「佐藤花子」が含まれる

  Scenario: サービス運営担当者以外からのリクエストはエラーとなる
    Given 会議室オーナーの認証トークンを使用する
    When GET /api/admin/owners を送信する
    Then ステータスコード403が返される

  Scenario: 該当オーナーが0件の場合
    Given 審査待ちのオーナーが存在しない
    When GET /api/admin/owners?reviewStatus=審査待ち を送信する
    Then ステータスコード200が返される
    And レスポンスのownersが空配列である
    And totalCountが0である
```
