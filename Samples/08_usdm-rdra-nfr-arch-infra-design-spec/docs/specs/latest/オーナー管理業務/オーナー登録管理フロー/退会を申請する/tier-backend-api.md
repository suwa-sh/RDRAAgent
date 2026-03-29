# 退会を申請する - バックエンドAPI仕様

## 変更概要

オーナー退会処理を実行するAPIエンドポイントを新規作成する。未完了予約の確認、オーナー状態の「退会」への遷移、所有会議室の非公開化、IdPユーザーの無効化をトランザクションで処理する。

## API 仕様

### オーナー退会申請

- **メソッド**: POST
- **パス**: `/api/v1/owners/{owner_id}/withdrawal`
- **認証**: Bearer JWT（会議室オーナーロール）
- **OpenAPI**: [openapi.yaml](../../../_cross-cutting/api/openapi.yaml) の `paths./api/v1/owners/{owner_id}/withdrawal.post` を参照

#### リクエスト

| パラメータ | 型 | 必須 | 説明 |
|-----------|---|------|------|
| owner_id | string (path) | Yes | 退会対象のオーナーID（UUID） |

#### レスポンス

| フィールド | 型 | 説明 |
|-----------|---|------|
| owner_id | string | オーナーID |
| status | string | 遷移後の状態（固定値: "退会"） |
| withdrawn_at | string | 退会処理日時（ISO 8601形式） |

#### エラーレスポンス

| ステータスコード | 条件 | レスポンス |
|----------------|------|-----------|
| 403 | 自分以外のオーナーIDへのリクエスト | `{"error": "forbidden"}` |
| 404 | 指定owner_idが存在しない | `{"error": "owner_not_found"}` |
| 422 | 未完了の予約（確定・利用中）が存在する | `{"error": "has_active_reservations", "reservation_ids": ["rsv-001"]}` |
| 422 | 既に退会状態のオーナー | `{"error": "already_withdrawn"}` |

## データモデル変更

### owners（既存テーブルへの変更）

| カラム | 型 | 説明 | 変更種別 |
|--------|---|------|---------|
| withdrawn_at | TIMESTAMP | 退会処理日時（NULL許可） | 追加 |

## ビジネスルール

- 退会可能条件: オーナーが「登録済み」状態かつ未完了の予約（確定/利用中）が存在しないこと
- 退会処理はトランザクション内で実施:
  1. owners.status を「退会」に更新
  2. owner_id に紐づくすべての rooms.status を「非公開」に更新
  3. IdP のユーザーを無効化（IdP更新失敗時はロールバック）
- 退会後はオーナーとしてのAPIアクセスが不可となる（JWT の owner ロールに対して認可拒否）
- 退会日時（withdrawn_at）を記録し、過去の精算・利用履歴データは保持する

## ティア完了条件（BDD）

```gherkin
Feature: 退会を申請する - バックエンドAPI

  Scenario: 未完了予約なしのオーナーが退会を完了できる
    Given owner_id="abc-123"の登録済みオーナーが存在し、未完了の予約がない状態である
    When POST /api/v1/owners/abc-123/withdrawal をJWT付きで送信する
    Then HTTP 200 が返り、{"status": "退会"} が含まれ、DBのowners.statusが「退会」になる

  Scenario: 退会後に所有会議室が非公開になる
    Given owner_id="abc-123"のオーナーが「公開中」の会議室（room_id: "room-001"）を所有している
    When POST /api/v1/owners/abc-123/withdrawal をJWT付きで送信する
    Then DBのrooms.statusが「非公開」に更新される

  Scenario: 未完了予約があると422エラーが返る
    Given owner_id="abc-123"のオーナーに確定済み予約（rsv-001）が存在する
    When POST /api/v1/owners/abc-123/withdrawal をJWT付きで送信する
    Then HTTP 422 が返り、{"error": "has_active_reservations", "reservation_ids": ["rsv-001"]} が含まれる
```
