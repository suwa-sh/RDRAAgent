# 予約を審査する - バックエンド仕様

## 変更概要

予約申請の一覧取得、利用者評価の参照、および許諾・拒否の判定処理を行うAPIを新規作成する。

## API 仕様

### 予約申請一覧取得API

- **メソッド**: GET
- **パス**: /api/owner/reservations/pending
- **認証**: 会議室オーナー認証

#### リクエスト

| パラメータ | 型 | 必須 | 説明 |
|-----------|---|------|------|
| room_id | string | No | 会議室IDで絞り込み |

#### レスポンス

| フィールド | 型 | 説明 |
|-----------|---|------|
| reservations | array | 申請状態の予約一覧 |
| reservations[].reservation_id | string | 予約ID |
| reservations[].user_name | string | 利用者名 |
| reservations[].room_name | string | 会議室名 |
| reservations[].start_datetime | string | 利用開始日時 |
| reservations[].end_datetime | string | 利用終了日時 |
| reservations[].user_rating_score | number | 利用者の評価スコア |

### 予約審査実行API

- **メソッド**: POST
- **パス**: /api/owner/reservations/{reservation_id}/review
- **認証**: 会議室オーナー認証

#### リクエスト

| パラメータ | 型 | 必須 | 説明 |
|-----------|---|------|------|
| reservation_id | string | Yes | 予約ID（パスパラメータ） |
| decision | string | Yes | "approve" または "reject" |
| reject_reason | string | No | 拒否理由（decision が "reject" の場合は必須） |

#### レスポンス

| フィールド | 型 | 説明 |
|-----------|---|------|
| reservation_id | string | 予約ID |
| status | string | 審査後の予約状態 |
| decision | string | 審査結果 |

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

### 利用者評価

| カラム | 型 | 説明 | 変更種別 |
|--------|---|------|---------|
| 評価ID | VARCHAR | 評価の一意識別子 | 追加 |
| オーナーID | VARCHAR | 評価したオーナーのID | 追加 |
| 利用者ID | VARCHAR | 評価対象の利用者ID | 追加 |
| 評価スコア | DECIMAL | 評価スコア | 追加 |
| コメント | TEXT | 評価コメント | 追加 |
| 評価日時 | DATETIME | 評価日時 | 追加 |

## ビジネスルール

- 使用許諾条件: オーナーが利用者の過去の利用評価を確認し、評価種別ごとの許諾基準に基づいて使用を許諾するかどうかを判定する
- 審査対象は予約状態が「申請」の予約のみ
- 拒否時は拒否理由の入力が必須
- 審査結果は利用者に通知される

## ティア完了条件（BDD）

```gherkin
Feature: 予約を審査する - バックエンド

  Scenario: 申請状態の予約一覧を取得する
    Given 会議室オーナー「山田花子」の認証トークンが有効
    And 「山田花子」の会議室に対する申請状態の予約が2件存在する
    When GET /api/owner/reservations/pending を実行する
    Then ステータスコード200が返却される
    And 予約が2件返却される

  Scenario: 予約を許諾する
    Given 予約ID「RSV-001」が申請状態である
    When POST /api/owner/reservations/RSV-001/review を decision="approve" で実行する
    Then ステータスコード200が返却される
    And 予約状態が「申請」のままオーナー許諾済みとなる

  Scenario: 予約を拒否する
    Given 予約ID「RSV-002」が申請状態である
    When POST /api/owner/reservations/RSV-002/review を decision="reject", reject_reason="評価スコアが基準未満" で実行する
    Then ステータスコード200が返却される
    And 予約が拒否状態となる

  Scenario: 拒否理由なしで拒否を試みる
    Given 予約ID「RSV-003」が申請状態である
    When POST /api/owner/reservations/RSV-003/review を decision="reject", reject_reason="" で実行する
    Then ステータスコード400が返却される
    And エラーメッセージ「拒否理由は必須です」が返却される
```
