# 会議室を検索する - バックエンド仕様

## 変更概要

会議室検索APIを新規作成する。複数の検索条件による絞り込みに対応し、公開中の会議室のみを返却する。

## API 仕様

### 会議室検索API

- **メソッド**: GET
- **パス**: /api/rooms/search
- **認証**: Bearer トークン（利用者）

#### リクエスト

| パラメータ | 型 | 必須 | 説明 |
|-----------|---|------|------|
| area | string | No | 所在地エリア |
| min_area_size | number | No | 最小広さ（平米） |
| min_capacity | number | No | 最小収容人数 |
| min_price | number | No | 1時間あたり最低価格 |
| max_price | number | No | 1時間あたり最高価格 |
| facilities | string[] | No | 設備・機能（プロジェクター、ホワイトボード、Wi-Fi、テレビ会議設備、音響設備、空調、飲食可、喫煙可） |
| min_rating | number | No | 最低評価スコア |
| available_from | datetime | No | 利用可能開始日時 |
| available_to | datetime | No | 利用可能終了日時 |
| page | number | No | ページ番号（デフォルト: 1） |
| per_page | number | No | 1ページあたり件数（デフォルト: 20） |

#### レスポンス

| フィールド | 型 | 説明 |
|-----------|---|------|
| rooms | object[] | 会議室一覧 |
| rooms[].room_id | string | 会議室ID |
| rooms[].room_name | string | 会議室名 |
| rooms[].location | string | 所在地 |
| rooms[].area_size | number | 広さ（平米） |
| rooms[].capacity | number | 収容人数 |
| rooms[].price | number | 1時間あたり価格 |
| rooms[].facilities | string[] | 設備・機能一覧 |
| rooms[].rating_score | number | 平均評価スコア |
| rooms[].image_url | string | 会議室画像URL |
| total_count | number | 総件数 |
| page | number | 現在ページ番号 |
| per_page | number | 1ページあたり件数 |

## データモデル変更

### 会議室情報

| カラム | 型 | 説明 | 変更種別 |
|--------|---|------|---------|
| room_id | VARCHAR | 会議室ID | 追加 |
| room_name | VARCHAR | 会議室名 | 追加 |
| location | VARCHAR | 所在地 | 追加 |
| area_size | DECIMAL | 広さ（平米） | 追加 |
| capacity | INT | 収容人数 | 追加 |
| price | DECIMAL | 1時間あたり価格 | 追加 |
| facilities | JSON | 設備・機能一覧 | 追加 |
| image_url | VARCHAR | 画像URL | 追加 |
| publish_status | VARCHAR | 公開状態（非公開/公開可能/公開中） | 追加 |

## ビジネスルール

- 公開状態が「公開中」の会議室のみを検索対象とする
- 検索条件は全てAND条件で絞り込む
- 設備・機能は指定された全ての設備を持つ会議室を返す（AND条件）
- 評価スコアは会議室評価の平均値を使用する

## ティア完了条件（BDD）

```gherkin
Feature: 会議室を検索する - バックエンド

  Scenario: エリアと収容人数で会議室を検索する
    Given 公開中の会議室「新宿カンファレンスルームA」が登録されている（所在地: 新宿区、収容人数: 20名）
    And 公開中の会議室「渋谷ミーティングスペースB」が登録されている（所在地: 渋谷区、収容人数: 10名）
    When GET /api/rooms/search?area=新宿区&min_capacity=15 をリクエストする
    Then ステータスコード200が返される
    And レスポンスの rooms に「新宿カンファレンスルームA」が含まれる
    And レスポンスの rooms に「渋谷ミーティングスペースB」は含まれない

  Scenario: 非公開の会議室は検索結果に含まれない
    Given 非公開状態の会議室「非公開ルーム」が登録されている
    When GET /api/rooms/search をリクエストする
    Then レスポンスの rooms に「非公開ルーム」は含まれない

  Scenario: 検索結果が0件の場合
    When GET /api/rooms/search?area=北海道&min_capacity=100 をリクエストする
    Then ステータスコード200が返される
    And レスポンスの rooms は空配列である
    And レスポンスの total_count は 0 である
```
