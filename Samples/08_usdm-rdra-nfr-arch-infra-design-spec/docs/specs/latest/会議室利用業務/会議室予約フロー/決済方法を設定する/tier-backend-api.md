# 決済方法を設定する - バックエンド API 仕様

## 変更概要

決済方法登録 API を実装する。カード情報は外部決済機関でトークン化し、トークンのみを RDB に暗号化して保存する（PCI DSS スコープ削減）。

## API 仕様

### 決済方法登録 API

- **メソッド**: POST
- **パス**: `/api/v1/payment-methods`
- **認証**: Bearer トークン（ログイン必須）
- **OpenAPI**: [openapi.yaml](../../_cross-cutting/api/openapi.yaml) の `paths./api/v1/payment-methods.post` を参照

#### リクエスト

| パラメータ | 型 | 必須 | 説明 |
|-----------|---|------|------|
| payment_type | string | Yes | 決済方法（credit_card/e_money） |
| card_number | string | No | カード番号（credit_card 時必須） |
| expiry | string | No | 有効期限 MM/YY（credit_card 時必須） |
| cvv | string | No | セキュリティコード（credit_card 時必須） |
| emoney_id | string | No | 電子マネーID（e_money 時必須） |

#### レスポンス

| フィールド | 型 | 説明 |
|-----------|---|------|
| payment_method_id | string | 決済方法ID |
| payment_type | string | 決済方法（credit_card/e_money） |
| masked_identifier | string | マスク済み識別子（例: **** **** **** 1234） |
| status | string | 決済状態（決済手段登録済み） |

#### エラーレスポンス

| ステータスコード | 条件 | レスポンス |
|----------------|------|-----------|
| 400 | バリデーションエラー（Luhn 失敗・有効期限切れ） | `{"error": "invalid card information"}` |
| 401 | 未認証 | `{"error": "unauthorized"}` |
| 502 | 外部決済機関との通信エラー | `{"error": "payment gateway error"}` |

## データモデル変更

### payment_methods テーブル（新規作成）

| カラム | 型 | 説明 | 変更種別 |
|--------|---|------|---------|
| payment_method_id | VARCHAR(36) | 決済方法ID（UUID） | 追加 |
| user_id | VARCHAR(36) | 利用者ID | 追加 |
| payment_type | VARCHAR(20) | 決済方法（credit_card/e_money） | 追加 |
| token | VARCHAR(255) | 決済トークン（暗号化済み） | 追加 |
| masked_identifier | VARCHAR(50) | マスク済み識別子 | 追加 |
| status | VARCHAR(20) | 決済状態 | 追加 |
| created_at | TIMESTAMP WITH TZ | 作成日時 | 追加 |

## ビジネスルール

- カード番号は外部決済機関 API 経由でトークン化し、RDB にはトークンのみ保存（PCI DSS スコープ削減）
- 決済情報（token）は RDB に保存する際に AES-256 で暗号化する（NFR E.6.1.1）
- 1人のユーザーに複数の決済方法を登録可能（予約時に選択）
- Luhn チェックはバックエンドでも実施（フロントエンドのみに依存しない）

## ティア完了条件（BDD）

```gherkin
Feature: 決済方法を設定する - バックエンド API

  Scenario: クレジットカードを正常に登録する
    Given 利用者ID「user-001」のトークンが有効
    When POST /api/v1/payment-methods に {"payment_type":"credit_card","card_number":"4111111111111111","expiry":"12/28","cvv":"123"} を送信する
    Then HTTP 201 と、masked_identifier="**** **** **** 1111"・status="決済手段登録済み" のレスポンスが返る

  Scenario: 無効なカード番号でバリデーションエラーが返る
    Given 利用者ID「user-001」のトークンが有効
    When POST /api/v1/payment-methods に {"payment_type":"credit_card","card_number":"1234567890123456","expiry":"12/28","cvv":"123"} を送信する
    Then HTTP 400 と {"error": "invalid card information"} が返る
```
