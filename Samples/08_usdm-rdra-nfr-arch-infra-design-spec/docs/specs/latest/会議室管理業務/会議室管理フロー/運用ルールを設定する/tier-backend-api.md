# 運用ルールを設定する - バックエンドAPI仕様

## 変更概要

会議室の運用ルールを新規設定または更新するAPIエンドポイントを新規作成する。設定完了後にキャンセルポリシーの設定状況を確認し、条件充足時は会議室状態を「公開可能」に更新する。

## API 仕様

### 運用ルール設定

- **メソッド**: PUT
- **パス**: `/api/v1/rooms/{room_id}/operation-rules`
- **認証**: Bearer JWT（会議室オーナーロール）
- **OpenAPI**: [openapi.yaml](../../../_cross-cutting/api/openapi.yaml) の `paths./api/v1/rooms/{room_id}/operation-rules.put` を参照

#### リクエスト

| パラメータ | 型 | 必須 | 説明 |
|-----------|---|------|------|
| room_id | string (path) | Yes | 対象会議室ID（UUID） |
| available_from | string (body) | Yes | 利用開始時刻（HH:MM形式、例: "09:00"） |
| available_to | string (body) | Yes | 利用終了時刻（HH:MM形式、例: "21:00"） |
| min_hours | integer (body) | Yes | 最低利用時間（時間単位） |
| max_hours | integer (body) | Yes | 最大利用時間（時間単位） |
| is_rentable | boolean (body) | Yes | 貸出可否 |

#### レスポンス

| フィールド | 型 | 説明 |
|-----------|---|------|
| rule_id | string | 運用ルールID |
| room_id | string | 対象会議室ID |
| room_status | string | 更新後の会議室状態（"非公開" または "公開可能"） |

#### エラーレスポンス

| ステータスコード | 条件 | レスポンス |
|----------------|------|-----------|
| 400 | バリデーションエラー（min_hours > max_hours等） | `{"error": "validation_error", "fields": {...}}` |
| 403 | 対象会議室の所有者以外からのリクエスト | `{"error": "forbidden"}` |
| 404 | 指定room_idが存在しない | `{"error": "room_not_found"}` |

## データモデル変更

### operation_rules（新規テーブル）

| カラム | 型 | 説明 | 変更種別 |
|--------|---|------|---------|
| rule_id | UUID | 運用ルールID（PK） | 追加 |
| room_id | UUID | 会議室ID（FK: rooms, UNIQUE） | 追加 |
| available_from | TIME | 利用開始時刻 | 追加 |
| available_to | TIME | 利用終了時刻 | 追加 |
| min_hours | INTEGER | 最低利用時間 | 追加 |
| max_hours | INTEGER | 最大利用時間 | 追加 |
| is_rentable | BOOLEAN | 貸出可否 | 追加 |
| created_at | TIMESTAMP | 作成日時 | 追加 |
| updated_at | TIMESTAMP | 更新日時 | 追加 |

## ビジネスルール

- 運用ルールは会議室ごとに1件（UPSERT）
- 最低利用時間 ≤ 最大利用時間 の整合性チェック（会議室公開条件の一部）
- 運用ルール設定後にキャンセルポリシー（cancel_policies）の設定状況を確認し、両方設定済みの場合は rooms.status を「公開可能」に更新する
- 設定変更は所有者のみ可能（ReBAC: owner→room 所有権チェック）

## ティア完了条件（BDD）

```gherkin
Feature: 運用ルールを設定する - バックエンドAPI

  Scenario: 運用ルール設定が正常に保存される
    Given room_id="room-001"の会議室（オーナー: abc-123）が存在し、JWTで認証済み
    When PUT /api/v1/rooms/room-001/operation-rules に {available_from:"09:00", available_to:"21:00", min_hours:2, max_hours:8, is_rentable:true} を送信する
    Then HTTP 200 が返り、rule_idが含まれ、DBにoperation_rulesレコードが作成される

  Scenario: 運用ルールとキャンセルポリシーが両方設定済みで公開可能になる
    Given room_id="room-001"のキャンセルポリシーが設定済みで、運用ルールが未設定
    When PUT /api/v1/rooms/room-001/operation-rules に有効なパラメータを送信する
    Then レスポンスのroom_statusが"公開可能"になり、DBのrooms.statusも"公開可能"に更新される

  Scenario: min_hours > max_hoursで400エラーが返る
    Given room_id="room-001"の会議室が存在する
    When PUT /api/v1/rooms/room-001/operation-rules に {min_hours: 8, max_hours: 2, ...} を送信する
    Then HTTP 400 が返り、{"error": "validation_error"} が含まれる
```
