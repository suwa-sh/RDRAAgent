# アーキテクチャ推論根拠サマリ

- event_id: 20260401_041408_logging_policy_enhancement
- created_at: 2026-04-01T04:14:08

## 推論元 NFR グレード

| NFR ID | 名前 | Lv | 影響範囲 |
|--------|------|-----|---------|
| C.3.1.1 | 障害検知方式 | Lv2 | WARN レベル劣化兆候ログ、動的ログレベル変更 |
| C.6.1.1 | ログ保管期間 | Lv4 | 監査ログの長期保持、ログローテーション方針 |
| C.6.1.2 | ログ種別 | Lv3 | 構造化ログ強制、アンチパターン防止 |
| E.7.1.1 | 監査ログ | Lv2 | 監査ログ保持期間（最長） |
| A.2.1.1 | サーバ内の冗長化 | Lv3 | 劣化兆候による異常インスタンス早期検知 |
| B.2.1.1 | レスポンスタイム | Lv3 | 非同期ログ出力、パフォーマンス影響考慮 |
| E.5.1.1 | 認証方式 | Lv2 | トークン期限ログ |
| E.6.1.1 | データ暗号化 | Lv1 | 機密情報マスキング |

## 設計判断サマリ

### 追加した cross_tier_policies

| ID | 名前 | confidence | 根拠 |
|----|------|-----------|------|
| CTP-032 | トレーサビリティ ID 体系 | medium | NFR C.1.3.1, C.6.1.1, C.6.1.2 |
| CTP-033 | ログ運用方針 | medium | NFR C.6.1.1, E.7.1.1, C.3.1.1, B.2.1.1 |

### 追加した cross_tier_rules

| ID | 名前 | confidence | 根拠 |
|----|------|-----------|------|
| CTR-006 | ログアンチパターン防止 | medium | NFR C.6.1.2, E.6.1.1, B.2.1.1 |

### 追加したレイヤーポリシー

| ID | ティア | レイヤー | 名前 | confidence | 根拠 |
|----|--------|---------|------|-----------|------|
| LP-016 | Frontend | view | トークン期限ログ | medium | NFR E.5.1.1, C.3.1.1 |
| LP-017 | Backend API | gateway | 劣化兆候ログ | medium | NFR C.3.1.1, A.2.1.1 |
| LP-018 | Backend API | gateway | キャッシュ劣化ログ | medium | NFR B.2.1.1, C.3.1.1 |
| LP-019 | Backend API | gateway | 楽観ロック競合ログ | medium | NFR B.2.1.1 |

### 追加した cross_layer_policies

| ID | ティア | 名前 | confidence | 根拠 |
|----|--------|------|-----------|------|
| CLP-004 | Backend API | ログ運用方針 | medium | NFR B.2.1.1, C.3.1.1 |
| CLP-005 | Backend API | ログアンチパターン防止 | medium | NFR C.6.1.2, E.6.1.1 |
| CLP-006 | Worker | ログ運用方針 | medium | NFR C.3.1.1 |
| CLP-007 | Worker | ログアンチパターン防止 | medium | NFR C.6.1.2, E.6.1.1 |

### 更新した cross_layer_rules

| ID | ティア | 名前 | 変更内容 |
|----|--------|------|---------|
| CLR-001 | Frontend | エラーハンドリング | 集約ポイント・cause chain・多重ログ防止を追加 |
| CLR-002 | Backend API | エラーハンドリング方針 | 集約ポイント・cause chain・多重ログ防止・gateway依存関係ログを追加 |
| CLR-003 | Backend API | ロギング方針 | 劣化兆候ログの記述を追加 |
| CLR-004 | Worker | エラーハンドリング方針 | 集約ポイント・cause chain・多重ログ防止を追加 |

## confidence 内訳

| セクション | high | medium | low | default | user | 合計 |
|-----------|:----:|:------:|:---:|:-------:|:----:|:----:|
| 追加（cross_tier） | 0 | 3 | 0 | 0 | 0 | 3 |
| 追加（layer） | 0 | 8 | 0 | 0 | 0 | 8 |
| 更新（cross_layer_rules） | 0 | 1 | 0 | 3 | 0 | 4 |
| 合計 | 0 | 12 | 0 | 3 | 0 | 15 |
