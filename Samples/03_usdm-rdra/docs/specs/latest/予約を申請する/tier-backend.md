# 予約を申請する - バックエンド仕様

## 変更概要

予約申請APIを新規作成する。利用者が指定した日時で予約情報を「申請」状態で作成し、日時の重複チェックや利用可能時間帯の検証を行う。

## API 仕様

### 予約申請API

- **メソッド**: POST
- **パス**: /api/reservations
- **認証**: Bearer トークン（利用者）

#### リクエスト

| パラメータ | 型 | 必須 | 説明 |
|-----------|---|------|------|
| room_id | string | Yes | 会議室ID |
| start_datetime | datetime | Yes | 利用開始日時 |
| end_datetime | datetime | Yes | 利用終了日時 |

#### レスポンス

| フィールド | 型 | 説明 |
|-----------|---|------|
| reservation_id | string | 予約ID |
| user_id | string | 利用者ID |
| room_id | string | 会議室ID |
| start_datetime | datetime | 利用開始日時 |
| end_datetime | datetime | 利用終了日時 |
| status | string | 予約状態（「申請」） |
| estimated_price | number | 利用料金見積 |
| created_at | datetime | 予約申請日時 |

## データモデル変更

### 予約情報

| カラム | 型 | 説明 | 変更種別 |
|--------|---|------|---------|
| reservation_id | VARCHAR | 予約ID | 追加 |
| user_id | VARCHAR | 利用者ID | 追加 |
| room_id | VARCHAR | 会議室ID | 追加 |
| start_datetime | DATETIME | 利用開始日時 | 追加 |
| end_datetime | DATETIME | 利用終了日時 | 追加 |
| status | VARCHAR | 予約状態（申請/確定/変更/取消） | 追加 |
| payment_method | VARCHAR | 決済方法 | 追加 |
| created_at | DATETIME | 予約申請日時 | 追加 |

## ビジネスルール

- 利用開始日時は現在日時より未来でなければならない
- 利用時間は会議室の運用ルール（利用可能時間帯、最低利用時間、最大利用時間）に従う
- 同一会議室の同一時間帯に確定済みまたは申請中の予約が存在する場合は申請不可
- 予約作成時の状態は「申請」とする
- 会議室の公開状態が「公開中」でなければ予約申請不可

## ティア完了条件（BDD）

```gherkin
Feature: 予約を申請する - バックエンド

  Scenario: 正常に予約を申請する
    Given 公開中の会議室「新宿カンファレンスルームA」（room_id: R001）が存在する
    And 「2026-04-10 10:00〜12:00」に予約が入っていない
    When POST /api/reservations に room_id="R001", start_datetime="2026-04-10T10:00:00", end_datetime="2026-04-10T12:00:00" をリクエストする
    Then ステータスコード201が返される
    And レスポンスの status が「申請」である

  Scenario: 日時が重複する場合エラーを返す
    Given 会議室「新宿カンファレンスルームA」（room_id: R001）に「2026-04-10 10:00〜12:00」の確定済み予約が存在する
    When POST /api/reservations に room_id="R001", start_datetime="2026-04-10T11:00:00", end_datetime="2026-04-10T13:00:00" をリクエストする
    Then ステータスコード409が返される
    And エラーメッセージ「指定日時は既に予約されています」が返される

  Scenario: 過去の日時で申請した場合エラーを返す
    When POST /api/reservations に room_id="R001", start_datetime="2025-01-01T10:00:00", end_datetime="2025-01-01T12:00:00" をリクエストする
    Then ステータスコード400が返される
    And エラーメッセージ「過去の日時は指定できません」が返される
```
