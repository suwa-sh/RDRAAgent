# バーチャル会議室オーナーを評価する - バックエンド API 仕様

## 変更概要

バーチャル会議室オーナー評価は物理会議室のオーナー評価と同一 API（POST /api/v1/reviews）を使用する。review_type=owner・room_type=virtual で区別する。

## API 仕様

### バーチャルオーナー評価登録 API

- **メソッド**: POST
- **パス**: `/api/v1/reviews`（全評価種別共通 API）
- **認証**: Bearer トークン（利用者ロール必須）
- **OpenAPI**: [openapi.yaml](../../_cross-cutting/api/openapi.yaml) の `paths./api/v1/reviews.post` を参照

#### リクエスト

| パラメータ | 型 | 必須 | 説明 |
|-----------|---|------|------|
| review_type | string | Yes | 評価種別（"owner"） |
| room_id | string | Yes | バーチャル会議室ID |
| reservation_id | string | Yes | 予約ID（利用済みチェック用） |
| score | integer | Yes | 評価スコア（1〜5） |
| comment | string | No | コメント（最大500文字） |

#### レスポンス

全評価共通スキーマ（ReviewResponse）。`review_type: "owner"` が含まれる。

#### エラーレスポンス

| ステータスコード | 条件 | レスポンス |
|----------------|------|-----------|
| 400 | スコアが1〜5の範囲外 | `{"error": "score must be 1-5"}` |
| 401 | 未認証 | `{"error": "unauthorized"}` |
| 403 | バーチャル会議室を利用していない | `{"error": "forbidden: you have not used this room"}` |
| 409 | 同一予約に対する重複オーナー評価 | `{"error": "conflict: already reviewed owner"}` |

## データモデル変更

物理会議室評価・物理会議室オーナー評価と同一テーブル（room_reviews）。`review_type='owner'`, `room_type='virtual'` で区別。

## ビジネスルール

- 評価可能条件: `room_usages WHERE user_id=? AND room_id=? AND status='利用終了'`（バーチャル利用済みチェック）
- 重複チェック: `room_reviews WHERE reservation_id=? AND review_type='owner'` が存在しないこと
- オーナーIDは room_id から会議室情報を引いて設定

## ティア完了条件（BDD）

```gherkin
Feature: バーチャル会議室オーナーを評価する - バックエンド API

  Scenario: バーチャル会議室オーナー評価が正常に登録される
    Given 利用者 user-001 のトークン、バーチャル予約 rsv-vrt-001 が利用終了済みでオーナー評価未登録
    When POST /api/v1/reviews に {"review_type":"owner","room_id":"vroom-001","reservation_id":"rsv-vrt-001","score":4,"comment":"会議URLの通知が迅速でした"} を送信する
    Then HTTP 201 と review_type="owner" を含む評価レスポンスが返る

  Scenario: バーチャル会議室を利用していない場合に403が返る
    Given 利用者 user-002 は vroom-001 を利用したことがない
    When POST /api/v1/reviews に {"review_type":"owner","room_id":"vroom-001","reservation_id":"rsv-other","score":5} を送信する
    Then HTTP 403 と {"error": "forbidden: you have not used this room"} が返る
```
