# 会議URLを通知する - バックエンド API 仕様

## 変更概要

会議URL通知状況確認 API を追加する。予約審査での許諾時（予約を審査するUCで実装済み）にMQへのイベント発行を行い、本UCではFaaSワーカーが処理するための補助エンドポイントを提供する。

## API 仕様

### 会議URL情報取得（利用者向け参照）

- **メソッド**: GET
- **パス**: `/api/v1/reservations/{reservationId}/meeting-url`
- **認証**: Bearer Token (OAuth2/OIDC)
- **OpenAPI**: [openapi.yaml](../../_cross-cutting/api/openapi.yaml) の `paths./api/v1/reservations/{reservationId}/meeting-url.get` を参照

#### リクエスト

| パラメータ | 型 | 必須 | 説明 |
|-----------|---|------|------|
| reservationId (path) | string | Yes | 予約ID |

#### レスポンス

| フィールド | 型 | 説明 |
|-----------|---|------|
| reservationId | string | 予約ID |
| meetingUrl | string | 会議URL（未設定の場合はnull） |
| toolType | string | 会議ツール種別（Zoom/Teams/Google Meet） |
| notificationStatus | string | 通知状態（"notified" / "pending" / "failed"） |
| notifiedAt | string | 通知日時（ISO 8601, 未通知の場合はnull） |

#### エラーレスポンス

| ステータスコード | 条件 | レスポンス |
|----------------|------|-----------|
| 403 | 予約と利用者の認可チェック失敗 | `{ "error": "forbidden" }` |
| 404 | 予約IDが存在しない | `{ "error": "reservation not found" }` |

## 非同期イベント（該当する場合）

### 会議URL通知イベント（発行元: 予約を審査するUCのAPI）

- **チャネル**: `meeting-url-notification`
- **方向**: publish（予約許諾時に予約審査APIから発行）
- **AsyncAPI**: [asyncapi.yaml](../../_cross-cutting/api/asyncapi.yaml) の `channels.meeting-url-notification` を参照

## データモデル変更

### 会議URL通知履歴 (meeting_url_notifications)

| カラム | 型 | 説明 | 変更種別 |
|--------|---|------|---------|
| notification_id | VARCHAR(36) | 通知ID (UUID) | 追加 |
| reservation_id | VARCHAR(36) | 予約ID | 追加 |
| meeting_url | VARCHAR(500) | 通知した会議URL | 追加 |
| notification_status | VARCHAR(20) | 通知状態（notified/pending/failed） | 追加 |
| notified_at | TIMESTAMP | 通知日時 | 追加 |

## ビジネスルール

- 会議URL通知はバーチャル会議室の予約確定時のみ実行（物理会議室は対象外）
- FaaSワーカーによる通知完了後に notification_status を "notified" に更新する
- 通知失敗時は "failed" を記録し、DLQに退避されたメッセージから再試行可能とする
- 通知確認APIは利用者が予約の所有者であることをReBAC認可で確認してから返す

## ティア完了条件（BDD）

```gherkin
Feature: 会議URLを通知する - バックエンド API

  Scenario: 利用者「田中太郎」がバーチャル会議室の予約R-002の会議URL情報を取得する
    Given 利用者「田中太郎」（user-001）がBearerトークンを保持し、予約R-002（バーチャル会議室、通知状態: notified）が存在する
    When GET /api/v1/reservations/R-002/meeting-url をリクエストする
    Then 200 OK で { meetingUrl: "https://zoom.us/j/123456789", toolType: "Zoom", notificationStatus: "notified", notifiedAt: "2026-03-29T10:05:00Z" } が返される

  Scenario: 会議URL未設定の予約に対して取得すると通知状態がpendingで返される
    Given 予約R-003のバーチャル会議室に会議URLが未設定である
    When GET /api/v1/reservations/R-003/meeting-url をリクエストする
    Then 200 OK で { meetingUrl: null, notificationStatus: "pending" } が返される
```
