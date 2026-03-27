# 決済方法を設定する - バックエンド仕様

## 変更概要

決済方法設定APIを新規作成する。利用者が選択した決済手段（クレジットカードまたは電子マネー）を登録し、決済状態を「決済手段登録済み」に遷移する。

## API 仕様

### 決済方法設定API

- **メソッド**: POST
- **パス**: /api/reservations/{reservation_id}/payment
- **認証**: Bearer トークン（利用者）

#### リクエスト

| パラメータ | 型 | 必須 | 説明 |
|-----------|---|------|------|
| payment_method | string | Yes | 決済方法（credit_card / e_money） |
| card_number | string | No | カード番号（クレジットカードの場合必須） |
| card_expiry | string | No | 有効期限（YYYY-MM）（クレジットカードの場合必須） |
| card_cvv | string | No | セキュリティコード（クレジットカードの場合必須） |
| e_money_account | string | No | 電子マネーアカウント情報（電子マネーの場合必須） |

#### レスポンス

| フィールド | 型 | 説明 |
|-----------|---|------|
| payment_id | string | 決済ID |
| reservation_id | string | 予約ID |
| payment_method | string | 決済方法 |
| status | string | 決済状態（「決済手段登録済み」） |
| created_at | datetime | 登録日時 |

## データモデル変更

### 決済情報

| カラム | 型 | 説明 | 変更種別 |
|--------|---|------|---------|
| payment_id | VARCHAR | 決済ID | 追加 |
| reservation_id | VARCHAR | 予約ID | 追加 |
| payment_method | VARCHAR | 決済方法（credit_card / e_money） | 追加 |
| status | VARCHAR | 決済状態（未登録/決済手段登録済み/引き落とし済み） | 追加 |
| amount | DECIMAL | 決済金額 | 追加 |
| payment_date | DATETIME | 決済日時 | 追加 |

## ビジネスルール

- 決済方法はクレジットカードまたは電子マネーのいずれかを選択する（支払精算ポリシー）
- クレジットカードの場合、カード番号の形式チェックおよび有効期限の未来日チェックを行う
- 電子マネーの場合、アカウント情報の形式チェックを行う
- 決済情報の登録により決済状態が「未登録」から「決済手段登録済み」に遷移する
- カード情報はトークン化して保存する（生のカード番号は保持しない）

## ティア完了条件（BDD）

```gherkin
Feature: 決済方法を設定する - バックエンド

  Scenario: クレジットカードで決済方法を登録する
    Given 予約「R001」が存在し決済情報が「未登録」状態である
    When POST /api/reservations/R001/payment に payment_method="credit_card", card_number="4111111111111111", card_expiry="2028-12", card_cvv="123" をリクエストする
    Then ステータスコード201が返される
    And レスポンスの status が「決済手段登録済み」である

  Scenario: 電子マネーで決済方法を登録する
    Given 予約「R001」が存在し決済情報が「未登録」状態である
    When POST /api/reservations/R001/payment に payment_method="e_money", e_money_account="em_account_001" をリクエストする
    Then ステータスコード201が返される
    And レスポンスの status が「決済手段登録済み」である

  Scenario: 無効なカード番号でエラーを返す
    When POST /api/reservations/R001/payment に payment_method="credit_card", card_number="1234", card_expiry="2028-12", card_cvv="123" をリクエストする
    Then ステータスコード400が返される
    And エラーメッセージ「無効なカード番号です」が返される

  Scenario: 有効期限切れのカードでエラーを返す
    When POST /api/reservations/R001/payment に payment_method="credit_card", card_number="4111111111111111", card_expiry="2024-01", card_cvv="123" をリクエストする
    Then ステータスコード400が返される
    And エラーメッセージ「有効期限が切れています」が返される
```
