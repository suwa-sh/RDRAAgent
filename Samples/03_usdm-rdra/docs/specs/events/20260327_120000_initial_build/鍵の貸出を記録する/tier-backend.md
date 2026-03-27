# 鍵の貸出を記録する - バックエンド仕様

## 変更概要

鍵の貸出記録を行い、鍵の状態を「保管中」から「貸出中」に、会議室利用を「利用開始」状態に遷移させるAPIを新規作成する。

## API 仕様

### 貸出可能予約一覧取得API

- **メソッド**: GET
- **パス**: /api/owner/keys/lendable
- **認証**: 会議室オーナー認証

#### リクエスト

| パラメータ | 型 | 必須 | 説明 |
|-----------|---|------|------|
| date | string | No | 対象日（デフォルト: 当日） |

#### レスポンス

| フィールド | 型 | 説明 |
|-----------|---|------|
| reservations | array | 貸出可能な予約一覧 |
| reservations[].reservation_id | string | 予約ID |
| reservations[].user_name | string | 利用者名 |
| reservations[].room_name | string | 会議室名 |
| reservations[].key_id | string | 鍵ID |
| reservations[].key_status | string | 鍵の現在の状態 |
| reservations[].start_datetime | string | 利用開始日時 |
| reservations[].end_datetime | string | 利用終了日時 |

### 鍵貸出記録API

- **メソッド**: POST
- **パス**: /api/owner/keys/{key_id}/lend
- **認証**: 会議室オーナー認証

#### リクエスト

| パラメータ | 型 | 必須 | 説明 |
|-----------|---|------|------|
| key_id | string | Yes | 鍵ID（パスパラメータ） |
| reservation_id | string | Yes | 対象の予約ID |

#### レスポンス

| フィールド | 型 | 説明 |
|-----------|---|------|
| key_id | string | 鍵ID |
| key_status | string | 遷移後の鍵状態（貸出中） |
| usage_id | string | 作成された会議室利用ID |
| usage_status | string | 会議室利用の状態（利用開始） |
| lent_at | string | 貸出日時 |

## データモデル変更

### 鍵

| カラム | 型 | 説明 | 変更種別 |
|--------|---|------|---------|
| 鍵ID | VARCHAR | 鍵の一意識別子 | 追加 |
| 会議室ID | VARCHAR | 対象会議室のID | 追加 |
| 貸出状態 | VARCHAR | 保管中/貸出中 | 追加 |
| 貸出日時 | DATETIME | 貸出記録日時 | 追加 |
| 返却日時 | DATETIME | 返却記録日時 | 追加 |

### 会議室利用

| カラム | 型 | 説明 | 変更種別 |
|--------|---|------|---------|
| 利用ID | VARCHAR | 利用の一意識別子 | 追加 |
| 予約ID | VARCHAR | 対応する予約ID | 追加 |
| 会議室ID | VARCHAR | 利用する会議室ID | 追加 |
| 利用者ID | VARCHAR | 利用者のID | 追加 |
| 利用開始日時 | DATETIME | 利用開始日時 | 追加 |
| 利用終了日時 | DATETIME | 利用終了日時 | 追加 |
| 利用状態 | VARCHAR | 利用開始/利用中/利用終了 | 追加 |

## ビジネスルール

- 会議室利用ポリシー: 鍵の受け渡しをトリガーとして会議室利用の開始を定義する
- 鍵の状態が「保管中」の場合のみ貸出可能
- 対応する予約が「確定」状態の場合のみ貸出可能
- 貸出記録時に鍵の状態を「保管中」→「貸出中」に遷移
- 同時に会議室利用レコードを「利用開始」状態で作成

## ティア完了条件（BDD）

```gherkin
Feature: 鍵の貸出を記録する - バックエンド

  Scenario: 鍵を貸出し会議室利用を開始する
    Given 鍵ID「KEY-001」が「保管中」状態である
    And 予約ID「RSV-001」が「確定」状態である
    When POST /api/owner/keys/KEY-001/lend を reservation_id="RSV-001" で実行する
    Then ステータスコード200が返却される
    And 鍵状態が「貸出中」に更新される
    And 会議室利用が「利用開始」状態で作成される

  Scenario: 貸出中の鍵を再度貸出しようとする
    Given 鍵ID「KEY-001」が「貸出中」状態である
    When POST /api/owner/keys/KEY-001/lend を reservation_id="RSV-002" で実行する
    Then ステータスコード409が返却される
    And エラーメッセージ「この鍵は既に貸出中です」が返却される

  Scenario: 確定されていない予約で鍵を貸出しようとする
    Given 鍵ID「KEY-002」が「保管中」状態である
    And 予約ID「RSV-003」が「申請」状態である
    When POST /api/owner/keys/KEY-002/lend を reservation_id="RSV-003" で実行する
    Then ステータスコード400が返却される
    And エラーメッセージ「予約が確定されていません」が返却される
```
