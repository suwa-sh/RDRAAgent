# 変更サマリ

- event_id: 20260401_041408_logging_policy_enhancement
- trigger_event: arch:logging_policy_inference_rules_enhancement

## 追加

- system_architecture/cross_tier_policies: CTP-032（トレーサビリティ ID 体系 - OpenTelemetry 標準）
- system_architecture/cross_tier_policies: CTP-033（ログ運用方針 - 非同期出力・ローテーション・保持期間・動的レベル変更）
- system_architecture/cross_tier_rules: CTR-006（ログアンチパターン防止 - 多重ログ禁止・catch握り潰し禁止等）
- app_architecture/tier_layers[tier-frontend]/layers[L-frontend-view]/policies: LP-016（トークン期限ログ）
- app_architecture/tier_layers[tier-backend-api]/cross_layer_policies: CLP-004（ログ運用方針）
- app_architecture/tier_layers[tier-backend-api]/cross_layer_policies: CLP-005（ログアンチパターン防止）
- app_architecture/tier_layers[tier-backend-api]/layers[L-backend-api-gateway]/policies: LP-017（劣化兆候ログ）
- app_architecture/tier_layers[tier-backend-api]/layers[L-backend-api-gateway]/policies: LP-018（キャッシュ劣化ログ）
- app_architecture/tier_layers[tier-backend-api]/layers[L-backend-api-gateway]/policies: LP-019（楽観ロック競合ログ）
- app_architecture/tier_layers[tier-backend-worker]/cross_layer_policies: CLP-006（ログ運用方針）
- app_architecture/tier_layers[tier-backend-worker]/cross_layer_policies: CLP-007（ログアンチパターン防止）

## 変更

- app_architecture/tier_layers[tier-frontend]/cross_layer_rules/CLR-001: エラーハンドリング description を拡充（集約ポイント・cause chain・多重ログ防止を追加）
- app_architecture/tier_layers[tier-backend-api]/cross_layer_rules/CLR-002: エラーハンドリング方針 description を拡充（集約ポイント・cause chain・多重ログ防止・gateway依存関係ログを追加）
- app_architecture/tier_layers[tier-backend-api]/cross_layer_rules/CLR-003: ロギング方針 description を拡充（劣化兆候ログの記述を追加）
- app_architecture/tier_layers[tier-backend-worker]/cross_layer_rules/CLR-004: エラーハンドリング方針 description を拡充（集約ポイント・cause chain・多重ログ防止を追加）

## 削除

- なし
