# 精算を実行する - バックエンド API 仕様

## 変更概要

精算実行APIを実装する。精算状態を「処理中」に更新し、MQに精算実行メッセージをパブリッシュする。

## API 仕様

### 精算実行 API

- **メソッド**: POST
- **パス**: /api/v1/admin/settlements/{id}/actions/execute
- **認証**: Bearer JWT（運営担当者ロール）
- **OpenAPI**: [openapi.yaml](../../_cross-cutting/api/openapi.yaml) 参照

#### リクエスト

| パラメータ | 型 | 必須 | 説明 |
|-----------|---|------|------|
| id | string(path) | Yes | 精算ID |

#### レスポンス

| フィールド | 型 | 説明 |
|-----------|---|------|
| id | string | 精算ID |
| ownerId | string | オーナーID |
| ownerName | string | オーナー名 |
| targetMonth | string | 対象月（YYYY-MM） |
| amount | integer | 精算額（円） |
| status | string | 精算状態（処理中） |

#### エラーレスポンス

| ステータスコード | 条件 | レスポンス |
|----------------|------|-----------|
| 404 | 精算IDが存在しない | {"code": "SETTLEMENT_NOT_FOUND", "message": "精算情報が見つかりません"} |
| 409 | 既に実行済み | {"code": "ALREADY_EXECUTED", "message": "この精算は既に実行されています"} |

## 非同期イベント

### settlement.execute

- **チャネル**: settlement-queue
- **方向**: publish
- **AsyncAPI**: [asyncapi.yaml](../../_cross-cutting/api/asyncapi.yaml) の `channels.settlement-queue` を参照

## データモデル変更

### settlements テーブル

| カラム | 型 | 説明 | 変更種別 |
|--------|---|------|---------|
| status | VARCHAR(20) | 精算状態→「処理中」に更新 | 更新 |

## ビジネスルール

- 精算は冪等キーで二重実行を防止
- 精算状態が「計算済み」の場合のみ実行可能
- MQ パブリッシュ成功後に HTTP 202 を返す

## ティア完了条件（BDD）

```gherkin
Feature: 精算を実行する - バックエンド API

  Scenario: 精算実行APIの正常呼出し
    Given 精算ID「settle-001」が「計算済み」状態
    When POST /api/v1/admin/settlements/settle-001/actions/execute をリクエストする
    Then HTTP 202 が返る
    And status が「処理中」である
    And settlement-queue にメッセージがパブリッシュされる
```
