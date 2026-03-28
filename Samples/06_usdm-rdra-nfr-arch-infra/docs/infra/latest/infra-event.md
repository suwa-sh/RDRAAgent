# インフラ設計イベント

| 項目 | 値 |
|------|-----|
| イベント ID | 20260328_210000_infra_product_design |
| 作成日時 | 2026-03-28T21:00:00+09:00 |
| ソース | arch-design.yaml からのインフラ設計変換 |
| Arch 参照 | 20260328_120000_initial_arch |
| NFR 参照 | 20260328_100000_virtual_room_nfr |

## 変換サマリ

| 特性 | 値 |
|------|-----|
| ワークロードタイプ | web_app |
| 可用性 | 99.9% |
| レイテンシ p99 | 500ms |
| データ分類 | restricted |
| トラフィック | steady |
| 整合性 | strong |
| コスト方針 | balanced |
| 対象クラウド | aws |

## MCL 実行結果

| ステータス | completed |

### 出力ファイル

| パス | ステータス |
|------|-----------|
| specs/product/output/product-workload-model.yaml | generated |
| specs/product/output/product-mapping-aws.yaml | generated |
| specs/product/output/product-impl-aws.yaml | generated |
| specs/product/output/product-observability.yaml | generated |
| specs/product/output/product-cost-hints.yaml | generated |

## Arch フィードバック

### フィードバック項目

| ターゲット | アクション | 説明 |
|-----------|-----------|------|
| technology_context.constraints | add | RDB 接続プール上限 200（マネージド RDB 共通制約） |
| technology_context.constraints | add | FaaS 実行時間上限 300秒（サーバーレスランタイム共通制約） |
| technology_context.constraints | add | MQ メッセージ可視性タイムアウトは FaaS タイムアウトと一致させること（300秒） |
| system_architecture.tiers | add | tier-backend-worker を tier-cronjob-worker と tier-faas-worker に分割。CronJob は タイマー+バッチ、FaaS は MQ トリガーの通知処理に特化 |
| system_architecture.tiers[tier-faas-worker].policies | add | FaaS 通知処理方針（MQ トリガーの通知処理を FaaS で実行） |
| system_architecture.cross_tier_policies | add | SLI/SLO ベースのオブザーバビリティ方針（可用性 99.9%、p99 500ms、エラーレート 0.1%） |
| system_architecture.cross_tier_policies | add | コスト最適化方針（balanced ポスチャ、arm64 優先、非本番縮小構成） |
| system_architecture.cross_tier_policies | add | 冪等性方針（全ティア共通: FE冪等キー生成、API KVS重複検知、RDB ON CONFLICT、Worker MessageId検知） |
| system_architecture.cross_tier_policies[CTP-004] | upgrade | 構造化ログと相関ID: trace_id と冪等キーの関連を明記 |
