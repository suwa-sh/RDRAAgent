# バーチャル会議室を予約する - バックエンド API 仕様

## 変更概要

バーチャル会議室予約は物理会議室の予約申請 API（POST /api/v1/reservations）を room_type=virtual で呼び出す共通 API を使用する。バーチャル固有の処理（会議URL通知の非同期イベント）は許諾時に実施。

## API 仕様

### バーチャル会議室予約申請 API

- **メソッド**: POST
- **パス**: `/api/v1/reservations`（物理会議室と共通 API、room_type=virtual で区別）
- **認証**: Bearer トークン（利用者ロール必須）
- **OpenAPI**: [openapi.yaml](../../_cross-cutting/api/openapi.yaml) の `paths./api/v1/reservations.post` を参照

#### リクエスト

| パラメータ | 型 | 必須 | 説明 |
|-----------|---|------|------|
| room_id | string | Yes | バーチャル会議室ID |
| start_datetime | string | Yes | 利用開始日時（ISO 8601） |
| end_datetime | string | Yes | 利用終了日時（ISO 8601） |
| payment_method | string | Yes | 決済方法（credit_card/e_money） |

#### レスポンス

物理会議室の予約申請と同一スキーマ（ReservationResponse）。`room_type: "virtual"` が含まれる点が異なる。

#### エラーレスポンス

物理会議室の予約申請と同一。

## データモデル変更

### reservations テーブル

物理会議室の予約申請と同一。`room_type='virtual'` がセットされる点が異なる。

## ビジネスルール

- バーチャル会議室の予約は room_type=virtual として登録
- 利用料金計算は物理会議室と同様（時間単価 × 利用時間）
- 許諾後（予約を許諾する UC）に会議URL通知イベントを MQ に publish する
- 鍵の貸出・返却は不要（バーチャル会議室利用ポリシーに基づく）
- バーチャル会議室の利用開始・終了は CronJob ワーカーによるタイマートリガー（別 UC）

## ティア完了条件（BDD）

```gherkin
Feature: バーチャル会議室を予約する - バックエンド API

  Scenario: バーチャル会議室の予約が申請状態で作成される
    Given 利用者 user-001 のトークン、バーチャル会議室 vroom-001（1500円/時間）が公開中
    When POST /api/v1/reservations に {"room_id":"vroom-001","start_datetime":"2026-04-18T15:00:00+09:00","end_datetime":"2026-04-18T17:00:00+09:00","payment_method":"credit_card"} を送信する
    Then HTTP 201 と、room_type="virtual"・status="申請"・fee=3000 のレスポンスが返る
```
