# 予約を許諾する - バックエンド仕様

## 変更概要

予約の許諾処理を行い、予約状態を「申請」または「変更」から「確定」に遷移させるAPIを新規作成する。

## API 仕様

### 許諾待ち予約一覧取得API

- **メソッド**: GET
- **パス**: /api/owner/reservations/approvable
- **認証**: 会議室オーナー認証

#### リクエスト

| パラメータ | 型 | 必須 | 説明 |
|-----------|---|------|------|
| room_id | string | No | 会議室IDで絞り込み |

#### レスポンス

| フィールド | 型 | 説明 |
|-----------|---|------|
| reservations | array | 許諾待ち予約一覧 |
| reservations[].reservation_id | string | 予約ID |
| reservations[].user_name | string | 利用者名 |
| reservations[].room_name | string | 会議室名 |
| reservations[].start_datetime | string | 利用開始日時 |
| reservations[].end_datetime | string | 利用終了日時 |
| reservations[].status | string | 予約状態（申請/変更） |

### 予約許諾実行API

- **メソッド**: POST
- **パス**: /api/owner/reservations/{reservation_id}/approve
- **認証**: 会議室オーナー認証

#### リクエスト

| パラメータ | 型 | 必須 | 説明 |
|-----------|---|------|------|
| reservation_id | string | Yes | 予約ID（パスパラメータ） |

#### レスポンス

| フィールド | 型 | 説明 |
|-----------|---|------|
| reservation_id | string | 予約ID |
| status | string | 遷移後の予約状態（確定） |

## データモデル変更

### 予約情報

| カラム | 型 | 説明 | 変更種別 |
|--------|---|------|---------|
| 予約ID | VARCHAR | 予約の一意識別子 | 追加 |
| 利用者ID | VARCHAR | 予約した利用者のID | 追加 |
| 会議室ID | VARCHAR | 予約対象の会議室ID | 追加 |
| 予約日時 | DATETIME | 予約申請日時 | 追加 |
| 利用開始日時 | DATETIME | 利用開始予定日時 | 追加 |
| 利用終了日時 | DATETIME | 利用終了予定日時 | 追加 |
| 予約状態 | VARCHAR | 申請/確定/変更/取消 | 追加 |
| 決済方法 | VARCHAR | クレジットカード/電子マネー | 追加 |

## ビジネスルール

- 使用許諾条件: 予約状態が「申請」または「変更」の予約のみ許諾可能
- 許諾実行により予約状態が「確定」に遷移する
- 「取消」「確定」状態の予約は許諾できない
- 自身の会議室に対する予約のみ許諾可能

## ティア完了条件（BDD）

```gherkin
Feature: 予約を許諾する - バックエンド

  Scenario: 申請状態の予約を許諾する
    Given 予約ID「RSV-001」が「申請」状態である
    And 予約の対象会議室がオーナー「山田花子」の所有である
    When POST /api/owner/reservations/RSV-001/approve を実行する
    Then ステータスコード200が返却される
    And 予約状態が「確定」に更新される

  Scenario: 変更状態の予約を許諾する
    Given 予約ID「RSV-004」が「変更」状態である
    When POST /api/owner/reservations/RSV-004/approve を実行する
    Then ステータスコード200が返却される
    And 予約状態が「確定」に更新される

  Scenario: 取消済みの予約を許諾しようとする
    Given 予約ID「RSV-002」が「取消」状態である
    When POST /api/owner/reservations/RSV-002/approve を実行する
    Then ステータスコード409が返却される
    And エラーメッセージ「取消済みの予約は許諾できません」が返却される

  Scenario: 他オーナーの会議室の予約を許諾しようとする
    Given 予約ID「RSV-003」の対象会議室がオーナー「鈴木一郎」の所有である
    When オーナー「山田花子」が POST /api/owner/reservations/RSV-003/approve を実行する
    Then ステータスコード403が返却される
```
