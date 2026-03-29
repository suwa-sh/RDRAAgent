# 会議室情報を変更する - バックエンドAPI仕様

## 変更概要

会議室情報を更新するAPIエンドポイントを新規作成する。所有者チェックを行い、公開中の会議室情報更新時は検索インデックスも更新する。

## API 仕様

### 会議室情報更新

- **メソッド**: PUT
- **パス**: `/api/v1/rooms/{room_id}`
- **認証**: Bearer JWT（会議室オーナーロール）
- **OpenAPI**: [openapi.yaml](../../../_cross-cutting/api/openapi.yaml) の `paths./api/v1/rooms/{room_id}.put` を参照

#### リクエスト

| パラメータ | 型 | 必須 | 説明 |
|-----------|---|------|------|
| room_id | string (path) | Yes | 対象会議室ID（UUID） |
| name | string (body) | No | 会議室名 |
| price_per_hour | integer (body) | No | 1時間あたり料金 |
| location | string (body) | No | 所在地（物理のみ） |
| area_sqm | number (body) | No | 広さ（㎡）（物理のみ） |
| capacity | integer (body) | No | 収容人数（物理のみ） |
| amenities | array (body) | No | 設備・機能リスト |
| meeting_tool_type | string (body) | No | 会議ツール種別（バーチャルのみ） |
| max_connections | integer (body) | No | 同時接続数（バーチャルのみ） |
| recording_available | boolean (body) | No | 録画可否（バーチャルのみ） |

#### レスポンス

| フィールド | 型 | 説明 |
|-----------|---|------|
| room_id | string | 会議室ID |
| name | string | 更新後の会議室名 |
| status | string | 公開状態（変化なし） |
| updated_at | string | 更新日時 |

#### エラーレスポンス

| ステータスコード | 条件 | レスポンス |
|----------------|------|-----------|
| 400 | バリデーションエラー | `{"error": "validation_error"}` |
| 403 | 対象会議室の所有者以外からのリクエスト | `{"error": "forbidden"}` |
| 404 | 指定room_idが存在しない | `{"error": "room_not_found"}` |

## データモデル変更

なし（既存 rooms テーブルのカラムを更新）

## ビジネスルール

- 変更は所有者のみ可能（ReBAC: owner→room 所有権チェック）
- 変更されたフィールドのみ更新する（部分更新）
- 公開中の会議室情報変更時は KVS の検索キャッシュを削除/更新する（NFR B.2.1.1）
- 会議室種別（room_type）は変更不可（変更する場合は削除→再登録）

## ティア完了条件（BDD）

```gherkin
Feature: 会議室情報を変更する - バックエンドAPI

  Scenario: 収容人数の変更が正常に反映される
    Given room_id="room-001"の物理会議室が存在し、オーナーJWTで認証済み
    When PUT /api/v1/rooms/room-001 に {"capacity": 15} を送信する
    Then HTTP 200 が返り、DBのrooms.capacityが15に更新される

  Scenario: 他者の会議室変更で403エラーが返る
    Given room_id="room-999"は別オーナーの会議室で、オーナー「田中一郎」がJWTで認証済み
    When PUT /api/v1/rooms/room-999 に変更情報を送信する
    Then HTTP 403 が返り、{"error": "forbidden"} が含まれる
```
