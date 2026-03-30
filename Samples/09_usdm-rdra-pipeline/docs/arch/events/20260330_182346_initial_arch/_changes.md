# 変更サマリ

- event_id: 20260330_182346_initial_arch
- trigger_event: rdra:20260330_180653_initial_build, nfr:20260330_181637_initial_nfr

## 追加

### technology_context
- languages: TypeScript
- frameworks: Next.js, Hono
- constraints: モノレポ構成、ベンダーニュートラル

### system_architecture/tiers
- tier-frontend: フロントエンド（SSR/SPA）
- tier-api-gateway: API Gateway（WAF + RBAC）
- tier-idp: IdP（マネージド IdP）
- tier-backend-api: バックエンド API（CaaS(k8s)）
- tier-backend-worker: バックエンドワーカー（CronJob(k8s)/FaaS）
- tier-datastore: データストア（RDB + KVS）
- tier-external: 外部連携（決済機関アダプタ）

### system_architecture/cross_tier_policies
- CTP-001 〜 CTP-031: 認証方式、認可方式、構造化ログ、IdP、冪等性、ヘルスチェック、監査ログ、障害検知・通知、災害対策、RTO、セキュリティ、各種運用方針

### system_architecture/cross_tier_rules
- CTR-001 〜 CTR-005: 通信暗号化、API バージョニング、エラーレスポンス形式、障害復旧方式、監視間隔

### app_architecture/tier_layers
- tier-frontend: 3層（view → state management → api client）
- tier-backend-api: 4層（presentation → usecase → domain → gateway）
- tier-backend-worker: 4層（presentation → usecase → domain → gateway）

### data_architecture/entities
- E-001: オーナー情報（event_snapshot）
- E-002: サービス規約（resource_scd2）
- E-003: 会議室情報（resource_mutable）
- E-004: 運用ルール（resource_mutable）
- E-005: 鍵情報（event_snapshot）
- E-006: 予約情報（event_snapshot）
- E-007: 利用者情報（event_snapshot）
- E-008: 会議室評価（event）
- E-009: 利用者評価（event）
- E-010: 問合せ（event_snapshot）
- E-011: 手数料情報（event）
- E-012: 利用履歴（event）
- E-013: 売上実績（event）
- E-014: 精算情報（event）
- E-015: セッション情報（resource_mutable）

### data_architecture/storage_mapping
- E-001 〜 E-014: rdb
- E-015: cache

## 変更
- なし（初期構築）

## 削除
- なし（初期構築）
