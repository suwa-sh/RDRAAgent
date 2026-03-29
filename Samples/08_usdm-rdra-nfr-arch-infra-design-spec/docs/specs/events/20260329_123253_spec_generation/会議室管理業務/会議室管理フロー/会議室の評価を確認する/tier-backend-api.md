# 会議室の評価を確認する - バックエンドAPI仕様

## 変更概要

会議室の評価一覧を取得するAPIエンドポイントを新規作成する。所有者チェックを行い、ページネーション対応で評価一覧と平均スコアを返す。

## API 仕様

### 会議室評価一覧取得

- **メソッド**: GET
- **パス**: `/api/v1/rooms/{room_id}/reviews`
- **認証**: Bearer JWT（会議室オーナーロール）
- **OpenAPI**: [openapi.yaml](../../../_cross-cutting/api/openapi.yaml) の `paths./api/v1/rooms/{room_id}/reviews.get` を参照

#### リクエスト

| パラメータ | 型 | 必須 | 説明 |
|-----------|---|------|------|
| room_id | string (path) | Yes | 対象会議室ID（UUID） |
| page | integer (query) | No | ページ番号（デフォルト: 1） |
| per_page | integer (query) | No | 1ページあたりの件数（デフォルト: 10、最大: 50） |

#### レスポンス

| フィールド | 型 | 説明 |
|-----------|---|------|
| reviews | array | 評価一覧（評価日時降順） |
| reviews[].review_id | string | 評価ID |
| reviews[].reviewer_user_id | string | 評価者の利用者ID（マスク表示用） |
| reviews[].score | number | 評価スコア（1.0〜5.0） |
| reviews[].comment | string | コメント（null許可） |
| reviews[].reviewed_at | string | 評価日時（ISO 8601） |
| average_score | number | 平均評価スコア（小数第1位） |
| total_count | integer | 総評価件数 |
| page | integer | 現在のページ番号 |
| total_pages | integer | 総ページ数 |

#### エラーレスポンス

| ステータスコード | 条件 | レスポンス |
|----------------|------|-----------|
| 403 | 対象会議室の所有者以外からのリクエスト | `{"error": "forbidden"}` |
| 404 | 指定room_idが存在しない | `{"error": "room_not_found"}` |

## データモデル変更

### room_reviews（新規テーブル）

| カラム | 型 | 説明 | 変更種別 |
|--------|---|------|---------|
| review_id | UUID | 評価ID（PK） | 追加 |
| user_id | UUID | 評価者の利用者ID（FK: users） | 追加 |
| room_id | UUID | 対象会議室ID（FK: rooms） | 追加 |
| owner_id | UUID | 会議室オーナーID | 追加 |
| room_type | VARCHAR(20) | 会議室種別 | 追加 |
| score | DECIMAL(2,1) | 評価スコア（1.0〜5.0） | 追加 |
| comment | TEXT | コメント（NULL許可） | 追加 |
| reviewed_at | TIMESTAMP | 評価日時 | 追加 |
| created_at | TIMESTAMP | レコード作成日時 | 追加 |

## ビジネスルール

- 評価一覧の閲覧は対象会議室の所有者のみ可能（ReBAC: owner→room 所有権チェック）
- 評価一覧は評価日時降順で返す
- 平均スコアは小数第1位で計算・返却する（計算ルール: Σ(score) / count）
- ページネーション対応（1ページ10件デフォルト、最大50件）（NFR B.2.1.1 性能確保）
- 利用者IDは直接返さず、セキュリティ上マスク表示用のIDのみ返す（NFR E.6.1.1 PII保護）

## ティア完了条件（BDD）

```gherkin
Feature: 会議室の評価を確認する - バックエンドAPI

  Scenario: 会議室の評価一覧が正常に取得できる
    Given room_id="room-001"の会議室（オーナー: abc-123）に5件の評価が登録済み
    When GET /api/v1/rooms/room-001/reviews をオーナーJWT付きで送信する
    Then HTTP 200 が返り、reviewsに5件のデータ、average_scoreとtotal_count:5が含まれる

  Scenario: 他者の会議室評価取得で403エラーが返る
    Given room_id="room-999"は別オーナーの会議室
    When GET /api/v1/rooms/room-999/reviews をオーナー「田中一郎」のJWT付きで送信する
    Then HTTP 403 が返り、{"error": "forbidden"} が含まれる

  Scenario: 評価0件の場合は空配列と平均スコア0.0が返る
    Given room_id="room-002"の会議室に評価が0件
    When GET /api/v1/rooms/room-002/reviews をオーナーJWT付きで送信する
    Then HTTP 200 が返り、reviews:[]、average_score:0.0、total_count:0が含まれる
```
