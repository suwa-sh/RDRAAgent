# オーナーへ問合せを送信する - バックエンド仕様

## 変更概要

オーナー宛問合せ送信APIを新規作成する。利用者からの問合せ情報を「未対応」状態で作成する。

## API 仕様

### 問合せ送信API

- **メソッド**: POST
- **パス**: /api/rooms/{room_id}/inquiries
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
| target_type | string | 問合せ先区分（「オーナー宛問合せ」） |
| target_id | string | 問合せ先ID（オーナーID） |
| content | string | 問合せ内容 |
| status | string | 問合せ状態（「未対応」） |
| created_at | datetime | 問合せ日時 |

## データモデル変更

### 問合せ

| カラム | 型 | 説明 | 変更種別 |
|--------|---|------|---------|
| inquiry_id | VARCHAR | 問合せID | 追加 |
| user_id | VARCHAR | 利用者ID | 追加 |
| target_type | VARCHAR | 問合せ先区分（オーナー宛/サービス運営宛） | 追加 |
| target_id | VARCHAR | 問合せ先ID | 追加 |
| content | TEXT | 問合せ内容 | 追加 |
| reply_content | TEXT | 回答内容 | 追加 |
| status | VARCHAR | 問合せ状態（未対応/回答済み/対応済み） | 追加 |
| created_at | DATETIME | 問合せ日時 | 追加 |
| replied_at | DATETIME | 回答日時 | 追加 |

## ビジネスルール

- 問合せ内容は必須（空文字不可）
- 問合せ先区分は「オーナー宛問合せ」を設定
- 問合せ先IDは会議室のオーナーIDを設定
- 問合せ作成時の状態は「未対応」

## ティア完了条件（BDD）

```gherkin
Feature: オーナーへ問合せを送信する - バックエンド

  Scenario: オーナーへの問合せを作成する
    Given 会議室「新宿カンファレンスルームA」（room_id: R001）が存在しオーナー「佐藤花子」（owner_id: O001）が登録されている
    When POST /api/rooms/R001/inquiries に content="プロジェクターの使い方を教えてください" をリクエストする
    Then ステータスコード201が返される
    And レスポンスの status が「未対応」である
    And レスポンスの target_type が「オーナー宛問合せ」である

  Scenario: 問合せ内容が空の場合エラーを返す
    When POST /api/rooms/R001/inquiries に content="" をリクエストする
    Then ステータスコード400が返される
    And エラーメッセージ「問合せ内容を入力してください」が返される
```
