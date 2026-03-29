# 会議室の公開状態を変更する - バックエンドAPI仕様

## 変更概要

会議室の公開状態を変更するAPIエンドポイントを新規作成する。状態遷移ルール（会議室公開条件）に基づいた遷移ガードを実装する。

## API 仕様

### 会議室公開状態変更

- **メソッド**: PUT
- **パス**: `/api/v1/rooms/{room_id}/status`
- **認証**: Bearer JWT（会議室オーナーロール）
- **OpenAPI**: [openapi.yaml](../../../_cross-cutting/api/openapi.yaml) の `paths./api/v1/rooms/{room_id}/status.put` を参照

#### リクエスト

| パラメータ | 型 | 必須 | 説明 |
|-----------|---|------|------|
| room_id | string (path) | Yes | 対象会議室ID（UUID） |
| status | string (body) | Yes | 目標の公開状態（"公開中" または "非公開"） |

#### レスポンス

| フィールド | 型 | 説明 |
|-----------|---|------|
| room_id | string | 会議室ID |
| status | string | 更新後の公開状態 |
| updated_at | string | 更新日時（ISO 8601形式） |

#### エラーレスポンス

| ステータスコード | 条件 | レスポンス |
|----------------|------|-----------|
| 400 | status の値が不正 | `{"error": "invalid_status_value"}` |
| 403 | 対象会議室の所有者以外からのリクエスト | `{"error": "forbidden"}` |
| 404 | 指定room_idが存在しない | `{"error": "room_not_found"}` |
| 422 | 遷移不可能な状態変更（非公開→公開中、公開条件未達等） | `{"error": "publish_condition_not_met", "missing": ["operation_rules", "cancel_policy"]}` |

## データモデル変更

なし（既存 rooms.status カラムを更新）

## ビジネスルール

- 状態遷移ルール（会議室公開条件）:
  - 「非公開」→「公開可能」: 運用ルールとキャンセルポリシーが両方設定済みの場合に自動遷移（手動操作不可）
  - 「公開可能」→「公開中」: オーナーの操作で遷移可能（手動）
  - 「公開中」→「非公開」: オーナーの操作で遷移可能（手動）
  - 「公開可能」→「非公開」: オーナーの操作で遷移可能（手動）
  - 「非公開」→「公開中」: 不可（422エラー）
- 公開中状態への変更時は KVS の検索インデックスを更新する（NFR B.2.1.1 検索性能確保）
- 非公開への変更時は KVS の検索インデックスから削除する

## ティア完了条件（BDD）

```gherkin
Feature: 会議室の公開状態を変更する - バックエンドAPI

  Scenario: 公開可能状態から公開中への変更が成功する
    Given room_id="room-001"の会議室が「公開可能」状態で、オーナーJWTで認証済み
    When PUT /api/v1/rooms/room-001/status に {"status": "公開中"} を送信する
    Then HTTP 200 が返り、{"status": "公開中"} が含まれ、DBのroomsのstatusが「公開中」になる

  Scenario: 非公開から公開中への直接変更で422エラーが返る
    Given room_id="room-002"の会議室が「非公開」状態（運用ルール未設定）
    When PUT /api/v1/rooms/room-002/status に {"status": "公開中"} を送信する
    Then HTTP 422 が返り、{"error": "publish_condition_not_met"} が含まれる

  Scenario: 公開中から非公開への変更が成功する
    Given room_id="room-001"の会議室が「公開中」状態
    When PUT /api/v1/rooms/room-001/status に {"status": "非公開"} を送信する
    Then HTTP 200 が返り、{"status": "非公開"} が含まれる
```
