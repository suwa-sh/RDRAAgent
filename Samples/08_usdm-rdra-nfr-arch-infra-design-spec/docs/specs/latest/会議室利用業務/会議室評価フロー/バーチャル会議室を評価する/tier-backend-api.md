# バーチャル会議室を評価する - バックエンド API 仕様

## 変更概要

バーチャル会議室評価は物理会議室評価と同一 API（POST /api/v1/reviews）を使用する。room_type=virtual で区別する。

## API 仕様

### バーチャル会議室評価登録 API

- **メソッド**: POST
- **パス**: `/api/v1/reviews`（物理会議室評価と共通）
- **認証**: Bearer トークン（利用者ロール必須）
- **OpenAPI**: [openapi.yaml](../../_cross-cutting/api/openapi.yaml) の `paths./api/v1/reviews.post` を参照

#### リクエスト

物理会議室評価と同一スキーマ（ReviewRequest）。`review_type: "room"` を使用し、room_id はバーチャル会議室IDを指定。

#### レスポンス

物理会議室評価と同一スキーマ（ReviewResponse）。

#### エラーレスポンス

物理会議室評価と同一。

## データモデル変更

物理会議室評価と同一テーブル（room_reviews）を使用。`room_type='virtual'` で区別。

## ビジネスルール

- 評価可能条件は物理会議室評価と同じ（利用済みチェック・重複チェック）
- バーチャル会議室の room_type=virtual を reviews レコードに記録
- avg_rating 更新ロジックは物理会議室と同一

## ティア完了条件（BDD）

```gherkin
Feature: バーチャル会議室を評価する - バックエンド API

  Scenario: バーチャル会議室の評価が正常に登録される
    Given 利用者 user-001 のトークン、バーチャル予約 rsv-vrt-001 が利用終了済みで評価未登録
    When POST /api/v1/reviews に {"review_type":"room","room_id":"vroom-001","reservation_id":"rsv-vrt-001","score":5,"comment":"接続が安定していた"} を送信する
    Then HTTP 201 と review_type="room" を含む評価レスポンスが返り、バーチャル会議室の avg_rating が更新される
```
