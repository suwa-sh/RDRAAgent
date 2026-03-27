# オーナーへ問合せする - バックエンド仕様

## 変更概要

予約に紐づくオーナー問合せAPIを新規作成する。予約情報からオーナーを特定し、問合せ情報を作成する。

## API 仕様

### 予約関連オーナー問合せAPI

- **メソッド**: POST
- **パス**: /api/reservations/{reservation_id}/inquiries
- **認証**: Bearer トークン（利用者）

#### リクエスト

| パラメータ | 型 | 必須 | 説明 |
|-----------|---|------|------|
| content | string | Yes | 問合せ内容 |

#### レスポンス

| フィールド | 型 | 説明 |
|-----------|---|------|
| inquiry_id | string | 問合せID |
| user_id | string | 利用者ID |
| reservation_id | string | 予約ID |
| target_type | string | 問合せ先区分（「オーナー宛問合せ」） |
| target_id | string | 問合せ先ID（オーナーID） |
| content | string | 問合せ内容 |
| status | string | 問合せ状態（「未対応」） |
| created_at | datetime | 問合せ日時 |

## データモデル変更

既存の問合せテーブルを使用。追加カラムなし（問合せテーブルは「オーナーへ問合せを送信する」UCで定義済み）。

## ビジネスルール

- 問合せ内容は必須（空文字不可）
- 予約IDから会議室情報を取得し、会議室のオーナーIDを問合せ先に設定する
- 問合せ先区分は「オーナー宛問合せ」を設定
- 問合せは予約に紐づく形で作成する

## ティア完了条件（BDD）

```gherkin
Feature: オーナーへ問合せする - バックエンド

  Scenario: 予約に関してオーナーへ問合せを作成する
    Given 予約「R001」が存在し会議室オーナー「佐藤花子」（owner_id: O001）に紐づいている
    When POST /api/reservations/R001/inquiries に content="利用当日の入館方法を教えてください" をリクエストする
    Then ステータスコード201が返される
    And レスポンスの status が「未対応」である
    And レスポンスの target_type が「オーナー宛問合せ」である
    And レスポンスの target_id が「O001」である

  Scenario: 問合せ内容が空の場合エラーを返す
    When POST /api/reservations/R001/inquiries に content="" をリクエストする
    Then ステータスコード400が返される
    And エラーメッセージ「問合せ内容を入力してください」が返される

  Scenario: 存在しない予約IDの場合エラーを返す
    When POST /api/reservations/INVALID/inquiries に content="問合せ内容" をリクエストする
    Then ステータスコード404が返される
    And エラーメッセージ「予約が見つかりません」が返される
```
