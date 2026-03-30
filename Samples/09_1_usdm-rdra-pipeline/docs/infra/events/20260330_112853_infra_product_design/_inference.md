# インフラ設計変換 推論根拠

## 入力サマリ

| 項目 | 値 |
|------|-----|
| arch event_id | 20260330_104847_initial_arch |
| NFR event_id | 20260330_094214_initial_nfr |
| システム名 | 貸し会議室サービス |
| 対象クラウド | aws（foundation-context の scope: full_stack から抽出） |

## 変換結果

| ワークロード特性 | 推論値 | 根拠 |
|-----------------|--------|------|
| workload_type | web_app | tier-frontend + tier-backend-api が存在。フロントエンド有は web_app 優先 |
| availability_target.sla | 99.9% | NFR A.1.1.1(grade 3) + A.2.1.1(grade 4): grade 3以下 + grade 4以上 → 99.9% |
| availability_target.failover | warm_standby | NFR A.1.2.1(grade 3): 60分未満 → warm_standby |
| latency_sensitivity.category | interactive | workload_type が web_app → interactive |
| latency_sensitivity.target_p99 | 500ms | NFR B.2.1.1(grade 3): 5秒以内 → 500ms |
| data_sensitivity.classification | restricted | NFR E.5.1.1(grade 3: MFA) + PII情報（氏名、連絡先、カード番号）→ restricted |
| data_sensitivity.pii | true | 情報.tsv にオーナープロフィール（氏名、連絡先）、決済情報（カード番号）が存在 |
| data_sensitivity.encryption | in_transit_only | NFR E.6.1.1(grade 1): 機密データのみ暗号化 → in_transit_only |
| data_sensitivity.compliance | ["PCI_DSS"] | E-007 決済情報にカード番号属性あり → PCI_DSS 対象 |
| data_sensitivity.data_residency | none | 特段のデータ居住性制約なし |
| traffic_pattern.type | steady | worker ティアは月末精算のみ。メイン は web_app で定常的アクセス |
| traffic_pattern.baseline_rps | 50 | NFR B.2.1.2(grade 3): 100 TPS。baseline は半分の50と推定 |
| traffic_pattern.spike_multiplier | 2 | NFR B.1.2.1(grade 2): 通常時の2倍 |
| consistency_needs.type | strong | 決済関連エンティティ（E-006予約, E-007決済情報, E-015精算情報）が存在 → strong に強制 |
| recovery_target.rpo | 24h | NFR A.4.1.1(grade 2): 数時間前まで → 24h |
| recovery_target.rto | 4h | NFR A.4.1.2(grade 3): 2時間以内 → 4h（変換テーブル grade 3 → 4h） |
| recovery_target.backup | daily | NFR C.1.2.1(grade 3): フル+増分バックアップ（日次）→ daily |
| observability_needs.metrics | [cpu, memory, disk, network, latency, error_rate, throughput] | NFR C.1.3.1(grade 3)以上 → フルメトリクス |
| observability_needs.logs | [access, audit, diagnostic, dependency] | NFR C.6.1.1(grade 4)以上 + arch のログ方針(CTR-006, CLR-003) |
| observability_needs.sli | [availability, latency, error_rate, throughput] | NFR C.1.3.1(grade 3)以上 → フルSLI |
| observability_needs.alerting | [health_check, error_rate, latency_p99] | cross_tier_policies CTP-005 ヘルスチェック方針が存在 |
| cost_posture.strategy | balanced | 可用性平均 grade ≈ 3.0, 性能平均 grade ≈ 2.5 → balanced |

## NFR グレードマッピング

| NFR ID | grade | 推論先 | 変換値 |
|--------|-------|--------|--------|
| A.1.1.1 | 3 | availability_target.sla | 99.9%（A.2.1.1 grade 4 と組み合わせ） |
| A.2.1.1 | 4 | availability_target.sla | 99.9% |
| A.1.2.1 | 3 | availability_target.failover | warm_standby |
| A.4.1.1 | 2 | recovery_target.rpo | 24h |
| A.4.1.2 | 3 | recovery_target.rto | 4h |
| B.2.1.1 | 3 | latency_sensitivity.target_p99 | 500ms |
| B.2.1.2 | 3 | traffic_pattern.baseline_rps | 50（100 TPS の半分） |
| B.1.2.1 | 2 | traffic_pattern.spike_multiplier | 2 |
| C.1.2.1 | 3 | recovery_target.backup | daily |
| C.1.3.1 | 3 | observability_needs.metrics/sli | フルメトリクス/フルSLI |
| C.6.1.1 | 4 | observability_needs.logs | フルログ |
| E.5.1.1 | 3 | data_sensitivity.classification | restricted |
| E.6.1.1 | 1 | data_sensitivity.encryption | in_transit_only |
