# 運用ルールを設定する - バックエンド仕様

## 変更概要

会議室の運用ルールを作成・更新するAPIエンドポイントを新規作成する。所有者チェックと入力値のバリデーションを行う。

## API 仕様

### 運用ルール設定API

- **メソッド**: PUT
- **パス**: /api/rooms/:room_id/operation-rules
- **認証**: 会議室オーナー認証必須（所有者のみ）

#### リクエスト

| パラメータ | 型 | 必須 | 説明 |
|-----------|---|------|------|
| available_hours_start | string | Yes | 利用可能開始時刻（HH:MM形式） |
| available_hours_end | string | Yes | 利用可能終了時刻（HH:MM形式） |
| min_usage_hours | number | Yes | 最低利用時間（時間単位） |
| max_usage_hours | number | Yes | 最大利用時間（時間単位） |
| rental_available | boolean | Yes | 貸出可否 |

#### レスポンス

| フィールド | 型 | 説明 |
|-----------|---|------|
| rule_id | string | ルールID |
| room_id | string | 会議室ID |
| available_hours_start | string | 利用可能開始時刻 |
| available_hours_end | string | 利用可能終了時刻 |
| min_usage_hours | number | 最低利用時間 |
| max_usage_hours | number | 最大利用時間 |
| rental_available | boolean | 貸出可否 |
| updated_at | string | 更新日時 |

## データモデル変更

### 運用ルール

| カラム | 型 | 説明 | 変更種別 |
|--------|---|------|---------|
| rule_id | VARCHAR | ルールID（PK） | 追加 |
| room_id | VARCHAR | 会議室ID（FK、UNIQUE） | 追加 |
| available_hours_start | TIME | 利用可能開始時刻 | 追加 |
| available_hours_end | TIME | 利用可能終了時刻 | 追加 |
| min_usage_hours | DECIMAL | 最低利用時間 | 追加 |
| max_usage_hours | DECIMAL | 最大利用時間 | 追加 |
| rental_available | BOOLEAN | 貸出可否 | 追加 |
| created_at | TIMESTAMP | 作成日時 | 追加 |
| updated_at | TIMESTAMP | 更新日時 | 追加 |

## ビジネスルール

- 会議室の所有者のみ運用ルールを設定可能
- 利用可能時間帯は有効な時刻（00:00-23:59）であること
- 開始時刻は終了時刻より前であること
- 最低利用時間は1時間以上であること
- 最大利用時間は最低利用時間以上であること
- 1つの会議室に対して運用ルールは1件（既存がある場合は上書き更新）

## ティア完了条件（BDD）

```gherkin
Feature: 運用ルールを設定する - バックエンド

  Scenario: 運用ルールを新規設定する
    Given 会議室オーナー「山田太郎」の認証トークンがある
    And 会議室「room-001」に運用ルールが未設定
    When PUT /api/rooms/room-001/operation-rules に利用可能時間帯「09:00-21:00」、最低利用時間「1」、最大利用時間「8」、貸出可否「true」を送信する
    Then ステータスコード200が返される
    And レスポンスの available_hours_start が「09:00」である

  Scenario: 最低利用時間が最大利用時間を超える場合
    Given 会議室オーナー「山田太郎」の認証トークンがある
    When PUT /api/rooms/room-001/operation-rules に最低利用時間「10」、最大利用時間「8」を送信する
    Then ステータスコード422が返される
    And エラーメッセージに「最低利用時間は最大利用時間以下にしてください」が含まれる

  Scenario: 他のオーナーの会議室に運用ルールを設定しようとした場合
    Given 会議室オーナー「山田太郎」の認証トークンがある
    And 会議室「room-002」はオーナー「佐藤花子」の所有
    When PUT /api/rooms/room-002/operation-rules にリクエストを送信する
    Then ステータスコード403が返される
```
