# インフラ設計変換 推論根拠

## 入力サマリ

| 項目 | 値 |
|------|-----|
| arch event_id | 20260328_120000_initial_arch |
| NFR event_id | 20260328_100000_virtual_room_nfr |
| システム名 | 貸し会議室SaaS |
| 対象クラウド | aws（foundation scope: full_stack） |

## 変換結果

| ワークロード特性 | 推論値 | 根拠 |
|-----------------|--------|------|
| workload_type | web_app | tier-frontend-user, tier-frontend-admin（SPA）+ tier-backend-api が存在。フロントエンド有 + バックエンド有 → web_app |
| availability_target.sla | 99.9% | NFR A.1.1.1(grade 4: 24h運用) + A.2.1.1(grade 4: N+1自動切替) → SLA変換テーブルで 99.9% |
| availability_target.failover | warm_standby | NFR A.1.2.1(grade 3: 60分未満) → フェイルオーバー変換テーブルで warm_standby |
| latency_sensitivity.category | interactive | workload_type が web_app → interactive |
| latency_sensitivity.target_p99 | 500ms | NFR B.2.1.1(grade 3: 5秒以内) → レスポンスタイム変換テーブルで 500ms |
| data_sensitivity.classification | restricted | NFR E.5.1.1(grade 2: OIDC) + PII属性（オーナー情報に氏名・メールアドレス、利用者情報に氏名・メールアドレス） → restricted |
| data_sensitivity.pii | true | 情報.tsv: オーナー情報（氏名、メールアドレス）、利用者情報（氏名、メールアドレス）に PII 属性検出 |
| data_sensitivity.encryption | at_rest_and_in_transit | NFR E.6.1.1(grade 1: 機密データのみ暗号化) + E.6.1.2(grade 2: 全通信暗号化) → at_rest_and_in_transit |
| data_sensitivity.compliance | [] | 決済処理は外部の決済機関に委託しており、カード情報を自システムで保持・処理しないため PCI DSS 対象外 |
| data_sensitivity.data_residency | none | NFR E.5〜E.6 に地域制約の記載なし |
| traffic_pattern.type | steady | B.2.3.1 不在。tier-backend-worker にタイマー系CronJobあるが主要ワークロードではない。ピーク倍率は grade 2（2倍）で spike 閾値（5倍以上）未満 |
| traffic_pattern.baseline_rps | 50 | NFR B.2.1.2(grade 3: ~100 TPS) → 変換テーブルで 50 |
| traffic_pattern.spike_multiplier | 2 | NFR B.1.2.1(grade 2: 通常時の2倍) → 変換テーブルで 2（B.2.3.1 不在のため B.1.2.1 で代用） |
| consistency_needs.type | strong | data_architecture.entities で event_snapshot が多数（E-001, E-002, E-005, E-006, E-007, E-008, E-009）。さらに決済関連エンティティ（E-008 決済情報、E-016 精算情報、E-017 オーナー精算）があり strong に強制 |
| recovery_target.rpo | 1h | NFR A.4.1.1(grade 3: 障害直前まで) → RPO変換テーブルで "1h"（grade 3） |
| recovery_target.rto | 4h | NFR A.4.1.2(grade 3: 2時間以内) → RTO変換テーブルで "4h"（grade 3） |
| recovery_target.backup | daily | NFR C.1.2.1(grade 3: 継続的バックアップ) → バックアップ変換テーブルで "daily" |
| observability_needs.metrics | 7項目 | NFR C.1.3.1(grade 3: +アプリケーション監視) → フル監視メトリクスセット |
| observability_needs.logs | 4カテゴリ | NFR C.6.1.1(grade 4: 1年保管) + arch CLP-003 ロギング方針（access, audit, diagnostic, dependency） |
| observability_needs.sli | 4指標 | NFR C.1.3(grade 3) → availability, latency, error_rate, throughput |
| observability_needs.alerting | 3項目 | arch CTP-005 ヘルスチェック方針 → health_check, error_rate, latency_p99 |
| cost_posture.strategy | balanced | A平均(important metrics): ~3.1, B平均(important metrics): ~2.7 → 両方 3以上ではないが 2以下でもない → balanced |

## NFR グレードマッピング

| NFR ID | grade | 推論先 | 変換値 |
|--------|-------|--------|--------|
| A.1.1.1 | 4 | availability_target.sla | 99.9%（A.2.1.1 grade 4 との組合せ） |
| A.1.2.1 | 3 | availability_target.failover | warm_standby |
| A.2.1.1 | 4 | availability_target.sla | 99.9%（A.1.1.1 grade 4 との組合せ） |
| A.4.1.1 | 3 | recovery_target.rpo | 1h |
| A.4.1.2 | 3 | recovery_target.rto | 4h |
| B.1.2.1 | 2 | traffic_pattern.spike_multiplier | 2 |
| B.2.1.1 | 3 | latency_sensitivity.target_p99 | 500ms |
| B.2.1.2 | 3 | traffic_pattern.baseline_rps | 50 |
| C.1.2.1 | 3 | recovery_target.backup | daily |
| C.1.3.1 | 3 | observability_needs.metrics / sli | フル監視セット |
| C.6.1.1 | 4 | observability_needs.logs | 4カテゴリ |
| E.5.1.1 | 2 | data_sensitivity.classification | restricted（PII との組合せ） |
| E.6.1.1 | 1 | data_sensitivity.encryption | at_rest_and_in_transit（E.6.1.2 との組合せ） |
| E.6.1.2 | 2 | data_sensitivity.encryption | at_rest_and_in_transit（E.6.1.1 との組合せ） |
