# インフラ設計からのアーキテクチャフィードバック

## 概要

MCL product-design の出力（product-workload-model.yaml, product-impl-aws.yaml, product-observability.yaml, product-cost-hints.yaml, product-mapping-aws.yaml）を分析し、ベンダーニュートラルな知見を arch-design.yaml にフィードバックした。

## フィードバック項目

### 1. 技術制約の追加（technology_context.constraints）

| # | 制約 | 根拠 |
|---|------|------|
| 1 | RDB 接続プール上限 200 | product-impl-aws.yaml: comp-database.configuration.parameters.max_connections: 200 |
| 2 | MQ メッセージ保持期間 最大14日 | product-impl-aws.yaml: comp-sqs.configuration.message_retention: 1209600 |
| 3 | MQ メッセージ可視性タイムアウト 300秒 | product-impl-aws.yaml: comp-sqs.configuration.visibility_timeout: 300 |
| 4 | API Gateway バースト上限 200, レート上限 100 req/s | product-impl-aws.yaml: comp-api-gateway.configuration.throttle |

### 2. クロスティアポリシーの追加（cross_tier_policies）

| # | ID | 名前 | 根拠 |
|---|-----|------|------|
| 1 | CTP-008 | SLI/SLO ベースのオブザーバビリティ | product-observability.yaml: sli_definitions, slo_definitions（可用性99%, p99 500ms, エラー率1%） |
| 2 | CTP-009 | 構造化ログカテゴリ分類 | product-observability.yaml: logging.log_groups（4カテゴリ、保持期間別） |
| 3 | CTP-010 | コスト最適化方針 | product-cost-hints.yaml: optimization_strategies（ライトサイジング、RI購入タイミング） |

### 3. クロスティアルールの追加（cross_tier_rules）

| # | ID | 名前 | 根拠 |
|---|-----|------|------|
| 1 | CTR-025 | Dead Letter Queue 監視 | product-impl-aws.yaml: comp-sqs.dead_letter_queue + product-observability.yaml: alerting.rules.sqs_dlq_messages |
| 2 | CTR-026 | VPC エンドポイント利用 | product-cost-hints.yaml: data_transfer + product-impl-aws.yaml: comp-vpc |

### 4. ティア固有ポリシーの追加

| # | ID | ティア | 名前 | 根拠 |
|---|-----|--------|------|------|
| 1 | SP-020 | tier-backend-worker | バッチジョブのスポット/プリエンプティブル適性 | product-cost-hints.yaml: compute_savings.comp-worker |
| 2 | SP-021 | tier-backend-api | オートスケーリング方針 | product-cost-hints.yaml: auto_scaling.comp-api + product-impl-aws.yaml: comp-api.auto_scaling |

### 5. ストレージマッピング confidence の昇格

| # | エンティティ | 変更前 | 変更後 | 根拠 |
|---|------------|--------|--------|------|
| 1 | E-004（運用ルール） | medium | high | product-mapping-aws.yaml: database_primary fidelity=exact |
| 2 | E-009（問合せ） | medium | high | product-mapping-aws.yaml: database_primary fidelity=exact |
| 3 | E-014（利用履歴） | medium | high | product-mapping-aws.yaml: database_primary fidelity=exact |

### 6. フィードバック対象外の理由

- **ティア分割**: MCL 出力で根本的に異なる実行モデルの混在は検出されなかった。CaaS(k8s) 上の API サーバとワーカーは既に別ティアに分離済み
- **ベンダー固有サービス名**: フィードバック項目にはベンダー固有サービス名（RDS, SQS 等）を含めず、ベンダーニュートラル表現（RDB, MQ 等）に統一
- **mapping fidelity gap**: 全マッピングが fidelity="exact" のため、gap/partial/workaround に起因するルール追加は不要

## 横断的関心事チェック結果

| 関心事 | MCL 検出状況 | arch 対応状況 | 追加フィードバック |
|--------|-------------|-------------|-----------------|
| 冪等性 | impl: DLQ設定、ON CONFLICT | CTP-004 で全ティアカバー済み | 不要 |
| トレーサビリティ | observability: trace_id, span_id 必須フィールド | CTP-003 で全ティアカバー済み | 不要 |
| エラーハンドリング | impl: サーキットブレーカー、DLQ | CTR-002 で全ティアカバー済み。DLQ 監視を CTR-025 で追加 | CTR-025 追加済み |
| 認証/認可 | impl: Lambda Authorizer (JWT) | CTP-001, CTP-002 で整合 | 不要 |
