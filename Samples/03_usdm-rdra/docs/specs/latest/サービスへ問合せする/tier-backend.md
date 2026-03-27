# サービスへ問合せする - バックエンド仕様

## 変更概要

サービス問合せ登録APIと問合せ履歴取得APIを新規作成する。問合せの登録処理と利用者ごとの問合せ履歴参照を実装する。

## API 仕様

### 問合せ登録API

- **メソッド**: POST
- **パス**: /api/inquiries/service
- **認証**: 利用者認証

#### リクエスト

| パラメータ | 型 | 必須 | 説明 |
|-----------|---|------|------|
| content | string | Yes | 問合せ内容 |

#### レスポンス

| フィールド | 型 | 説明 |
|-----------|---|------|
| inquiry_id | string | 問合せID |
| user_id | string | 利用者ID |
| inquiry_type | string | 問合せ先区分（service） |
| content | string | 問合せ内容 |
| status | string | 問合せ状態（未対応） |
| inquiry_datetime | string | 問合せ日時 |

### 問合せ履歴取得API

- **メソッド**: GET
- **パス**: /api/inquiries/service
- **認証**: 利用者認証

#### レスポンス

| フィールド | 型 | 説明 |
|-----------|---|------|
| items | array | 問合せ履歴の配列 |
| items[].inquiry_id | string | 問合せID |
| items[].content | string | 問合せ内容 |
| items[].answer | string | 回答内容（未回答の場合はnull） |
| items[].status | string | 問合せ状態（未対応/回答済み/対応済み） |
| items[].inquiry_datetime | string | 問合せ日時 |
| items[].answer_datetime | string | 回答日時（未回答の場合はnull） |

## データモデル変更

### 問合せ

| カラム | 型 | 説明 | 変更種別 |
|--------|---|------|---------|
| 問合せID | VARCHAR | 問合せの一意識別子 | 追加 |
| 利用者ID | VARCHAR | 利用者の識別子 | 追加 |
| 問合せ先区分 | VARCHAR | 問合せ先の種別（オーナー宛/サービス運営宛） | 追加 |
| 問合せ先ID | VARCHAR | 問合せ先の識別子 | 追加 |
| 問合せ内容 | TEXT | 問合せ内容 | 追加 |
| 回答内容 | TEXT | 回答内容 | 追加 |
| 問合せ状態 | VARCHAR | 問合せの対応状態 | 追加 |
| 問合せ日時 | DATETIME | 問合せ日時 | 追加 |
| 回答日時 | DATETIME | 回答日時 | 追加 |

## ビジネスルール

- 問合せ先区分は「サービス運営宛問合せ」として登録する
- 問合せ登録時の状態は「未対応」とする
- 問合せ内容は空を許容しない
- 利用者は自身の問合せ履歴のみ参照可能とする

## ティア完了条件（BDD）

```gherkin
Feature: サービスへ問合せする - バックエンド

  Scenario: 問合せを登録する
    Given 利用者「U001」で認証済みである
    When POST /api/inquiries/service に content=「予約のキャンセルについて教えてください」を送信する
    Then ステータスコード201が返却される
    And status が「未対応」である
    And inquiry_type が「service」である

  Scenario: 問合せ内容が空の場合
    Given 利用者「U001」で認証済みである
    When POST /api/inquiries/service に content="" を送信する
    Then ステータスコード400が返却される
    And エラーメッセージ「問合せ内容を入力してください」が返却される

  Scenario: 問合せ履歴を取得する
    Given 利用者「U001」で認証済みである
    And 利用者「U001」の問合せが3件登録されている
    When GET /api/inquiries/service を実行する
    Then ステータスコード200が返却される
    And items に3件の問合せ履歴が含まれる
```
