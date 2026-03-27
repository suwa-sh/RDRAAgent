# 会議URLを通知する - バックエンド仕様

## 変更概要

バーチャル会議室の予約確定時に会議URLを自動通知する機能を追加する。予約許諾API内で会議室種別を判定し、バーチャル会議室の場合に通知処理を実行する。また、会議URL取得APIを新規作成する。

## API 仕様

### 会議URL取得API

- **メソッド**: GET
- **パス**: /api/reservations/{reservation_id}/meeting-url
- **認証**: Bearer トークン（利用者・予約者本人のみ）

#### リクエスト

| パラメータ | 型 | 必須 | 説明 |
|-----------|---|------|------|
| reservation_id | string | Yes | 予約ID（パスパラメータ） |

#### レスポンス

| フィールド | 型 | 説明 |
|-----------|---|------|
| meeting_url_id | string | 会議URL ID |
| room_name | string | 会議室名 |
| meeting_tool_type | string | 会議ツール種別 |
| meeting_url | string | 会議URL |
| expiry_date | date | 有効期限 |
| start_datetime | datetime | 利用開始日時 |
| end_datetime | datetime | 利用終了日時 |

### 予約許諾API（既存API変更）

- **パス**: /api/reservations/{reservation_id}/approve
- **変更内容**: バーチャル会議室の場合、予約確定時に会議URL通知処理を追加

## データモデル変更

なし（既存の会議URLテーブルと予約情報テーブルを使用）

## ビジネスルール

- 予約確定時に会議室種別が「バーチャル」の場合のみ会議URL通知を実行する（バーチャル会議室利用ポリシー）
- 通知先は予約者のメールアドレス
- 会議URLの有効期限が切れている場合は通知を行わず、エラーを記録する
- 会議URL取得APIは予約者本人のみアクセス可能
- 物理会議室の予約には会議URL通知は実行しない

## ティア完了条件（BDD）

```gherkin
Feature: 会議URLを通知する - バックエンド

  Scenario: バーチャル会議室の予約確定時に会議URLが通知される
    Given バーチャル会議室「VR001」に会議URL「https://zoom.us/j/1234567890」が登録されている
    And 利用者「田中太郎」の予約「RSV001」が「申請」状態である
    When POST /api/reservations/RSV001/approve をリクエストする
    Then ステータスコード200が返される
    And 利用者「田中太郎」のメールアドレスに会議URL通知メールが送信される

  Scenario: 会議URL情報を取得する
    Given 利用者「田中太郎」の認証トークンがある
    And 予約「RSV001」が「確定」状態のバーチャル会議室予約である
    When GET /api/reservations/RSV001/meeting-url をリクエストする
    Then ステータスコード200が返される
    And レスポンスの meeting_url が「https://zoom.us/j/1234567890」である
    And レスポンスの meeting_tool_type が「Zoom」である

  Scenario: 物理会議室の予約確定時には通知されない
    Given 物理会議室「RM001」の予約「RSV002」が「申請」状態である
    When POST /api/reservations/RSV002/approve をリクエストする
    Then ステータスコード200が返される
    And 会議URL通知メールは送信されない

  Scenario: 予約者以外が会議URLを取得しようとするとエラー
    Given 利用者「佐藤次郎」の認証トークンがある
    And 予約「RSV001」は利用者「田中太郎」の予約である
    When GET /api/reservations/RSV001/meeting-url をリクエストする
    Then ステータスコード403が返される
```
