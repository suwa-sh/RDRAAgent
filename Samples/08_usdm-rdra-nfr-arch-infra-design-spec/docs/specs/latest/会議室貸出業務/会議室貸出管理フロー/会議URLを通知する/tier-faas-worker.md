# 会議URLを通知する - FaaS ワーカー仕様

## 変更概要

MQの `meeting-url-notification` チャネルをトリガーに会議URLメール通知を実行するFaaSワーカーを実装する。バーチャル会議室の予約確定時に自動的に利用者へ会議URLをメールで通知する。

## イベント処理仕様

### MeetingUrlNotificationHandler

- **トリガー**: MQメッセージ（チャネル: `meeting-url-notification`）
- **入力チャネル**: `meeting-url-notification`
- **出力チャネル**: なし（通知完了後はACK）
- **AsyncAPI**: [asyncapi.yaml](../../_cross-cutting/api/asyncapi.yaml) の `channels.meeting-url-notification` を参照

#### 処理フロー

1. MQから `meeting-url-notification` イベントを受信（reservationId, userId, roomId を含む）
2. DBから予約情報を取得（会議室種別がバーチャルであることを確認）
3. DBから会議URL情報を取得（roomId に紐づく会議URL）
4. 会議URLが未設定の場合はNACK → DLQ退避（後続でオーナーへの設定催促通知を検討）
5. DBから利用者情報を取得（メールアドレスを取得）
6. 会議ツール種別（Zoom/Teams/Google Meet）に応じたメール本文テンプレートを選択
7. メール本文に会議URL・利用開始日時・会議ツール名を埋め込み
8. 通知サービス（Email）経由でメールを送信
9. 送信成功後、DBの通知履歴（meeting_url_notifications）に notificationStatus="notified"、notifiedAt=NOW() を記録
10. MQにACKを返送（メッセージ処理完了）

#### エラーハンドリング

| エラー種別 | リトライ | DLQ | 説明 |
|-----------|---------|-----|------|
| 予約情報取得失敗 | Yes（最大3回） | Yes | DBアクセスエラー。リトライ上限超過後にDLQへ |
| 会議URL未設定 | No | Yes | 設定ミスのためリトライ不要。DLQで後続対応 |
| 利用者情報取得失敗 | Yes（最大3回） | Yes | DBアクセスエラー。リトライ上限超過後にDLQへ |
| メール送信失敗 | Yes（最大3回） | Yes | 通知サービスエラー。指数バックオフでリトライ |
| FaaSタイムアウト | No | Yes | 300秒以内に完了しない場合DLQへ退避 |

## データモデル変更

### 会議URL通知履歴 (meeting_url_notifications)

| カラム | 型 | 説明 | 変更種別 |
|--------|---|------|---------|
| notification_id | VARCHAR(36) | 通知ID (UUID) | 追加 |
| reservation_id | VARCHAR(36) | 予約ID | 追加 |
| meeting_url | VARCHAR(500) | 通知した会議URL | 追加 |
| notification_status | VARCHAR(20) | 通知状態（notified/failed） | 追加 |
| notified_at | TIMESTAMP | 通知日時 | 追加 |

## ビジネスルール

- FaaS実行時間制限（300秒）内にメール送信を完了させること
- MQのメッセージ可視性タイムアウトはFaaSタイムアウト（300秒）に一致させること（technology_context.constraints 参照）
- 会議ツール種別に応じたメールテンプレートを使用する（Zoom: 青色テーマ、Teams: 紫色テーマ、Google Meet: 緑色テーマ）
- メール本文には会議URL・利用開始日時・会議ツール名・参加手順リンクを含める
- 送信済みの通知履歴は DBに記録してべき等性を確保する（同一reservationIdへの重複通知を防ぐ）

## ティア完了条件（BDD）

```gherkin
Feature: 会議URLを通知する - FaaS ワーカー

  Scenario: meeting-url-notificationイベントを受信してZoom会議URLを利用者に通知する
    Given meeting-url-notificationイベント（reservationId: R-002, userId: user-001, roomId: room-010）がMQに届いている
    When FaaSワーカーがイベントを受信して処理を実行する
    Then 利用者「田中太郎」（tanaka@example.com）に会議URL「https://zoom.us/j/123456789」と利用開始日時「2026-04-01 14:00」を含むメールが送信される

  Scenario: 会議URL未設定のイベントを受信した場合、DLQに退避される
    Given meeting-url-notificationイベント（reservationId: R-003）を受信したが、roomId: room-011の会議URLが未設定である
    When FaaSワーカーがDBから会議URL取得を試みる
    Then 会議URLが見つからないためNACKが返され、MQのDLQにメッセージが退避される
```
