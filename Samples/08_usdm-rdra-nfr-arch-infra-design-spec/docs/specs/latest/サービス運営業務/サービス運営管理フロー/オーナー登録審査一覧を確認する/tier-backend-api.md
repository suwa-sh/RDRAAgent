# オーナー登録審査一覧を確認する - バックエンドAPI仕様

## 変更概要

オーナー一覧取得APIに審査状態フィルター・キーワード検索・ページネーション機能を追加する。管理者が審査状況を効率的に把握できるよう審査待ち件数サマリーエンドポイントも提供する。

## API 仕様

### オーナー一覧取得API

- **メソッド**: GET
- **パス**: `/api/v1/admin/owners`
- **認証**: OAuth2/OIDC Bearer Token（adminロール必須）
- **OpenAPI**: [openapi.yaml](../../_cross-cutting/api/openapi.yaml) の `paths./api/v1/admin/owners.get` を参照

#### リクエスト

| パラメータ | 型 | 必須 | 説明 |
|-----------|---|------|------|
| status | string | No | 審査状態フィルター: pending/approved/rejected/withdrawn（未指定で全件） |
| keyword | string | No | 氏名・メールアドレスの部分一致検索（最大50文字） |
| sort | string | No | ソート順: registered_at_asc/registered_at_desc（デフォルト: registered_at_asc） |
| page | integer | No | ページ番号（デフォルト: 1） |
| per_page | integer | No | 1ページあたり件数（デフォルト: 20、最大: 100） |

#### レスポンス

| フィールド | 型 | 説明 |
|-----------|---|------|
| owners[] | array | オーナー情報配列 |
| owners[].owner_id | string | オーナーID |
| owners[].name | string | 氏名 |
| owners[].email | string | メールアドレス |
| owners[].contact | string | 連絡先 |
| owners[].registered_at | string | 申請日（ISO8601） |
| owners[].review_status | string | 審査状態: pending/approved/rejected/withdrawn |
| owners[].elapsed_days | integer | 申請からの経過日数 |
| summary.pending_count | integer | 審査待ち総件数 |
| pagination.total | integer | 総件数 |
| pagination.page | integer | 現在ページ |
| pagination.per_page | integer | 1ページあたり件数 |

#### エラーレスポンス

| ステータスコード | 条件 | レスポンス |
|----------------|------|-----------|
| 400 | 無効なstatusパラメータ | `{"error": "invalid_status", "message": "statusはpending/approved/rejected/withdrawnのいずれかを指定してください"}` |
| 401 | 認証トークンが無効 | `{"error": "unauthorized"}` |
| 403 | adminロール以外のアクセス | `{"error": "forbidden"}` |

### 審査状態サマリーAPI

- **メソッド**: GET
- **パス**: `/api/v1/admin/owners/summary`
- **認証**: OAuth2/OIDC Bearer Token（adminロール必須）
- **OpenAPI**: [openapi.yaml](../../_cross-cutting/api/openapi.yaml) の `paths./api/v1/admin/owners/summary.get` を参照

#### レスポンス

| フィールド | 型 | 説明 |
|-----------|---|------|
| pending_count | integer | 審査待ち件数 |
| approved_count | integer | 登録済み件数 |
| rejected_count | integer | 却下件数 |
| withdrawn_count | integer | 退会件数 |

## データモデル変更

### オーナー情報（owners テーブル）

既存テーブルの参照のみ。変更なし。

| カラム | 型 | 説明 | 変更種別 |
|--------|---|------|---------|
| owner_id | VARCHAR(36) | オーナーID（PK） | 既存 |
| name | VARCHAR(100) | 氏名 | 既存 |
| email | VARCHAR(255) | メールアドレス | 既存 |
| contact | VARCHAR(50) | 連絡先 | 既存 |
| registered_at | DATETIME | 申請日 | 既存 |
| review_status | VARCHAR(20) | 審査状態（pending/approved/rejected/withdrawn） | 既存 |

## ビジネスルール

- 審査状態「pending」のみが審査アクション（承認/却下）の対象となる
- 経過日数は申請日（registered_at）から現在日時のDATEDIFFで計算する
- キーワード検索は氏名（name）とメールアドレス（email）の部分一致（LIKE '%keyword%'）で実施
- 管理者ロール（adminロール）を持つユーザーのみAPIアクセス可能
- 個人情報（氏名・メールアドレス・連絡先）のアクセスは監査ログに記録する（CTR-002）

## ティア完了条件（BDD）

```gherkin
Feature: オーナー登録審査一覧を確認する - バックエンドAPI

  Scenario: 審査待ちオーナー一覧を取得する
    Given adminロールの認証トークンが有効である
    When GET /api/v1/admin/owners?status=pending&sort=registered_at_asc にリクエストする
    Then HTTPステータス200でreview_statusがpendingのオーナー一覧と審査待ち件数が返される

  Scenario: キーワード「田中」で検索する
    Given adminロールの認証トークンが有効である
    When GET /api/v1/admin/owners?keyword=田中 にリクエストする
    Then HTTPステータス200で氏名またはメールに「田中」を含むオーナーのみが返される

  Scenario: 無効なstatusパラメータで400エラーになる
    Given adminロールの認証トークンが有効である
    When GET /api/v1/admin/owners?status=invalid にリクエストする
    Then HTTPステータス400で {"error": "invalid_status"} が返される
```
