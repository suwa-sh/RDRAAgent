# 変更サマリ

- event_id: 20260330_152046_initial_arch
- trigger_event: rdra:20260330_150443_initial_build, nfr:20260330_151330_initial_nfr

## 追加

### technology_context
- languages: TypeScript
- frameworks: Next.js, Hono
- constraints: モノレポ構成, ベンダーニュートラル

### system_architecture/tiers
- tier-frontend（フロントエンド: 利用者・オーナー・運営向け Web UI）
- tier-api-gateway（API Gateway: ルーティング・認証・WAF）
- tier-idp（IdP: 認証基盤・MFA・トークン発行）
- tier-backend-api（バックエンド API: ビジネスロジック処理）
- tier-backend-worker（バックエンドワーカー: 精算バッチ・非同期処理）
- tier-datastore（データストア: RDB + KVS）
- tier-external（外部連携: 決済機関アダプタ）

### system_architecture/cross_tier_policies
- CTP-001: 認証方式（OAuth2/OIDC）
- CTP-002: 認可方式（RBAC + Backend 作り込み）
- CTP-003: 構造化ログと相関ID
- CTP-004: 冪等性方針
- CTP-005: ヘルスチェック
- CTP-006: IdP 方式（マネージド IdP）
- CTP-007: トークンライフサイクル管理

### system_architecture/cross_tier_rules
- CTR-001: 通信暗号化（TLS）
- CTR-002: エラー通知
- CTR-003: API バージョニング
- CTR-004: ネットワーク分離

### app_architecture/tier_layers
- tier-frontend: 3層（view, state, api-client）
- tier-backend-api: 4層（presentation, usecase, domain, gateway）
- tier-backend-worker: 4層（presentation, usecase, domain, gateway）

### data_architecture/entities
- E-001: オーナー情報（event_snapshot）
- E-002: オーナー申請（event）
- E-003: 会議室情報（event_snapshot）
- E-004: 運用ルール（resource_mutable）
- E-005: 鍵（event_snapshot）
- E-006: 予約情報（event_snapshot）
- E-007: 利用者評価（event）
- E-008: 会議室評価（event）
- E-009: 問合せ（event_snapshot）
- E-010: 利用実績（event_snapshot）
- E-011: 売上実績（event）
- E-012: 手数料売上（event）
- E-013: 精算情報（event）
- E-014: 利用履歴（event）
- E-015: 決済情報（resource_mutable）
- E-016: セッション情報（resource_mutable, cache）

### data_architecture/storage_mapping
- E-001〜E-015: rdb
- E-016: cache

## 変更
- なし（初期構築）

## 削除
- なし（初期構築）
