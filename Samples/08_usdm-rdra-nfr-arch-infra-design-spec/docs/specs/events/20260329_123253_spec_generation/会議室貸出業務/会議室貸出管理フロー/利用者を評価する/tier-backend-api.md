# 利用者を評価する - バックエンド API 仕様

## 変更概要

利用者評価登録 API を追加する。会議室利用状態「利用終了」確認後、重複登録チェックを行い、利用者評価レコードを作成する。評価登録は一度のみ可能（同一usageIdに対する重複登録は409で拒否）。

## API 仕様

### 利用者評価登録

- **メソッド**: POST
- **パス**: `/api/v1/usages/{usageId}/user-rating`
- **認証**: Bearer Token (OAuth2/OIDC)
- **OpenAPI**: [openapi.yaml](../../_cross-cutting/api/openapi.yaml) の `paths./api/v1/usages/{usageId}/user-rating.post` を参照

#### リクエスト

| パラメータ | 型 | 必須 | 説明 |
|-----------|---|------|------|
| usageId (path) | string | Yes | 会議室利用ID |
| score (body) | integer | Yes | 評価スコア (1-5) |
| comment (body) | string | No | 評価コメント（最大500文字） |

#### レスポンス

| フィールド | 型 | 説明 |
|-----------|---|------|
| evaluationId | string | 評価ID（新規作成UUID） |
| usageId | string | 会議室利用ID |
| userId | string | 評価対象の利用者ID |
| score | integer | 評価スコア (1-5) |
| comment | string | 評価コメント |
| evaluatedAt | string | 評価日時 (ISO 8601) |

#### エラーレスポンス

| ステータスコード | 条件 | レスポンス |
|----------------|------|-----------|
| 400 | score が1-5の範囲外、またはcommentが500文字超 | `{ "error": "invalid score range" }` |
| 403 | オーナーと会議室利用の認可チェック失敗 | `{ "error": "forbidden" }` |
| 404 | usageIdの会議室利用が存在しない | `{ "error": "usage not found" }` |
| 409 | 同一usageIdに対して既に評価登録済み | `{ "error": "user already rated for this usage" }` |
| 422 | 会議室利用状態が「利用終了」以外 | `{ "error": "usage not ended yet" }` |

## データモデル変更

### 利用者評価 (user_evaluations)

| カラム | 型 | 説明 | 変更種別 |
|--------|---|------|---------|
| evaluation_id | VARCHAR(36) | 評価ID (UUID) | 既存 |
| owner_id | VARCHAR(36) | 評価したオーナーID | 既存 |
| user_id | VARCHAR(36) | 評価対象の利用者ID | 既存 |
| usage_id | VARCHAR(36) | 関連する会議室利用ID | 追加（重複防止用UNIQUE制約） |
| score | INTEGER | 評価スコア (1-5) | 既存 |
| comment | TEXT | 評価コメント | 既存 |
| evaluated_at | TIMESTAMP | 評価日時 | 既存 |

## ビジネスルール

- 会議室利用状態が「利用終了」以外の場合は422を返す（利用中や利用開始の状態での評価登録は不可）
- usage_id に対するUNIQUE制約により同一利用に対する重複評価登録を防ぐ
- 評価登録後、利用者の累積平均スコアを非同期で更新する（利用者情報テーブルのキャッシュ値として保持）
- オーナーID、利用者IDは会議室利用レコードから自動的に取得する（リクエストボディには含めない）

## ティア完了条件（BDD）

```gherkin
Feature: 利用者を評価する - バックエンド API

  Scenario: 利用終了後の会議室利用U-001に対して利用者評価を登録する
    Given オーナー「山田花子」（owner-001）がBearerトークンを保持し、会議室利用U-001（利用者: user-001、状態: 利用終了）が存在し未評価である
    When POST /api/v1/usages/U-001/user-rating { score: 4, comment: "清潔に利用してくれました" } をリクエストする
    Then 201 Created で評価IDと評価内容が返され、利用者評価レコードが作成される

  Scenario: 利用中の会議室利用に対して評価登録しようとすると422が返される
    Given 会議室利用U-005（状態: 利用中）が存在する
    When POST /api/v1/usages/U-005/user-rating { score: 5 } をリクエストする
    Then 422 Unprocessable Entity { error: "usage not ended yet" } が返される
```
