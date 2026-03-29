# 精算を実行する - FaaSワーカー仕様

## 変更概要

MQの精算支払連携イベントをトリガーに、決済機関への支払リクエストを実行するFaaSワーカーを追加する。冪等性保証・リトライ・DLQによる信頼性の高い非同期精算処理を実装する。

## イベント処理仕様

### 精算支払連携ハンドラー

- **トリガー**: MQメッセージ（`settlement.payment.requested` チャネル）
- **入力チャネル**: `settlement.payment.requested`
- **出力チャネル**: `settlement.payment.completed`（支払完了通知、オーナーメール送信用）
- **AsyncAPI**: [asyncapi.yaml](../../_cross-cutting/api/asyncapi.yaml) の `channels.settlement.payment.requested` を参照

#### 処理フロー

1. MQから精算支払連携イベントを受信する（settlement_id, owner_id, payment_amount, idempotency_key）
2. MQのMessageIdで重複メッセージを検知し、重複の場合はスキップして処理完了とする（CTP-012）
3. 決済機関APIに支払リクエストを送信する（冪等キーを含む）
4. 決済機関から支払完了通知（payment_gateway_id）を受信する
5. RDBのオーナー精算レコードを更新する（payment_gateway_id, payment_status='支払済み', payment_date=今日）
6. 精算情報の状態を「支払済み」に更新する
7. `settlement.payment.completed` チャネルに完了イベントを発行する（オーナーへの完了通知メール送信用）

#### エラーハンドリング

| エラー種別 | リトライ | DLQ | 説明 |
|-----------|---------|-----|------|
| 決済機関タイムアウト | Yes（最大3回、指数バックオフ） | Yes | タイムアウト時はリトライ後にDLQ退避。監視アラートを発火 |
| 決済機関エラー4xx | No | Yes | 入力エラー系はリトライ不可。DLQに退避して人的確認 |
| 決済機関エラー5xx | Yes（最大3回） | Yes | サーバーエラーはリトライ後にDLQ退避 |
| DB更新エラー | Yes（最大3回） | Yes | DB更新失敗時はリトライ後にDLQ退避 |
| 冪等キー重複 | No | No | 重複検知時はスキップして正常終了 |

**サーキットブレーカー（SP-013）**: 決済機関との通信障害が連続した場合、サーキットブレーカーをOPEN状態にして後続メッセージの処理を停止。監視アラートで運営担当者に通知。

#### FaaS実行時間制約

- 実行時間上限: 300秒（technology_context.constraints）
- 決済機関APIタイムアウト: 30秒/回
- リトライ間隔: 5秒・10秒・20秒（指数バックオフ）
- 合計最大時間: 約65秒（300秒以内に収まること）

## データモデル変更

### オーナー精算（owner_settlements テーブル）

FaaSワーカーが更新するカラム:

| カラム | 型 | 説明 | 変更種別 |
|--------|---|------|---------|
| payment_gateway_id | VARCHAR(100) | 決済機関連携ID（決済機関から受信） | 更新（NULL→値設定） |
| payment_date | DATE | 支払日（今日の日付） | 更新（NULL→今日） |
| payment_status | VARCHAR(20) | 支払状態: 支払済み | 更新（支払処理中→支払済み） |

## ビジネスルール

- FaaSワーカーは決済機関との直接通信を担当する（tier-external-integrationのアダプタパターンを経由）
- 冪等キーはBackend APIが生成したものをそのまま決済機関リクエストに使用する（二重支払防止）
- 決済機関からの支払完了通知受信後にのみRDBを「支払済み」に更新する
- 全通信ログ（リクエスト/レスポンス含む）を記録する（SR-009）
- FaaS実行時間上限（300秒）内に処理を完了すること
- MQの可視性タイムアウトをFaaSタイムアウト（300秒）と一致させること

## ティア完了条件（BDD）

```gherkin
Feature: 精算を実行する - FaaSワーカー

  Scenario: 精算支払連携イベントを受信して決済機関に支払を実行する
    Given MQに精算支払連携イベント{"settlement_id": "SETTLE-001", "payment_amount": 42000, "idempotency_key": "IKEY-001"}が存在する
    When FaaSワーカーがイベントを受信して処理する
    Then 決済機関に支払リクエスト（冪等キー: IKEY-001）が送信され、完了後にRDBのオーナー精算が支払済みに更新される

  Scenario: 決済機関タイムアウト時にリトライしてDLQに退避する
    Given MQに精算支払連携イベントが存在し、決済機関がタイムアウトを返す状況である
    When FaaSワーカーが最大3回リトライしても決済機関からの応答がない
    Then イベントがDLQに退避され、監視アラートが発火する

  Scenario: 重複メッセージを受信してもスキップされる
    Given MQにMessageId="MSG-001"の精算支払連携イベントが重複して存在し、既に処理済みである
    When FaaSワーカーが重複メッセージを受信する
    Then 重複を検知してスキップし、処理完了（ACK）を返す
```
