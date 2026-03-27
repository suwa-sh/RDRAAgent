# 会議室情報を変更する - バックエンド仕様

## 変更概要

登録済み会議室情報を更新するAPIエンドポイントを新規作成する。所有者チェックを行い、自身の会議室のみ変更可能とする。

## API 仕様

### 会議室情報更新API

- **メソッド**: PUT
- **パス**: /api/rooms/:room_id
- **認証**: 会議室オーナー認証必須（所有者のみ）

#### リクエスト

| パラメータ | 型 | 必須 | 説明 |
|-----------|---|------|------|
| room_name | string | No | 会議室名 |
| location | string | No | 所在地 |
| area | number | No | 広さ（平方メートル） |
| capacity | number | No | 収容人数（1以上の整数） |
| price_per_hour | number | No | 時間あたり料金 |
| facilities | string[] | No | 設備・機能の配列 |
| images | file[] | No | 会議室画像ファイル |

#### レスポンス

| フィールド | 型 | 説明 |
|-----------|---|------|
| room_id | string | 会議室ID |
| room_name | string | 会議室名 |
| location | string | 所在地 |
| area | number | 広さ |
| capacity | number | 収容人数 |
| price_per_hour | number | 時間あたり料金 |
| facilities | string[] | 設備・機能 |
| images | string[] | 画像URL一覧 |
| publication_status | string | 公開状態 |
| updated_at | string | 更新日時 |

## データモデル変更

### 会議室情報

| カラム | 型 | 説明 | 変更種別 |
|--------|---|------|---------|
| updated_at | TIMESTAMP | 更新日時 | 追加 |

## ビジネスルール

- 会議室の所有者（owner_id）が認証ユーザーと一致する場合のみ更新を許可する
- 送信されたフィールドのみ更新し、未送信のフィールドは現在の値を維持する
- 収容人数は1以上の整数であること
- 価格は0以上の数値であること
- 設備・機能は定義済みの値のみ受け付ける
- 公開状態は本APIでは変更しない（別UC「会議室の公開状態を変更する」で管理）

## ティア完了条件（BDD）

```gherkin
Feature: 会議室情報を変更する - バックエンド

  Scenario: 所有する会議室の情報を更新する
    Given 会議室オーナー「山田太郎」の認証トークンがある
    And 会議室「渋谷ミーティングルームA」のroom_idが「room-001」
    When PUT /api/rooms/room-001 に会議室名「渋谷ミーティングルームA プレミアム」を送信する
    Then ステータスコード200が返される
    And レスポンスの room_name が「渋谷ミーティングルームA プレミアム」である

  Scenario: 他のオーナーの会議室を更新しようとした場合
    Given 会議室オーナー「山田太郎」の認証トークンがある
    And 会議室「新宿会議室B」はオーナー「佐藤花子」の所有でroom_idが「room-002」
    When PUT /api/rooms/room-002 にリクエストを送信する
    Then ステータスコード403が返される

  Scenario: 存在しない会議室を更新しようとした場合
    Given 会議室オーナー「山田太郎」の認証トークンがある
    When PUT /api/rooms/room-999 にリクエストを送信する
    Then ステータスコード404が返される
```
