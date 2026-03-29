# キャンセルポリシーを設定する - バックエンドAPI仕様

## 変更概要

会議室のキャンセルポリシーを新規設定または更新するAPIエンドポイントを新規作成する。設定後に運用ルールの設定状況を確認し、条件充足時は会議室状態を「公開可能」に更新する。

## API 仕様

### キャンセルポリシー設定

- **メソッド**: PUT
- **パス**: `/api/v1/rooms/{room_id}/cancel-policy`
- **認証**: Bearer JWT（会議室オーナーロール）
- **OpenAPI**: [openapi.yaml](../../../_cross-cutting/api/openapi.yaml) の `paths./api/v1/rooms/{room_id}/cancel-policy.put` を参照

#### リクエスト

| パラメータ | 型 | 必須 | 説明 |
|-----------|---|------|------|
| room_id | string (path) | Yes | 対象会議室ID（UUID） |
| cancel_deadline_days | integer (body) | Yes | 無料キャンセル期限（利用日何日前まで、0以上の整数） |
| cancel_rate_percent | integer (body) | Yes | キャンセル料率（0〜100の整数） |
| refund_rule | string (body) | No | 返金ルール説明テキスト |

#### レスポンス

| フィールド | 型 | 説明 |
|-----------|---|------|
| policy_id | string | キャンセルポリシーID |
| room_id | string | 対象会議室ID |
| room_status | string | 更新後の会議室状態 |

#### エラーレスポンス

| ステータスコード | 条件 | レスポンス |
|----------------|------|-----------|
| 400 | バリデーションエラー（料率範囲外等） | `{"error": "validation_error", "fields": {"cancel_rate_percent": "must_be_0_to_100"}}` |
| 403 | 対象会議室の所有者以外からのリクエスト | `{"error": "forbidden"}` |
| 404 | 指定room_idが存在しない | `{"error": "room_not_found"}` |

## データモデル変更

### cancel_policies（新規テーブル）

| カラム | 型 | 説明 | 変更種別 |
|--------|---|------|---------|
| policy_id | UUID | キャンセルポリシーID（PK） | 追加 |
| room_id | UUID | 会議室ID（FK: rooms, UNIQUE） | 追加 |
| cancel_deadline_days | INTEGER | 無料キャンセル期限（日） | 追加 |
| cancel_rate_percent | INTEGER | キャンセル料率（%） | 追加 |
| refund_rule | TEXT | 返金ルール説明（NULL許可） | 追加 |
| created_at | TIMESTAMP | 作成日時 | 追加 |
| updated_at | TIMESTAMP | 更新日時 | 追加 |

## ビジネスルール

- キャンセルポリシーは会議室ごとに1件（UPSERT）
- キャンセル料率は0〜100（%）の範囲内（条件: キャンセルポリシー）
- 設定後に operation_rules の設定状況を確認し、両方設定済みの場合は rooms.status を「公開可能」に更新
- 設定変更は所有者のみ可能（ReBAC: owner→room 所有権チェック）
- 設定されたポリシーは予約取消時（予約を取り消す UC）に適用される

## ティア完了条件（BDD）

```gherkin
Feature: キャンセルポリシーを設定する - バックエンドAPI

  Scenario: キャンセルポリシーが正常に保存される
    Given room_id="room-001"の会議室が存在し、JWTで認証済み
    When PUT /api/v1/rooms/room-001/cancel-policy に {cancel_deadline_days:3, cancel_rate_percent:50, refund_rule:"期限内は全額返金"} を送信する
    Then HTTP 200 が返り、policy_idが含まれ、DBにcancel_policiesレコードが作成される

  Scenario: 料率101%で400エラーが返る
    Given room_id="room-001"の会議室が存在する
    When PUT /api/v1/rooms/room-001/cancel-policy に {cancel_rate_percent: 101} を含むリクエストを送信する
    Then HTTP 400 が返り、{"error": "validation_error", "fields": {"cancel_rate_percent": "must_be_0_to_100"}} が含まれる
```
