# バーチャル会議室を登録する - バックエンドAPI仕様

## 変更概要

バーチャル会議室登録を受け付けるAPIエンドポイントを新規作成する。バーチャル専用の必須項目バリデーション、会議URLの登録、会議室と会議URLの関連付けをトランザクション内で行う。

## API 仕様

### バーチャル会議室登録

- **メソッド**: POST
- **パス**: `/api/v1/rooms/virtual`
- **認証**: Bearer JWT（会議室オーナーロール）
- **OpenAPI**: [openapi.yaml](../../../_cross-cutting/api/openapi.yaml) の `paths./api/v1/rooms/virtual.post` を参照

#### リクエスト

| パラメータ | 型 | 必須 | 説明 |
|-----------|---|------|------|
| name | string | Yes | 会議室名（最大100文字） |
| meeting_tool_type | string | Yes | 会議ツール種別（"zoom"\|"teams"\|"google_meet"） |
| max_connections | integer | Yes | 同時接続数（1〜999） |
| recording_available | boolean | Yes | 録画可否 |
| price_per_hour | integer | Yes | 1時間あたり料金（円） |
| meeting_url | string | Yes | 会議URL（https://で始まるURL形式） |
| meeting_url_expires_at | string | No | 会議URL有効期限（ISO 8601形式）。省略時は無期限 |

#### レスポンス

| フィールド | 型 | 説明 |
|-----------|---|------|
| room_id | string | 採番された会議室ID（UUID） |
| meeting_url_id | string | 採番された会議URL ID |
| status | string | 公開状態（固定値: "非公開"） |
| created_at | string | 作成日時（ISO 8601形式） |

#### エラーレスポンス

| ステータスコード | 条件 | レスポンス |
|----------------|------|-----------|
| 400 | 必須項目欠落またはURL形式不正 | `{"error": "validation_error", "fields": {...}}` |
| 401 | 未認証 | `{"error": "unauthorized"}` |
| 422 | 退会済みオーナーからの登録試み | `{"error": "owner_not_active"}` |

## データモデル変更

### rooms（既存テーブルへのレコード追加）

room_type = "virtual" として既存テーブルを使用。物理会議室用フィールド（location, area_sqm, capacity）はNULL。

### meeting_urls（新規テーブル）

| カラム | 型 | 説明 | 変更種別 |
|--------|---|------|---------|
| meeting_url_id | UUID | 会議URL ID（PK） | 追加 |
| room_id | UUID | 会議室ID（FK: rooms） | 追加 |
| meeting_tool_type | VARCHAR(20) | 会議ツール種別（zoom/teams/google_meet） | 追加 |
| meeting_url | TEXT | 会議URL | 追加 |
| expires_at | TIMESTAMP | 有効期限（NULL許可、NULL=無期限） | 追加 |
| created_at | TIMESTAMP | 作成日時 | 追加 |
| updated_at | TIMESTAMP | 更新日時 | 追加 |

## ビジネスルール

- バーチャル会議室の登録は rooms テーブルの room_type="virtual" で管理する（会議室種別別登録条件）
- 会議URLは meeting_urls テーブルに別途保存し、rooms テーブルと関連付ける
- 会議室登録と会議URL登録はトランザクション内で行う（どちらかが失敗した場合は両方ロールバック）
- 登録直後は rooms.status = "非公開" で作成される（状態モデル: 会議室）
- 作成時に ReBAC サービスに `owner:{owner_id} → room:{room_id}` の関係性タプルを登録する
- 会議URLは https:// で始まるURL形式であること（URLバリデーション）

## ティア完了条件（BDD）

```gherkin
Feature: バーチャル会議室を登録する - バックエンドAPI

  Scenario: Zoom会議室の正常登録で201が返る
    Given 登録済みオーナーがJWTを持っている
    When POST /api/v1/rooms/virtual に {name:"オンライン会議室A", meeting_tool_type:"zoom", max_connections:10, recording_available:true, price_per_hour:800, meeting_url:"https://zoom.us/j/abc123456"} を送信する
    Then HTTP 201 が返り、room_idとmeeting_url_idとstatus:"非公開"が含まれ、roomsとmeeting_urlsに各レコードが作成される

  Scenario: 無効なURL形式で400エラーが返る
    Given 登録済みオーナーがJWTを持っている
    When POST /api/v1/rooms/virtual に {meeting_url: "not-a-valid-url", ...} を送信する
    Then HTTP 400 が返り、{"error": "validation_error", "fields": {"meeting_url": "invalid_url_format"}} が含まれる

  Scenario: meeting_tool_type未指定で400エラーが返る
    Given 登録済みオーナーがJWTを持っている
    When POST /api/v1/rooms/virtual に meeting_tool_type を含まないリクエストを送信する
    Then HTTP 400 が返り、{"error": "validation_error", "fields": {"meeting_tool_type": "required"}} が含まれる
```
