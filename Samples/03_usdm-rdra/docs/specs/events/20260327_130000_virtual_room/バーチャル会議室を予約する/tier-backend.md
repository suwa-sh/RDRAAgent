# バーチャル会議室を予約する - バックエンド仕様

## 変更概要

バーチャル会議室予約APIを新規作成する。予約情報に会議室種別「バーチャル」を含めて登録し、予約状態を「申請」に設定する。

## API 仕様

### バーチャル会議室予約申請API

- **メソッド**: POST
- **パス**: /api/rooms/virtual/{room_id}/reservations
- **認証**: Bearer トークン（利用者）

#### リクエスト

| パラメータ | 型 | 必須 | 説明 |
|-----------|---|------|------|
| start_datetime | datetime | Yes | 利用開始日時 |
| end_datetime | datetime | Yes | 利用終了日時 |

#### レスポンス

| フィールド | 型 | 説明 |
|-----------|---|------|
| reservation_id | string | 予約ID |
| user_id | string | 利用者ID |
| room_id | string | 会議室ID |
| room_type | string | 会議室種別（バーチャル） |
| start_datetime | datetime | 利用開始日時 |
| end_datetime | datetime | 利用終了日時 |
| status | string | 予約状態（申請） |

## データモデル変更

### 予約情報

| カラム | 型 | 説明 | 変更種別 |
|--------|---|------|---------|
| room_type | VARCHAR | 会議室種別（物理/バーチャル） | 追加 |

## ビジネスルール

- 予約対象は公開状態が「公開中」のバーチャル会議室のみ
- 利用開始日時は現在日時より未来であること
- 利用終了日時は利用開始日時より後であること
- 同一バーチャル会議室の同一時間帯に重複する予約がないこと
- 予約登録時に会議室種別「バーチャル」を自動設定する
- 決済フローは物理会議室と共通

## ティア完了条件（BDD）

```gherkin
Feature: バーチャル会議室を予約する - バックエンド

  Scenario: バーチャル会議室の予約を正常に申請する
    Given 利用者「田中太郎」の認証トークンがある
    And 公開中のバーチャル会議室「オンライン会議室A」（room_id: VR001）が存在する
    When POST /api/rooms/virtual/VR001/reservations に以下をリクエストする
      | start_datetime | 2026-04-01T10:00:00 |
      | end_datetime   | 2026-04-01T12:00:00 |
    Then ステータスコード201が返される
    And レスポンスの status が「申請」である
    And レスポンスの room_type が「バーチャル」である

  Scenario: 過去の日時を指定した場合にエラーとなる
    Given 利用者「田中太郎」の認証トークンがある
    When POST /api/rooms/virtual/VR001/reservations に start_datetime「2025-01-01T10:00:00」でリクエストする
    Then ステータスコード400が返される
    And エラーメッセージに「利用開始日時は未来の日時を指定してください」が含まれる

  Scenario: 予約時間帯が重複する場合にエラーとなる
    Given バーチャル会議室「VR001」に「2026-04-01 10:00〜12:00」の予約が存在する
    When POST /api/rooms/virtual/VR001/reservations に start_datetime「2026-04-01T11:00:00」、end_datetime「2026-04-01T13:00:00」でリクエストする
    Then ステータスコード409が返される
    And エラーメッセージに「指定された時間帯は既に予約されています」が含まれる

  Scenario: 非公開のバーチャル会議室には予約できない
    Given 非公開状態のバーチャル会議室「VR002」が存在する
    When POST /api/rooms/virtual/VR002/reservations をリクエストする
    Then ステータスコード404が返される
```
