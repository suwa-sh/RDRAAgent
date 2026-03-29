# 会議室の詳細を確認する - バックエンド API 仕様

## 変更概要

会議室詳細取得 API を実装する。公開状態チェック・会議室情報・運用ルール・キャンセルポリシー・評価一覧を結合して返す。

## API 仕様

### 会議室詳細取得 API

- **メソッド**: GET
- **パス**: `/api/v1/rooms/{room_id}`
- **認証**: 任意
- **OpenAPI**: [openapi.yaml](../../_cross-cutting/api/openapi.yaml) の `paths./api/v1/rooms/{room_id}.get` を参照

#### リクエスト

| パラメータ | 型 | 必須 | 説明 |
|-----------|---|------|------|
| room_id | string (path) | Yes | 会議室ID |

#### レスポンス

| フィールド | 型 | 説明 |
|-----------|---|------|
| room_id | string | 会議室ID |
| name | string | 会議室名 |
| room_type | string | 会議室種別（physical/virtual） |
| area | string | 所在地（物理のみ） |
| size_sqm | number | 広さ m²（物理のみ） |
| capacity | number | 収容人数 |
| price_per_hour | number | 時間単価（円） |
| facilities | string[] | 設備・機能一覧 |
| images | string[] | 画像URL一覧（CDN URL） |
| tool_type | string | 会議ツール種別（バーチャルのみ） |
| max_connections | number | 同時接続数（バーチャルのみ） |
| is_recordable | boolean | 録画可否（バーチャルのみ） |
| operation_rule | OperationRule | 運用ルール |
| operation_rule.available_times | string | 利用可能時間帯（例: 09:00-22:00） |
| operation_rule.min_hours | number | 最低利用時間（時間） |
| operation_rule.max_hours | number | 最大利用時間（時間） |
| operation_rule.is_rentable | boolean | 貸出可否 |
| cancel_policy | CancelPolicy | キャンセルポリシー |
| cancel_policy.deadline_hours | number | キャンセル期限（利用時刻の何時間前まで） |
| cancel_policy.fee_rate | number | キャンセル料率（%） |
| avg_rating | number | 平均評価スコア |
| review_count | number | レビュー件数 |
| recent_reviews | Review[] | 最新10件のレビュー |
| owner_info | OwnerSummary | オーナー概要（氏名・認証状態） |

#### エラーレスポンス

| ステータスコード | 条件 | レスポンス |
|----------------|------|-----------|
| 404 | 会議室が存在しない、または公開状態が公開中でない | `{"error": "room not found"}` |
| 500 | DB エラー | `{"error": "internal server error"}` |

## データモデル変更

### 参照テーブル（変更なし）

| カラム | 型 | 説明 | 変更種別 |
|--------|---|------|---------|
| rooms.* | - | 会議室情報全項目 | 参照のみ |
| operation_rules.* | - | 運用ルール全項目 | 参照のみ |
| cancel_policies.* | - | キャンセルポリシー全項目 | 参照のみ |
| room_reviews.* | - | 評価・レビュー全項目 | 参照のみ |

## ビジネスルール

- 公開状態が「公開中（published）」の会議室のみ返す（それ以外は404）
- 評価は最新10件を返す（全件取得はレビュー専用 API で対応）
- 画像 URL は Object Storage の CDN URL を返す（署名付き URL は不要、公開URL）
- キャンセルポリシーが未設定の場合は `cancel_policy: null` を返す

## ティア完了条件（BDD）

```gherkin
Feature: 会議室の詳細を確認する - バックエンド API

  Scenario: 公開中の物理会議室の詳細を取得する
    Given 会議室ID「room-001」が公開中の物理会議室として登録されており、レビューが3件ある
    When GET /api/v1/rooms/room-001 を送信する
    Then HTTP 200 と、会議室情報・運用ルール・キャンセルポリシー・レビュー3件が返る

  Scenario: 非公開の会議室IDを指定すると404が返る
    Given 会議室ID「room-999」が非公開状態で登録されている
    When GET /api/v1/rooms/room-999 を送信する
    Then HTTP 404 と {"error": "room not found"} が返る
```
