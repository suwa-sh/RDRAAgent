# 利用履歴を管理する - バックエンド仕様

## 変更概要

利用履歴の一覧取得・検索・詳細取得APIを新規作成する。会員別・物件別・期間別のフィルタリングを実装する。

## API 仕様

### 利用履歴一覧取得API

- **メソッド**: GET
- **パス**: /api/admin/usage-history
- **認証**: サービス運営担当者認証

#### リクエスト

| パラメータ | 型 | 必須 | 説明 |
|-----------|---|------|------|
| user_name | string | No | 利用者名（部分一致検索） |
| room_name | string | No | 会議室名（部分一致検索） |
| period_from | string | No | 対象期間開始日（YYYY-MM-DD） |
| period_to | string | No | 対象期間終了日（YYYY-MM-DD） |
| page | number | No | ページ番号（デフォルト: 1） |
| per_page | number | No | 1ページあたりの件数（デフォルト: 20） |

#### レスポンス

| フィールド | 型 | 説明 |
|-----------|---|------|
| total_count | number | 検索結果の総件数 |
| page | number | 現在のページ番号 |
| per_page | number | 1ページあたりの件数 |
| items | array | 利用履歴の配列 |
| items[].history_id | string | 履歴ID |
| items[].user_id | string | 利用者ID |
| items[].user_name | string | 利用者名 |
| items[].room_id | string | 会議室ID |
| items[].room_name | string | 会議室名 |
| items[].usage_datetime | string | 利用日時 |
| items[].usage_hours | number | 利用時間（時間） |
| items[].usage_fee | number | 利用料金 |

### 利用履歴詳細取得API

- **メソッド**: GET
- **パス**: /api/admin/usage-history/{history_id}
- **認証**: サービス運営担当者認証

#### レスポンス

| フィールド | 型 | 説明 |
|-----------|---|------|
| history_id | string | 履歴ID |
| user_id | string | 利用者ID |
| user_name | string | 利用者名 |
| room_id | string | 会議室ID |
| room_name | string | 会議室名 |
| usage_datetime | string | 利用日時 |
| usage_hours | number | 利用時間（時間） |
| usage_fee | number | 利用料金 |

## データモデル変更

### 利用履歴

| カラム | 型 | 説明 | 変更種別 |
|--------|---|------|---------|
| 履歴ID | VARCHAR | 利用履歴の一意識別子 | 追加 |
| 利用者ID | VARCHAR | 利用者の識別子 | 追加 |
| 会議室ID | VARCHAR | 会議室の識別子 | 追加 |
| 利用日時 | DATETIME | 利用日時 | 追加 |
| 利用時間 | INT | 利用時間（分） | 追加 |
| 利用料金 | DECIMAL | 利用料金 | 追加 |

## ビジネスルール

- 利用者名・会議室名の検索は部分一致で行う
- 対象期間は利用日時を基準にフィルタリングする
- ページネーションはデフォルト20件/ページとする
- サービス運営担当者のみがアクセス可能とする

## ティア完了条件（BDD）

```gherkin
Feature: 利用履歴を管理する - バックエンド

  Scenario: 利用履歴一覧を取得する
    Given 利用履歴が20件登録されている
    When GET /api/admin/usage-history を実行する
    Then ステータスコード200が返却される
    And total_count が20となる
    And items に最大20件の利用履歴が含まれる

  Scenario: 利用者名で利用履歴を検索する
    Given 利用者「田中太郎」の利用履歴が3件登録されている
    When GET /api/admin/usage-history?user_name=田中太郎 を実行する
    Then ステータスコード200が返却される
    And items の全件の user_name が「田中太郎」を含む

  Scenario: 存在しない利用履歴の詳細を取得する
    Given 利用履歴「H999」が存在しない
    When GET /api/admin/usage-history/H999 を実行する
    Then ステータスコード404が返却される
```
