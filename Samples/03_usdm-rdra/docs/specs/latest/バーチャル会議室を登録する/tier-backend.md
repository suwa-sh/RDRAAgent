# バーチャル会議室を登録する - バックエンド仕様

## 変更概要

バーチャル会議室登録APIを新規作成する。会議室種別別登録条件に基づき、バーチャル会議室固有の項目（会議ツール種別・同時接続数・録画可否）と会議URL情報を登録する。

## API 仕様

### バーチャル会議室登録API

- **メソッド**: POST
- **パス**: /api/rooms/virtual
- **認証**: Bearer トークン（会議室オーナー）

#### リクエスト

| パラメータ | 型 | 必須 | 説明 |
|-----------|---|------|------|
| room_name | string | Yes | 会議室名 |
| meeting_tool_type | string | Yes | 会議ツール種別（Zoom/Teams/Google Meet） |
| max_connections | number | Yes | 同時接続数 |
| recording_available | boolean | Yes | 録画可否 |
| price | number | Yes | 1時間あたり価格 |
| meeting_url | string | Yes | 会議URL |
| meeting_url_expiry | date | Yes | 会議URLの有効期限 |
| image_url | string | No | 会議室画像URL |

#### レスポンス

| フィールド | 型 | 説明 |
|-----------|---|------|
| room_id | string | 会議室ID |
| room_name | string | 会議室名 |
| room_type | string | 会議室種別（バーチャル） |
| meeting_tool_type | string | 会議ツール種別 |
| max_connections | number | 同時接続数 |
| recording_available | boolean | 録画可否 |
| price | number | 1時間あたり価格 |
| publish_status | string | 公開状態（非公開） |
| meeting_url_id | string | 会議URL ID |

## データモデル変更

### 会議室情報

| カラム | 型 | 説明 | 変更種別 |
|--------|---|------|---------|
| room_type | VARCHAR | 会議室種別（物理/バーチャル） | 追加 |
| meeting_tool_type | VARCHAR | 会議ツール種別（Zoom/Teams/Google Meet） | 追加 |
| max_connections | INT | 同時接続数 | 追加 |
| recording_available | BOOLEAN | 録画可否 | 追加 |

### 会議URL

| カラム | 型 | 説明 | 変更種別 |
|--------|---|------|---------|
| meeting_url_id | VARCHAR | 会議URL ID | 追加 |
| room_id | VARCHAR | 会議室ID（外部キー） | 追加 |
| meeting_tool_type | VARCHAR | 会議ツール種別 | 追加 |
| meeting_url | VARCHAR | 会議URL | 追加 |
| expiry_date | DATE | 有効期限 | 追加 |

## ビジネスルール

- 会議室種別が「バーチャル」の場合、所在地・広さ・収容人数は登録不要（会議室種別別登録条件）
- 会議室種別が「バーチャル」の場合、会議ツール種別・同時接続数・録画可否は必須（会議室種別別登録条件）
- 会議ツール種別はZoom、Teams、Google Meetのいずれかのみ許可
- 同時接続数は1以上の整数
- 会議URLは有効なURL形式であること
- 登録直後の公開状態は「非公開」

## ティア完了条件（BDD）

```gherkin
Feature: バーチャル会議室を登録する - バックエンド

  Scenario: バーチャル会議室を正常に登録する
    Given 会議室オーナー「鈴木花子」の認証トークンがある
    When POST /api/rooms/virtual に以下をリクエストする
      | room_name          | オンライン会議室A |
      | meeting_tool_type  | Zoom              |
      | max_connections    | 50                |
      | recording_available| true              |
      | price              | 500               |
      | meeting_url        | https://zoom.us/j/1234567890 |
      | meeting_url_expiry | 2026-12-31        |
    Then ステータスコード201が返される
    And レスポンスの room_type が「バーチャル」である
    And レスポンスの publish_status が「非公開」である
    And レスポンスに meeting_url_id が含まれる

  Scenario: 必須項目が未入力の場合にエラーとなる
    Given 会議室オーナー「鈴木花子」の認証トークンがある
    When POST /api/rooms/virtual に room_name を未指定でリクエストする
    Then ステータスコード400が返される
    And エラーメッセージに「room_name は必須です」が含まれる

  Scenario: 会議ツール種別が不正な場合にエラーとなる
    Given 会議室オーナー「鈴木花子」の認証トークンがある
    When POST /api/rooms/virtual に meeting_tool_type「Skype」でリクエストする
    Then ステータスコード400が返される
    And エラーメッセージに「会議ツール種別はZoom、Teams、Google Meetのいずれかを指定してください」が含まれる

  Scenario: 利用者権限ではバーチャル会議室を登録できない
    Given 利用者「田中太郎」の認証トークンがある
    When POST /api/rooms/virtual をリクエストする
    Then ステータスコード403が返される
```
