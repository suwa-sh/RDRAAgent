# 利用者評価一覧を確認する - バックエンドAPI仕様

## 変更概要

会議室オーナーが自身に対する利用者評価の一覧を取得する API エンドポイントを追加する。ReBAC による所有権チェックを適用し、認証済みオーナーに紐づく利用者評価のみをページネーション付きで返す。

## API 仕様

### 利用者評価一覧取得

- **メソッド**: GET
- **パス**: `/api/v1/owner/user-reviews`
- **認証**: OAuth2/OIDC（ownerロール）+ ReBAC（Check: owner:{owner_id} can view user-review:{review_id}）
- **OpenAPI**: [openapi.yaml](../../_cross-cutting/api/openapi.yaml) の `paths./api/v1/owner/user-reviews.get` を参照

#### リクエスト

| パラメータ | 型 | 必須 | 説明 |
|-----------|---|------|------|
| page | integer | No | ページ番号（デフォルト: 1） |
| per_page | integer | No | 1ページあたりの件数（デフォルト: 20、最大: 50） |

#### レスポンス

| フィールド | 型 | 説明 |
|-----------|---|------|
| summary.average_score | number | 総合平均評価スコア（小数点1位まで） |
| summary.total_count | integer | 総評価件数 |
| items | array | 個別評価の配列 |
| items[].review_id | string | 評価ID |
| items[].user_id | string | 利用者ID |
| items[].score | integer | 評価スコア（1〜5） |
| items[].comment | string | 評価コメント（null の場合あり） |
| items[].reviewed_at | string | 評価日時（ISO 8601形式） |
| pagination.page | integer | 現在ページ番号 |
| pagination.per_page | integer | 1ページあたりの件数 |
| pagination.total_count | integer | 全評価件数 |
| pagination.total_pages | integer | 総ページ数 |

#### エラーレスポンス

| ステータスコード | 条件 | レスポンス |
|----------------|------|-----------|
| 400 | per_page が 50 超 | `{"error": "invalid_per_page", "message": "per_pageは最大50です"}` |
| 401 | 未認証 | `{"error": "unauthorized"}` |
| 403 | ownerロール以外のアクセス | `{"error": "forbidden"}` |

## データモデル変更

### 利用者評価（user_reviews）

| カラム | 型 | 説明 | 変更種別 |
|--------|---|------|---------|
| review_id | VARCHAR(26) | 評価ID（ULID） | 既存 |
| owner_id | VARCHAR(26) | オーナーID（評価をつけたオーナー） | 既存 |
| user_id | VARCHAR(26) | 利用者ID（評価対象の利用者） | 既存 |
| score | SMALLINT | 評価スコア（1〜5） | 既存 |
| comment | TEXT | 評価コメント（NULL許容） | 既存 |
| reviewed_at | TIMESTAMP WITH TIME ZONE | 評価日時 | 既存 |

## ビジネスルール

- 認証済みオーナーIDに紐づく利用者評価のみを返す（ReBAC 所有権チェック）
- 評価種別は「利用者評価」のみを対象とする（会議室評価・オーナー評価は除外）
- 結果は評価日時の降順で返す
- ページネーションのデフォルトは per_page=20、最大は per_page=50
- summary の average_score は全件（ページネーション前）の平均を返す
- 評価0件の場合は summary.average_score=0、summary.total_count=0、items=[] を返す

## ティア完了条件（BDD）

```gherkin
Feature: 利用者評価一覧を確認する - バックエンドAPI

  Scenario: オーナーが自身の利用者評価一覧を取得する
    Given 会議室オーナー「田中太郎」（owner_id: O-001）が有効なアクセストークンを保持している
    When GET /api/v1/owner/user-reviews?page=1&per_page=20 をリクエストする
    Then レスポンス200が返り、owner_id=O-001に紐づく利用者評価のみが含まれる

  Scenario: 評価が0件の場合は空配列を返す
    Given 会議室オーナー「田中太郎」（owner_id: O-001）に利用者評価が0件である
    When GET /api/v1/owner/user-reviews をリクエストする
    Then レスポンス200が返り、items=[]、summary.total_count=0、summary.average_score=0 が含まれる

  Scenario: per_pageが50を超える場合はエラーを返す
    Given 会議室オーナー「田中太郎」が有効なアクセストークンを保持している
    When GET /api/v1/owner/user-reviews?per_page=100 をリクエストする
    Then レスポンス400が返り、エラーコード「invalid_per_page」が含まれる
```
