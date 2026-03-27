# 会議室を登録する - バックエンド仕様

## 変更概要

会議室情報を登録するAPIエンドポイントを新規作成する。登録時に会議室の状態を「非公開」で初期化する。

## API 仕様

### 会議室登録API

- **メソッド**: POST
- **パス**: /api/rooms
- **認証**: 会議室オーナー認証必須

#### リクエスト

| パラメータ | 型 | 必須 | 説明 |
|-----------|---|------|------|
| room_name | string | Yes | 会議室名 |
| location | string | Yes | 所在地 |
| area | number | Yes | 広さ（平方メートル） |
| capacity | number | Yes | 収容人数（1以上の整数） |
| price_per_hour | number | Yes | 時間あたり料金 |
| facilities | string[] | No | 設備・機能の配列 |
| images | file[] | No | 会議室画像ファイル |

#### レスポンス

| フィールド | 型 | 説明 |
|-----------|---|------|
| room_id | string | 発行された会議室ID |
| room_name | string | 会議室名 |
| location | string | 所在地 |
| area | number | 広さ |
| capacity | number | 収容人数 |
| price_per_hour | number | 時間あたり料金 |
| facilities | string[] | 設備・機能 |
| images | string[] | 画像URL一覧 |
| publication_status | string | 公開状態（「非公開」で固定） |
| created_at | string | 登録日時 |

## データモデル変更

### 会議室情報

| カラム | 型 | 説明 | 変更種別 |
|--------|---|------|---------|
| room_id | VARCHAR | 会議室ID（PK） | 追加 |
| owner_id | VARCHAR | オーナーID（FK） | 追加 |
| room_name | VARCHAR | 会議室名 | 追加 |
| location | VARCHAR | 所在地 | 追加 |
| area | DECIMAL | 広さ（㎡） | 追加 |
| capacity | INT | 収容人数 | 追加 |
| price_per_hour | DECIMAL | 時間あたり料金 | 追加 |
| facilities | JSON | 設備・機能 | 追加 |
| images | JSON | 画像URL一覧 | 追加 |
| publication_status | VARCHAR | 公開状態 | 追加 |
| created_at | TIMESTAMP | 登録日時 | 追加 |

## ビジネスルール

- 会議室登録時の公開状態は必ず「非公開」で初期化する
- 収容人数は1以上の整数であること
- 価格は0以上の数値であること
- 設備・機能は「プロジェクター、ホワイトボード、Wi-Fi、テレビ会議設備、音響設備、空調、飲食可、喫煙可」の中から選択する
- 登録者は会議室オーナーロールを持つ認証済みユーザーであること

## ティア完了条件（BDD）

```gherkin
Feature: 会議室を登録する - バックエンド

  Scenario: 正常な会議室登録リクエスト
    Given 会議室オーナー「山田太郎」の認証トークンがある
    When POST /api/rooms に会議室名「渋谷ミーティングルームA」、所在地「東京都渋谷区渋谷1-1-1」、広さ「30」、収容人数「10」、価格「3000」を送信する
    Then ステータスコード201が返される
    And レスポンスの publication_status が「非公開」である

  Scenario: 必須パラメータが欠落している場合
    Given 会議室オーナー「山田太郎」の認証トークンがある
    When POST /api/rooms に会議室名を含めずリクエストを送信する
    Then ステータスコード400が返される
    And エラーメッセージに「room_name は必須です」が含まれる

  Scenario: 認証なしでのリクエスト
    Given 認証トークンなし
    When POST /api/rooms にリクエストを送信する
    Then ステータスコード401が返される
```
