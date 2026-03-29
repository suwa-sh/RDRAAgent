# オーナー登録を審査する - バックエンドAPI仕様

## 変更概要

オーナー審査（承認/却下）を処理するAPIエンドポイントを新規作成する。審査済みオーナーへの二重審査を防ぎ、承認時はIdPユーザーを自動プロビジョニングする。

## API 仕様

### オーナー審査実行

- **メソッド**: PUT
- **パス**: `/api/v1/owners/{owner_id}/review`
- **認証**: Bearer JWT（管理者ロール必須、MFA必須）
- **OpenAPI**: [openapi.yaml](../../../_cross-cutting/api/openapi.yaml) の `paths./api/v1/owners/{owner_id}/review.put` を参照

#### リクエスト

| パラメータ | 型 | 必須 | 説明 |
|-----------|---|------|------|
| owner_id | string (path) | Yes | 審査対象のオーナーID（UUID） |
| decision | string (body) | Yes | 審査判定（"approved" または "rejected"） |
| reason | string (body) | No | 却下理由（decision="rejected"の場合推奨） |

#### レスポンス

| フィールド | 型 | 説明 |
|-----------|---|------|
| owner_id | string | 審査対象オーナーID |
| status | string | 更新後の審査状態（"登録済み" または "却下"） |
| reviewed_at | string | 審査実行日時（ISO 8601形式） |

#### エラーレスポンス

| ステータスコード | 条件 | レスポンス |
|----------------|------|-----------|
| 400 | decision が "approved" / "rejected" 以外の値 | `{"error": "invalid_decision_value"}` |
| 403 | 管理者ロール以外からのリクエスト | `{"error": "forbidden"}` |
| 404 | 指定owner_idが存在しない | `{"error": "owner_not_found"}` |
| 409 | 対象オーナーが「審査待ち」状態でない | `{"error": "invalid_status_transition", "current_status": "登録済み"}` |
| 500 | サーバー内部エラー | `{"error": "internal_server_error"}` |

## データモデル変更

### owners（既存テーブルへの変更）

| カラム | 型 | 説明 | 変更種別 |
|--------|---|------|---------|
| reviewed_at | TIMESTAMP | 審査実行日時 | 追加 |
| reviewer_id | VARCHAR(50) | 審査担当者ID | 追加 |
| rejection_reason | TEXT | 却下理由（NULL許可） | 追加 |

## ビジネスルール

- 審査操作はオーナーが「審査待ち」状態の場合のみ実行可能（オーナー登録審査条件）
- 承認時はIdPへのユーザープロビジョニングをトランザクション内で行う。IdP連携失敗時はRDB更新もロールバックする（SP-018: ユーザープロビジョニング）
- 却下時は申請者へメール通知を送信する（非同期処理）
- 審査操作者（reviewer_id）をログに記録する

## ティア完了条件（BDD）

```gherkin
Feature: オーナー登録を審査する - バックエンドAPI

  Scenario: 承認リクエストでオーナー状態が登録済みに更新される
    Given owner_id="abc-123"のオーナーがDBで審査待ち状態である
    When PUT /api/v1/owners/abc-123/review に {"decision": "approved"} を送信する
    Then HTTP 200 が返り、DBのownerレコードのstatusが「登録済み」に更新される

  Scenario: 却下リクエストでオーナー状態が却下に更新される
    Given owner_id="def-456"のオーナーがDBで審査待ち状態である
    When PUT /api/v1/owners/def-456/review に {"decision": "rejected", "reason": "本人確認書類不備"} を送信する
    Then HTTP 200 が返り、DBのownerレコードのstatusが「却下」に更新される

  Scenario: 既審査済みオーナーへの再審査で409エラーが返る
    Given owner_id="abc-123"のオーナーが既に「登録済み」状態である
    When PUT /api/v1/owners/abc-123/review に {"decision": "approved"} を送信する
    Then HTTP 409 が返り、{"error": "invalid_status_transition"} が含まれる
```
