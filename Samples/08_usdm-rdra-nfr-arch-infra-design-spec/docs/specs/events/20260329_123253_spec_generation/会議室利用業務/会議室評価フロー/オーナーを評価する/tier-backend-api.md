# オーナーを評価する - バックエンド API 仕様

## 変更概要

オーナー評価登録 API は会議室評価登録と同一エンドポイント（POST /api/v1/reviews）を使用し、review_type=owner で区別する。

## API 仕様

### オーナー評価登録 API

- **メソッド**: POST
- **パス**: `/api/v1/reviews`（会議室評価と共通 API）
- **認証**: Bearer トークン（利用者ロール必須）
- **OpenAPI**: [openapi.yaml](../../_cross-cutting/api/openapi.yaml) の `paths./api/v1/reviews.post` を参照

#### リクエスト

| パラメータ | 型 | 必須 | 説明 |
|-----------|---|------|------|
| review_type | string | Yes | 評価種別（"owner"） |
| room_id | string | Yes | 会議室ID（オーナー特定のため） |
| reservation_id | string | Yes | 予約ID（利用済みチェック用） |
| score | integer | Yes | 評価スコア（1〜5） |
| comment | string | No | コメント（最大500文字） |

#### レスポンス

会議室評価と同一スキーマ（ReviewResponse）。`review_type: "owner"` が含まれる。

#### エラーレスポンス

会議室評価と同一。

## データモデル変更

会議室評価と同一テーブル（room_reviews）を使用。`review_type='owner'` で区別。

## ビジネスルール

- 評価可能な利用者: `room_usages WHERE user_id=? AND room_id=? AND status='利用終了'` が存在すること
- 重複チェック: `room_reviews WHERE reservation_id=? AND review_type='owner'` が存在しないこと
- オーナーIDは room_id から会議室情報を引いて設定する

## ティア完了条件（BDD）

```gherkin
Feature: オーナーを評価する - バックエンド API

  Scenario: オーナー評価が正常に登録される
    Given 利用者 user-001 のトークン、予約 rsv-001 が利用終了済みで、オーナー評価が未登録
    When POST /api/v1/reviews に {"review_type":"owner","room_id":"room-001","reservation_id":"rsv-001","score":5,"comment":"丁寧な対応でした"} を送信する
    Then HTTP 201 と review_type="owner" を含む評価レスポンスが返る
```
