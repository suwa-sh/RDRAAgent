# 会議室の詳細を確認する - バックエンド仕様

## 変更概要

会議室の物件情報・運用ルール・評価を一括取得するAPIエンドポイントを新規作成する。公開中の会議室のみ取得可能とする。

## API 仕様

### 会議室詳細取得API

- **メソッド**: GET
- **パス**: /api/rooms/:room_id
- **認証**: 利用者認証必須

#### リクエスト

| パラメータ | 型 | 必須 | 説明 |
|-----------|---|------|------|
| room_id | string | Yes | 会議室ID（パスパラメータ） |

#### レスポンス

| フィールド | 型 | 説明 |
|-----------|---|------|
| room_id | string | 会議室ID |
| room_name | string | 会議室名 |
| location | string | 所在地 |
| area | number | 広さ（㎡） |
| capacity | number | 収容人数 |
| price_per_hour | number | 時間あたり料金 |
| facilities | string[] | 設備・機能 |
| images | string[] | 画像URL一覧 |
| operation_rules | object | 運用ルール |
| operation_rules.available_hours | string | 利用可能時間帯 |
| operation_rules.min_usage_time | string | 最低利用時間 |
| operation_rules.max_usage_time | string | 最大利用時間 |
| operation_rules.rental_available | boolean | 貸出可否 |
| reviews | object | 評価情報 |
| reviews.average_score | number | 平均評価スコア |
| reviews.total_count | number | 評価件数 |
| reviews.items | object[] | 評価一覧（直近） |

## データモデル変更

なし（既存の会議室情報、運用ルール、会議室評価テーブルを結合して取得）

## ビジネスルール

- 公開状態が「公開中」の会議室のみ詳細情報を返す
- 非公開・公開可能の会議室はステータスコード404を返す
- 評価一覧は直近の評価を最大10件返す
- 平均評価スコアは小数点第1位まで算出する

## ティア完了条件（BDD）

```gherkin
Feature: 会議室の詳細を確認する - バックエンド

  Scenario: 公開中の会議室詳細を取得する
    Given 利用者「鈴木一郎」の認証トークンがある
    And 会議室「room-001」が「公開中」状態で運用ルールと評価が設定済み
    When GET /api/rooms/room-001 を送信する
    Then ステータスコード200が返される
    And レスポンスに room_name、location、area、capacity、price_per_hour が含まれる
    And レスポンスの operation_rules に利用可能時間帯が含まれる
    And レスポンスの reviews に average_score と items が含まれる

  Scenario: 非公開の会議室詳細を取得しようとした場合
    Given 利用者「鈴木一郎」の認証トークンがある
    And 会議室「room-002」が「非公開」状態
    When GET /api/rooms/room-002 を送信する
    Then ステータスコード404が返される

  Scenario: 存在しない会議室の詳細を取得しようとした場合
    Given 利用者「鈴木一郎」の認証トークンがある
    When GET /api/rooms/room-999 を送信する
    Then ステータスコード404が返される
```
