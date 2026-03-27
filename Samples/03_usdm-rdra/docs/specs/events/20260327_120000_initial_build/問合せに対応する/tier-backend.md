# 問合せに対応する - バックエンド仕様

## 変更概要

問合せ一覧取得API・問合せ詳細取得API・問合せ状態更新APIを新規作成する。サービス運営担当者向けの問合せ管理機能を実装する。

## API 仕様

### 問合せ一覧取得API

- **メソッド**: GET
- **パス**: /api/admin/inquiries
- **認証**: サービス運営担当者認証

#### リクエスト

| パラメータ | 型 | 必須 | 説明 |
|-----------|---|------|------|
| status | string | No | 問合せ状態フィルタ（pending, answered, resolved） |
| page | number | No | ページ番号（デフォルト: 1） |
| per_page | number | No | 1ページあたりの件数（デフォルト: 20） |

#### レスポンス

| フィールド | 型 | 説明 |
|-----------|---|------|
| total_count | number | 検索結果の総件数 |
| items | array | 問合せの配列 |
| items[].inquiry_id | string | 問合せID |
| items[].user_id | string | 利用者ID |
| items[].user_name | string | 利用者名 |
| items[].content | string | 問合せ内容 |
| items[].status | string | 問合せ状態 |
| items[].inquiry_datetime | string | 問合せ日時 |

### 問合せ詳細取得API

- **メソッド**: GET
- **パス**: /api/admin/inquiries/{inquiry_id}
- **認証**: サービス運営担当者認証

#### レスポンス

| フィールド | 型 | 説明 |
|-----------|---|------|
| inquiry_id | string | 問合せID |
| user_id | string | 利用者ID |
| user_name | string | 利用者名 |
| inquiry_type | string | 問合せ先区分 |
| content | string | 問合せ内容 |
| answer | string | 回答内容 |
| status | string | 問合せ状態 |
| inquiry_datetime | string | 問合せ日時 |
| answer_datetime | string | 回答日時 |

### 問合せ状態更新API

- **メソッド**: PUT
- **パス**: /api/admin/inquiries/{inquiry_id}/resolve
- **認証**: サービス運営担当者認証

#### レスポンス

| フィールド | 型 | 説明 |
|-----------|---|------|
| inquiry_id | string | 問合せID |
| status | string | 更新後の問合せ状態（対応済み） |

## データモデル変更

### 問合せ（参照）

| カラム | 型 | 説明 | 変更種別 |
|--------|---|------|---------|
| 問合せID | VARCHAR | 問合せの一意識別子 | 既存参照 |
| 利用者ID | VARCHAR | 利用者の識別子 | 既存参照 |
| 問合せ先区分 | VARCHAR | 問合せ先の種別 | 既存参照 |
| 問合せ内容 | TEXT | 問合せ内容 | 既存参照 |
| 回答内容 | TEXT | 回答内容 | 既存参照 |
| 問合せ状態 | VARCHAR | 問合せの対応状態 | 既存参照 |
| 問合せ日時 | DATETIME | 問合せ日時 | 既存参照 |
| 回答日時 | DATETIME | 回答日時 | 既存参照 |

## ビジネスルール

- 問合せ状態は「未対応」→「回答済み」→「対応済み」の順に遷移する
- 「対応済み」への状態変更は「回答済み」状態の問合せのみ可能
- 「未対応」から直接「対応済み」への遷移は不可
- サービス運営担当者のみがアクセス可能とする

## ティア完了条件（BDD）

```gherkin
Feature: 問合せに対応する - バックエンド

  Scenario: 問合せ一覧を取得する
    Given 未対応の問合せが3件、回答済みが2件登録されている
    When GET /api/admin/inquiries を実行する
    Then ステータスコード200が返却される
    And total_count が5となる

  Scenario: 回答済みの問合せを対応済みにする
    Given 問合せ「Q001」の状態が「回答済み」である
    When PUT /api/admin/inquiries/Q001/resolve を実行する
    Then ステータスコード200が返却される
    And status が「対応済み」となる

  Scenario: 未対応の問合せを対応済みにしようとした場合
    Given 問合せ「Q002」の状態が「未対応」である
    When PUT /api/admin/inquiries/Q002/resolve を実行する
    Then ステータスコード422が返却される
    And エラーメッセージ「回答済みの問合せのみ対応済みに変更できます」が返却される
```
