# 会議室を検索する - バックエンド仕様

## 変更概要

会議室検索APIにバーチャル会議室関連の検索パラメータ（会議室種別・会議ツール種別・同時接続数）を追加する。レスポンスにもバーチャル会議室固有の情報を追加する。

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
| room_type | string | No | 会議室種別（物理/バーチャル） |
| meeting_tool_type | string | No | 会議ツール種別（Zoom/Teams/Google Meet） |
| min_connections | number | No | 最小同時接続数 |
| page | number | No | ページ番号（デフォルト: 1） |
| per_page | number | No | 1ページあたり件数（デフォルト: 20） |

#### レスポンス

| フィールド | 型 | 説明 |
|-----------|---|------|
| rooms | object[] | 会議室一覧 |
| rooms[].room_id | string | 会議室ID |
| rooms[].room_name | string | 会議室名 |
| rooms[].room_type | string | 会議室種別（物理/バーチャル） |
| rooms[].location | string | 所在地（物理会議室の場合） |
| rooms[].area_size | number | 広さ（平米、物理会議室の場合） |
| rooms[].capacity | number | 収容人数（物理会議室の場合） |
| rooms[].price | number | 1時間あたり価格 |
| rooms[].facilities | string[] | 設備・機能一覧（物理会議室の場合） |
| rooms[].rating_score | number | 平均評価スコア |
| rooms[].image_url | string | 会議室画像URL |
| rooms[].meeting_tool_type | string | 会議ツール種別（バーチャル会議室の場合） |
| rooms[].max_connections | number | 同時接続数（バーチャル会議室の場合） |
| rooms[].recording_available | boolean | 録画可否（バーチャル会議室の場合） |
| total_count | number | 総件数 |
| page | number | 現在ページ番号 |
| per_page | number | 1ページあたり件数 |

## データモデル変更

### 会議室情報

| カラム | 型 | 説明 | 変更種別 |
|--------|---|------|---------|
| room_type | VARCHAR | 会議室種別（物理/バーチャル） | 追加 |
| meeting_tool_type | VARCHAR | 会議ツール種別（Zoom/Teams/Google Meet） | 追加 |
| max_connections | INT | 同時接続数 | 追加 |
| recording_available | BOOLEAN | 録画可否 | 追加 |

## ビジネスルール

- 公開状態が「公開中」の会議室のみを検索対象とする
- 検索条件は全てAND条件で絞り込む
- 設備・機能は指定された全ての設備を持つ会議室を返す（AND条件）
- 評価スコアは会議室評価の平均値を使用する
- room_type 未指定時は物理・バーチャル両方を検索対象とする
- meeting_tool_type は room_type が「バーチャル」の場合のみ有効
- min_connections は room_type が「バーチャル」の場合のみ有効

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

  Scenario: 会議室種別でバーチャル会議室のみを検索する
    Given 公開中の物理会議室「新宿カンファレンスルームA」が登録されている
    And 公開中のバーチャル会議室「オンライン会議室A」が登録されている（会議ツール種別: Zoom）
    When GET /api/rooms/search?room_type=バーチャル をリクエストする
    Then ステータスコード200が返される
    And レスポンスの rooms に「オンライン会議室A」が含まれる
    And レスポンスの rooms に「新宿カンファレンスルームA」は含まれない
    And レスポンスの rooms[0].room_type が「バーチャル」である

  Scenario: 会議ツール種別で検索する
    Given 公開中のバーチャル会議室「Zoomルーム」が登録されている（会議ツール種別: Zoom）
    And 公開中のバーチャル会議室「Teamsルーム」が登録されている（会議ツール種別: Teams）
    When GET /api/rooms/search?room_type=バーチャル&meeting_tool_type=Zoom をリクエストする
    Then ステータスコード200が返される
    And レスポンスの rooms に「Zoomルーム」が含まれる
    And レスポンスの rooms に「Teamsルーム」は含まれない

  Scenario: 同時接続数で検索する
    Given 公開中のバーチャル会議室「小規模Zoomルーム」が登録されている（同時接続数: 10）
    And 公開中のバーチャル会議室「大規模Zoomルーム」が登録されている（同時接続数: 100）
    When GET /api/rooms/search?room_type=バーチャル&min_connections=50 をリクエストする
    Then ステータスコード200が返される
    And レスポンスの rooms に「大規模Zoomルーム」が含まれる
    And レスポンスの rooms に「小規模Zoomルーム」は含まれない

  Scenario: 種別未指定で物理・バーチャル両方が返される
    Given 公開中の物理会議室「新宿カンファレンスルームA」が登録されている
    And 公開中のバーチャル会議室「オンライン会議室A」が登録されている
    When GET /api/rooms/search をリクエストする
    Then ステータスコード200が返される
    And レスポンスの rooms に「新宿カンファレンスルームA」が含まれる
    And レスポンスの rooms に「オンライン会議室A」が含まれる

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
