# 予約を審査する - バックエンド API 仕様

## 変更概要

予約審査（許諾/拒否）API を追加する。ReBAC認可でオーナーと会議室の所有関係を確認し、予約状態を「申請」→「確定」または「取消」に遷移させる。バーチャル会議室かつ許諾の場合はMQに会議URL通知イベントを発行する。

## API 仕様

### 予約審査実行

- **メソッド**: PUT
- **パス**: `/api/v1/reservations/{reservationId}/review`
- **認証**: Bearer Token (OAuth2/OIDC)
- **OpenAPI**: [openapi.yaml](../../_cross-cutting/api/openapi.yaml) の `paths./api/v1/reservations/{reservationId}/review.put` を参照

#### リクエスト

| パラメータ | 型 | 必須 | 説明 |
|-----------|---|------|------|
| reservationId (path) | string | Yes | 審査対象の予約ID |
| decision (body) | string | Yes | 審査決定: "approved" または "rejected" |
| rejectReason (body) | string | No | 拒否理由（decision="rejected"の場合は必須、最大200文字） |

#### レスポンス

| フィールド | 型 | 説明 |
|-----------|---|------|
| reservationId | string | 予約ID |
| previousStatus | string | 遷移前の状態（"申請"） |
| newStatus | string | 遷移後の状態（"確定" or "取消"） |
| decisionAt | string | 審査日時 (ISO 8601) |

#### エラーレスポンス

| ステータスコード | 条件 | レスポンス |
|----------------|------|-----------|
| 400 | decision が "approved"/"rejected" 以外、または rejected 時に rejectReason 未指定 | `{ "error": "invalid decision or rejectReason required" }` |
| 403 | オーナーと会議室の認可チェック失敗 | `{ "error": "forbidden" }` |
| 404 | 予約IDが存在しない | `{ "error": "reservation not found" }` |
| 409 | 予約状態が「申請」以外（既に審査済み） | `{ "error": "reservation already reviewed" }` |

## 非同期イベント（該当する場合）

### 会議URL通知イベント

- **チャネル**: `meeting-url-notification`
- **方向**: publish
- **AsyncAPI**: [asyncapi.yaml](../../_cross-cutting/api/asyncapi.yaml) の `channels.meeting-url-notification` を参照
- **発行条件**: decision="approved" かつ 予約情報の会議室種別が「バーチャル」の場合

## データモデル変更

### 予約情報 (reservations)

| カラム | 型 | 説明 | 変更種別 |
|--------|---|------|---------|
| reservation_id | VARCHAR(36) | 予約ID | 既存 |
| status | VARCHAR(20) | 予約状態（申請/確定/変更/取消） | 既存 |
| reviewed_at | TIMESTAMP | 審査日時 | 追加 |
| reject_reason | TEXT | 拒否理由 | 追加 |

## ビジネスルール

- 審査可能な予約状態は「申請」のみ。「確定」「取消」「変更」状態の予約には409を返す
- オーナーと予約に紐づく会議室の所有関係を認可サービスで確認（Check(owner:ownerId, editor, room:roomId)）
- バーチャル会議室かつ許諾の場合、予約状態更新と同一トランザクションで処理後にMQへ通知イベントを発行
- 拒否の場合は rejectReason を reservations テーブルに保存し、利用者通知は非同期で実施

## ティア完了条件（BDD）

```gherkin
Feature: 予約を審査する - バックエンド API

  Scenario: オーナー「山田花子」が予約R-001を許諾し、予約状態が確定に更新される
    Given オーナー「山田花子」（owner-001）がBearerトークンを保持し、予約R-001（物理会議室, 状態: 申請）が存在する
    When PUT /api/v1/reservations/R-001/review { decision: "approved" } をリクエストする
    Then 200 OK で { newStatus: "確定", decisionAt: "2026-03-29T10:00:00Z" } が返され、DBの予約状態が確定に更新される

  Scenario: バーチャル会議室の予約R-002を許諾した場合、会議URL通知イベントがMQに発行される
    Given オーナー「山田花子」（owner-001）がBearerトークンを保持し、予約R-002（バーチャル会議室, 状態: 申請）が存在する
    When PUT /api/v1/reservations/R-002/review { decision: "approved" } をリクエストする
    Then 200 OK が返され、MQの meeting-url-notification チャネルにイベントが発行される
```
