# 会議室の公開状態を変更する - バックエンド仕様

## 変更概要

会議室の公開状態を遷移させるAPIエンドポイントを新規作成する。会議室公開条件の充足チェックと状態遷移の妥当性検証を行う。

## API 仕様

### 会議室公開状態変更API

- **メソッド**: PUT
- **パス**: /api/rooms/:room_id/publication
- **認証**: 会議室オーナー認証必須（所有者のみ）

#### リクエスト

| パラメータ | 型 | 必須 | 説明 |
|-----------|---|------|------|
| status | string | Yes | 変更先の公開状態（「非公開」「公開可能」「公開中」） |

#### レスポンス

| フィールド | 型 | 説明 |
|-----------|---|------|
| room_id | string | 会議室ID |
| publication_status | string | 変更後の公開状態 |
| updated_at | string | 更新日時 |

### 会議室公開条件確認API

- **メソッド**: GET
- **パス**: /api/rooms/:room_id/publication/conditions
- **認証**: 会議室オーナー認証必須（所有者のみ）

#### レスポンス

| フィールド | 型 | 説明 |
|-----------|---|------|
| room_id | string | 会議室ID |
| conditions | object[] | 公開条件の充足状況一覧 |
| conditions[].name | string | 条件名 |
| conditions[].satisfied | boolean | 充足状態 |
| all_satisfied | boolean | 全条件充足フラグ |

## データモデル変更

なし（会議室情報テーブルの publication_status カラムを使用）

## ビジネスルール

- 会議室公開条件: 物件情報（広さ・価格・機能性）と運用ルール（キャンセルポリシー・貸出可否）が登録完了した場合に公開可能とする
- 許可される状態遷移:
  - 非公開 → 公開可能（公開条件を満たしている場合のみ）
  - 公開可能 → 公開中
  - 公開中 → 非公開
  - 公開可能 → 非公開
- 上記以外の状態遷移は拒否する
- 会議室の所有者のみ公開状態を変更可能

## ティア完了条件（BDD）

```gherkin
Feature: 会議室の公開状態を変更する - バックエンド

  Scenario: 非公開から公開可能への遷移（条件充足）
    Given 会議室オーナー「山田太郎」の認証トークンがある
    And 会議室「room-001」が「非公開」状態で公開条件を全て満たしている
    When PUT /api/rooms/room-001/publication に status「公開可能」を送信する
    Then ステータスコード200が返される
    And レスポンスの publication_status が「公開可能」である

  Scenario: 非公開から公開可能への遷移（条件未充足）
    Given 会議室オーナー「山田太郎」の認証トークンがある
    And 会議室「room-001」が「非公開」状態で運用ルールが未設定
    When PUT /api/rooms/room-001/publication に status「公開可能」を送信する
    Then ステータスコード422が返される
    And エラーメッセージに「運用ルールが未設定」が含まれる

  Scenario: 不正な状態遷移の拒否
    Given 会議室オーナー「山田太郎」の認証トークンがある
    And 会議室「room-001」が「非公開」状態
    When PUT /api/rooms/room-001/publication に status「公開中」を送信する
    Then ステータスコード422が返される
    And エラーメッセージに「非公開から公開中への遷移はできません」が含まれる
```
