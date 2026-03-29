# 利用者の評価を確認する - バックエンド API 仕様

## 変更概要

利用者評価一覧取得 API を追加する。会議室オーナーが予約申請した利用者の評価履歴を取得し、使用許諾判断の参考情報を提供する。認可サービスで予約とオーナーの関係性を確認してからデータを返す。

## API 仕様

### 利用者評価一覧取得

- **メソッド**: GET
- **パス**: `/api/v1/users/{userId}/ratings`
- **認証**: Bearer Token (OAuth2/OIDC)
- **OpenAPI**: [openapi.yaml](../../_cross-cutting/api/openapi.yaml) の `paths./api/v1/users/{userId}/ratings.get` を参照

#### リクエスト

| パラメータ | 型 | 必須 | 説明 |
|-----------|---|------|------|
| userId (path) | string | Yes | 評価対象の利用者ID |
| reservationId (query) | string | Yes | 参照元の予約ID（認可チェック用） |
| type (query) | string | No | 評価種別フィルター（user_rating固定） |

#### レスポンス

| フィールド | 型 | 説明 |
|-----------|---|------|
| userId | string | 利用者ID |
| userName | string | 利用者名 |
| averageScore | number | 平均評価スコア（小数第1位切捨て、0件時はnull） |
| totalCount | integer | 評価総件数 |
| ratings | array | 評価一覧 |
| ratings[].evaluationId | string | 評価ID |
| ratings[].score | integer | 評価スコア (1-5) |
| ratings[].comment | string | コメント |
| ratings[].evaluatedAt | string | 評価日時 (ISO 8601) |

#### エラーレスポンス

| ステータスコード | 条件 | レスポンス |
|----------------|------|-----------|
| 400 | reservationIdパラメータが未指定 | `{ "error": "reservationId is required" }` |
| 403 | 予約とオーナーの認可チェック失敗（別オーナーの予約） | `{ "error": "forbidden" }` |
| 404 | userId の利用者が存在しない | `{ "error": "user not found" }` |

## データモデル変更

### 利用者評価 (user_evaluations)

| カラム | 型 | 説明 | 変更種別 |
|--------|---|------|---------|
| evaluation_id | VARCHAR(36) | 評価ID (UUID) | 既存 |
| owner_id | VARCHAR(36) | 評価したオーナーID | 既存 |
| user_id | VARCHAR(36) | 評価対象の利用者ID | 既存 |
| score | INTEGER | 評価スコア (1-5) | 既存 |
| comment | TEXT | コメント | 既存 |
| evaluated_at | TIMESTAMP | 評価日時 | 既存 |

## ビジネスルール

- 評価種別「利用者評価」のみを対象とし、会議室評価・オーナー評価は除外する
- 平均スコアは全評価スコアの算術平均を小数第1位で切り捨て（0件の場合はnull）
- reservationId に基づいて認可サービスに Check(owner:ownerId, viewer, reservation:reservationId) を実行し、オーナーと予約の関係性を確認してからデータを返す
- 評価履歴がない場合は totalCount: 0、ratings: []、averageScore: null を返す（404ではなく200）

## ティア完了条件（BDD）

```gherkin
Feature: 利用者の評価を確認する - バックエンド API

  Scenario: オーナー「山田花子」が予約R-001の利用者「田中太郎」の評価一覧を取得する
    Given オーナー「山田花子」（owner-001）がBearerトークンを保持し、予約R-001が「申請」状態である
    When GET /api/v1/users/user-001/ratings?reservationId=R-001 をリクエストする
    Then 200 OK で評価一覧（3件）と平均スコア4.2が返される

  Scenario: 別オーナーの予約IDを指定した場合に403が返される
    Given オーナー「山田花子」（owner-001）がBearerトークンを保持し、予約R-999は別オーナーの予約である
    When GET /api/v1/users/user-001/ratings?reservationId=R-999 をリクエストする
    Then 403 Forbidden が返される
```
