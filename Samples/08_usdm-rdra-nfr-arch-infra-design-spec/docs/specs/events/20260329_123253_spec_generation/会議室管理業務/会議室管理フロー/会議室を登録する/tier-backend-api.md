# 会議室を登録する - バックエンドAPI仕様

## 変更概要

会議室登録を受け付けるAPIエンドポイントを新規作成する。会議室種別に応じた入力バリデーション、初期状態「非公開」での作成、オーナーとの関連付けを行う。

## API 仕様

### 会議室登録

- **メソッド**: POST
- **パス**: `/api/v1/rooms`
- **認証**: Bearer JWT（会議室オーナーロール）
- **OpenAPI**: [openapi.yaml](../../../_cross-cutting/api/openapi.yaml) の `paths./api/v1/rooms.post` を参照

#### リクエスト

| パラメータ | 型 | 必須 | 説明 |
|-----------|---|------|------|
| name | string | Yes | 会議室名（最大100文字） |
| room_type | string | Yes | 会議室種別（"physical" または "virtual"） |
| price_per_hour | integer | Yes | 1時間あたり料金（円） |
| location | string | Cond | 所在地（room_type=physical の場合必須） |
| area_sqm | number | No | 広さ（㎡）（room_type=physical の場合） |
| capacity | integer | Cond | 収容人数（room_type=physical の場合必須） |
| amenities | array | No | 設備・機能リスト（例: ["projector", "whiteboard"]） |
| meeting_tool_type | string | Cond | 会議ツール種別（room_type=virtual の場合必須）（"zoom"\|"teams"\|"google_meet"） |
| max_connections | integer | Cond | 同時接続数（room_type=virtual の場合必須） |
| recording_available | boolean | Cond | 録画可否（room_type=virtual の場合必須） |

#### レスポンス

| フィールド | 型 | 説明 |
|-----------|---|------|
| room_id | string | 採番された会議室ID（UUID） |
| status | string | 公開状態（固定値: "非公開"） |
| created_at | string | 作成日時（ISO 8601形式） |

#### エラーレスポンス

| ステータスコード | 条件 | レスポンス |
|----------------|------|-----------|
| 400 | 必須項目欠落または種別別条件違反 | `{"error": "validation_error", "fields": {...}}` |
| 401 | 未認証 | `{"error": "unauthorized"}` |
| 422 | 退会済みオーナーからの登録試み | `{"error": "owner_not_active"}` |

## データモデル変更

### rooms（新規テーブル）

| カラム | 型 | 説明 | 変更種別 |
|--------|---|------|---------|
| room_id | UUID | 会議室ID（PK） | 追加 |
| owner_id | UUID | オーナーID（FK: owners） | 追加 |
| name | VARCHAR(100) | 会議室名 | 追加 |
| room_type | VARCHAR(20) | 会議室種別（physical/virtual） | 追加 |
| status | VARCHAR(20) | 公開状態（非公開/公開可能/公開中） | 追加 |
| price_per_hour | INTEGER | 1時間料金（円） | 追加 |
| location | VARCHAR(255) | 所在地（物理のみ） | 追加 |
| area_sqm | DECIMAL | 広さ（㎡）（物理のみ、NULL許可） | 追加 |
| capacity | INTEGER | 収容人数（物理のみ） | 追加 |
| amenities | JSONB | 設備・機能リスト | 追加 |
| meeting_tool_type | VARCHAR(20) | 会議ツール種別（バーチャルのみ） | 追加 |
| max_connections | INTEGER | 同時接続数（バーチャルのみ） | 追加 |
| recording_available | BOOLEAN | 録画可否（バーチャルのみ） | 追加 |
| created_at | TIMESTAMP | 作成日時 | 追加 |
| updated_at | TIMESTAMP | 更新日時 | 追加 |

## ビジネスルール

- 会議室は登録直後に「非公開」状態で作成される（状態モデル: 会議室）
- 会議室種別別登録条件に従い、物理/バーチャルで必須項目が異なる
- 作成時に ReBAC サービスに `owner:{owner_id} → room:{room_id}` の関係性タプルを登録する
- 「登録済み」状態のオーナーのみが会議室を登録可能

## ティア完了条件（BDD）

```gherkin
Feature: 会議室を登録する - バックエンドAPI

  Scenario: 物理会議室の正常登録で201が返る
    Given 登録済みオーナーがJWTを持っている
    When POST /api/v1/rooms に物理会議室情報（name:"渋谷会議室A", room_type:"physical", price_per_hour:1000, location:"東京都渋谷区神南1-1-1", capacity:10）を送信する
    Then HTTP 201 が返り、room_idとstatus:"非公開"が含まれ、DBにroomsレコードが作成される

  Scenario: バーチャル会議室でmeeting_tool_type欠落時に400エラーが返る
    Given 登録済みオーナーがJWTを持っている
    When POST /api/v1/rooms に {"room_type": "virtual", "name": "テスト", "max_connections": 5} を送信する（meeting_tool_type欠落）
    Then HTTP 400 が返り、{"error": "validation_error", "fields": {"meeting_tool_type": "required"}} が含まれる
```
