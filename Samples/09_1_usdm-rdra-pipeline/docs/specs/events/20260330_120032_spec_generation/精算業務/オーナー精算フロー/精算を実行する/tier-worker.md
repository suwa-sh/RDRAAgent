# 精算を実行する - バックエンドワーカー仕様

## 変更概要

MQから精算実行メッセージを受信し、決済機関APIを呼び出して精算を実行する。

## イベント処理仕様

### SettlementExecutionHandler

- **トリガー**: settlement-queue からのメッセージ受信
- **入力チャネル**: settlement-queue
- **出力チャネル**: settlement-result-queue（精算結果通知）
- **AsyncAPI**: [asyncapi.yaml](../../_cross-cutting/api/asyncapi.yaml) の `channels.settlement-queue` を参照

#### 処理フロー

1. settlement-queue からメッセージを受信
2. 精算情報をDBから取得
3. 精算実行条件を検証（精算額 > 0）
4. 決済機関APIを呼び出し
5. 精算結果に基づいてステータスを更新（完了/失敗）
6. settlement-result-queue に結果を通知

#### エラーハンドリング

| エラー種別 | リトライ | DLQ | 説明 |
|-----------|---------|-----|------|
| 決済機関一時エラー | Yes（指数バックオフ、最大3回） | No | ネットワーク障害等の一時的エラー |
| 決済機関永続エラー | No | Yes | 口座閉鎖等の恒久的エラー |
| DB更新エラー | Yes（最大2回） | Yes | トランザクション失敗 |

## データモデル変更

### settlements テーブル

| カラム | 型 | 説明 | 変更種別 |
|--------|---|------|---------|
| status | VARCHAR(20) | 完了/失敗に更新 | 更新 |
| executed_at | TIMESTAMP | 精算実行日時 | 更新 |
| payment_ref | VARCHAR(100) | 決済機関の取引参照番号 | 更新 |

## ビジネスルール

- 精算実行条件: 月末時点の利用履歴に基づき精算額が0より大きいこと
- 精算額0のオーナーは決済機関連携をスキップし「完了（精算額0）」で更新
- ジョブ実行IDで二重実行を検知（冪等性保証）
- リトライは指数バックオフ（初回1秒、最大3回）

## ティア完了条件（BDD）

```gherkin
Feature: 精算を実行する - バックエンドワーカー

  Scenario: 決済機関との精算連携成功
    Given settlement-queue にオーナー「鈴木花子」の精算メッセージが到着
    And 精算額が150000円
    When SettlementExecutionHandler が処理する
    Then 決済機関APIが呼び出される
    And settlements テーブルの status が「完了」に更新される
    And settlement-result-queue に成功メッセージがパブリッシュされる

  Scenario: 決済機関一時エラー時のリトライ
    Given 決済機関APIが503エラーを返す
    When SettlementExecutionHandler が処理する
    Then 1秒後にリトライされる
    And 最大3回リトライ後に status が「失敗」に更新される
```
