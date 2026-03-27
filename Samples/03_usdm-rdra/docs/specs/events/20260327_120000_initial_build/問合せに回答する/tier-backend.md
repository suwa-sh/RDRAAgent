# 問合せに回答する - バックエンド仕様

## 変更概要

問合せへの回答を登録し、問合せ状態を「未対応」から「回答済み」に遷移させるAPIを新規作成する。

## API 仕様

### 未対応問合せ一覧取得API

- **メソッド**: GET
- **パス**: /api/owner/inquiries/pending
- **認証**: 会議室オーナー認証

#### リクエスト

| パラメータ | 型 | 必須 | 説明 |
|-----------|---|------|------|
| なし | | | |

#### レスポンス

| フィールド | 型 | 説明 |
|-----------|---|------|
| inquiries | array | 未対応の問合せ一覧 |
| inquiries[].inquiry_id | string | 問合せID |
| inquiries[].user_name | string | 問合せした利用者名 |
| inquiries[].content | string | 問合せ内容 |
| inquiries[].inquiry_status | string | 問合せ状態（未対応） |
| inquiries[].inquired_at | string | 問合せ日時 |

### 問合せ回答API

- **メソッド**: POST
- **パス**: /api/owner/inquiries/{inquiry_id}/reply
- **認証**: 会議室オーナー認証

#### リクエスト

| パラメータ | 型 | 必須 | 説明 |
|-----------|---|------|------|
| inquiry_id | string | Yes | 問合せID（パスパラメータ） |
| reply_content | string | Yes | 回答内容 |

#### レスポンス

| フィールド | 型 | 説明 |
|-----------|---|------|
| inquiry_id | string | 問合せID |
| inquiry_status | string | 遷移後の問合せ状態（回答済み） |
| replied_at | string | 回答日時 |

## データモデル変更

### 問合せ

| カラム | 型 | 説明 | 変更種別 |
|--------|---|------|---------|
| 問合せID | VARCHAR | 問合せの一意識別子 | 追加 |
| 利用者ID | VARCHAR | 問合せした利用者のID | 追加 |
| 問合せ先区分 | VARCHAR | オーナー宛/サービス運営宛 | 追加 |
| 問合せ先ID | VARCHAR | 問合せ先のID（オーナーID） | 追加 |
| 問合せ内容 | TEXT | 問合せ内容 | 追加 |
| 回答内容 | TEXT | 回答内容 | 追加 |
| 問合せ状態 | VARCHAR | 未対応/回答済み/対応済み | 追加 |
| 問合せ日時 | DATETIME | 問合せ日時 | 追加 |
| 回答日時 | DATETIME | 回答日時 | 追加 |

## ビジネスルール

- 問合せ状態が「未対応」の問合せのみ回答可能
- 回答内容は空文字を許容しない
- 回答時に問合せ状態を「未対応」→「回答済み」に遷移
- 回答日時を記録
- 問合せ先区分が「オーナー宛問合せ」で、自身宛の問合せのみ回答可能

## ティア完了条件（BDD）

```gherkin
Feature: 問合せに回答する - バックエンド

  Scenario: 問合せに回答する
    Given 問合せID「INQ-001」が「未対応」状態である
    And 問合せ先がオーナー「山田花子」である
    When POST /api/owner/inquiries/INQ-001/reply を reply_content="建物に併設の有料駐車場がございます" で実行する
    Then ステータスコード200が返却される
    And 問合せ状態が「回答済み」に更新される
    And 回答日時が記録される

  Scenario: 回答内容が空で回答しようとする
    Given 問合せID「INQ-002」が「未対応」状態である
    When POST /api/owner/inquiries/INQ-002/reply を reply_content="" で実行する
    Then ステータスコード400が返却される
    And エラーメッセージ「回答内容を入力してください」が返却される

  Scenario: 回答済みの問合せに再度回答しようとする
    Given 問合せID「INQ-003」が「回答済み」状態である
    When POST /api/owner/inquiries/INQ-003/reply を実行する
    Then ステータスコード409が返却される
    And エラーメッセージ「この問合せは既に回答済みです」が返却される

  Scenario: 他オーナー宛の問合せに回答しようとする
    Given 問合せID「INQ-004」の問合せ先がオーナー「鈴木一郎」である
    When オーナー「山田花子」が POST /api/owner/inquiries/INQ-004/reply を実行する
    Then ステータスコード403が返却される
```
