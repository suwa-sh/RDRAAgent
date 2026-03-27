# キャンセルポリシーを設定する - バックエンド仕様

## 変更概要

会議室のキャンセルポリシーを作成・更新するAPIエンドポイントを新規作成する。キャンセル期限ごとの料率と返金ルールを管理する。

## API 仕様

### キャンセルポリシー設定API

- **メソッド**: PUT
- **パス**: /api/rooms/:room_id/cancellation-policy
- **認証**: 会議室オーナー認証必須（所有者のみ）

#### リクエスト

| パラメータ | 型 | 必須 | 説明 |
|-----------|---|------|------|
| tiers | object[] | Yes | キャンセル料率の段階一覧 |
| tiers[].deadline | string | Yes | キャンセル期限（例: "7日前"） |
| tiers[].rate | number | Yes | キャンセル料率（0-100の整数） |
| refund_rule | string | Yes | 返金ルールの説明 |

#### レスポンス

| フィールド | 型 | 説明 |
|-----------|---|------|
| policy_id | string | ポリシーID |
| room_id | string | 会議室ID |
| tiers | object[] | キャンセル料率の段階一覧 |
| tiers[].deadline | string | キャンセル期限 |
| tiers[].rate | number | キャンセル料率 |
| refund_rule | string | 返金ルール |
| updated_at | string | 更新日時 |

## データモデル変更

### キャンセルポリシー

| カラム | 型 | 説明 | 変更種別 |
|--------|---|------|---------|
| policy_id | VARCHAR | ポリシーID（PK） | 追加 |
| room_id | VARCHAR | 会議室ID（FK、UNIQUE） | 追加 |
| refund_rule | TEXT | 返金ルール | 追加 |
| created_at | TIMESTAMP | 作成日時 | 追加 |
| updated_at | TIMESTAMP | 更新日時 | 追加 |

### キャンセルポリシー段階

| カラム | 型 | 説明 | 変更種別 |
|--------|---|------|---------|
| tier_id | VARCHAR | 段階ID（PK） | 追加 |
| policy_id | VARCHAR | ポリシーID（FK） | 追加 |
| deadline | VARCHAR | キャンセル期限 | 追加 |
| rate | INT | キャンセル料率（0-100） | 追加 |
| sort_order | INT | 表示順 | 追加 |

## ビジネスルール

- 会議室の所有者のみキャンセルポリシーを設定可能
- キャンセル料率は0から100の整数であること
- キャンセル料率の段階は1つ以上必要
- 返金ルールは必須
- 1つの会議室に対してキャンセルポリシーは1件（既存がある場合は全段階を置き換え更新）
- キャンセルポリシーは予約取消時の精算処理に適用される

## ティア完了条件（BDD）

```gherkin
Feature: キャンセルポリシーを設定する - バックエンド

  Scenario: キャンセルポリシーを新規設定する
    Given 会議室オーナー「山田太郎」の認証トークンがある
    And 会議室「room-001」にキャンセルポリシーが未設定
    When PUT /api/rooms/room-001/cancellation-policy に4段階のキャンセル料率と返金ルールを送信する
    Then ステータスコード200が返される
    And レスポンスの tiers に4段階のキャンセル料率が含まれる

  Scenario: キャンセル料率に不正な値を指定した場合
    Given 会議室オーナー「山田太郎」の認証トークンがある
    When PUT /api/rooms/room-001/cancellation-policy にキャンセル料率「150」を含むリクエストを送信する
    Then ステータスコード422が返される
    And エラーメッセージに「キャンセル料率は0から100の範囲で指定してください」が含まれる

  Scenario: 段階が0件の場合
    Given 会議室オーナー「山田太郎」の認証トークンがある
    When PUT /api/rooms/room-001/cancellation-policy に空の tiers 配列を送信する
    Then ステータスコード422が返される
    And エラーメッセージに「キャンセル料率の段階は1つ以上必要です」が含まれる

  Scenario: 他のオーナーの会議室にキャンセルポリシーを設定しようとした場合
    Given 会議室オーナー「山田太郎」の認証トークンがある
    And 会議室「room-002」はオーナー「佐藤花子」の所有
    When PUT /api/rooms/room-002/cancellation-policy にリクエストを送信する
    Then ステータスコード403が返される
```
