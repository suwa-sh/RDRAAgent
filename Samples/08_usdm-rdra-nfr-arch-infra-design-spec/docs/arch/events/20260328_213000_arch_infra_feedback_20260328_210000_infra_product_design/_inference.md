# アーキテクチャフィードバック 推論根拠

## トリガー

インフラ設計イベント `20260328_210000_infra_product_design` の MCL product-design 出力に基づく。

## フィードバック項目

### 技術制約の追加（3件）

| # | 制約 | 根拠 | 対象ファイル |
|---|------|------|------------|
| 1 | RDB 接続プール上限 200 | product-impl-aws.yaml → comp-rds parameter_group.max_connections: 200。マネージド RDB では接続数に上限があり、アプリケーション側で接続プールを適切に管理する必要がある | product-impl-aws.yaml |
| 2 | FaaS 実行時間上限 300秒 | product-impl-aws.yaml → comp-lambda-event-worker timeout: 300。通知処理に Lambda を採用するため、FaaS の実行時間制約をアーキテクチャ制約として明示する | product-impl-aws.yaml |
| 3 | MQ メッセージ可視性タイムアウトは FaaS タイムアウトと一致 | product-impl-aws.yaml → comp-sqs visibility_timeout: 300。MQ トリガーで FaaS を起動する場合、処理完了前にメッセージが再配信されないよう一致させる必要がある | product-impl-aws.yaml |

### クロスティアポリシーの追加（2件）

| # | ID | 名前 | 根拠 |
|---|-----|------|------|
| 1 | CTP-010 | SLI/SLO ベースのオブザーバビリティ方針 | product-observability.yaml → sli_slo セクションで API 可用性 99.9%、p99 500ms、エラーレート 0.1% の SLO が定義された。これをアーキテクチャ方針として明示し、エラーバジェットによる運用判断の根拠とする |
| 2 | CTP-011 | コスト最適化方針 | product-cost-hints.yaml → optimization_strategies で arm64 優先、非本番縮小構成、コミット割引の戦略が提案された。balanced コストポスチャをアーキテクチャ方針として明示する |

### PCI DSS 除外の判断

決済処理は外部の決済機関に委託しており、カード情報を自システムで保持・処理しないため、PCI DSS の対象外と判断。product-input.yaml の compliance から PCI_DSS を削除した。

### ストレージマッピング confidence

全 RDB エンティティ（E-001〜E-018）は MCL mapping で fidelity: "exact" が確認されたが、既に confidence: "high" のため昇格対象なし。
