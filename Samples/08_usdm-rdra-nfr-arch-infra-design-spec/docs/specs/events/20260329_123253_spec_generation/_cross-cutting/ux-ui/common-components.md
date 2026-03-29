# 共通コンポーネント設計

全 UC Spec の tier-frontend-user.md / tier-frontend-admin.md を横断的に分析し、
複数 UC で共通して利用されるコンポーネントパターンを抽出する。
design-event.yaml の既存コンポーネントとの関係も整理する。

---

## 1. 共通レイアウトシェル

### 1.1 UserPortalShell（利用者・オーナー向けポータル共通レイアウト）

全 UC の `/rooms/*`・`/owner/*`・`/reservations/*`・`/reviews/*`・`/inquiries/*`・`/settings/*` で共通して使われるシェル。

**適用 UC（代表）**:
- 会議室を検索する（`/rooms/search`）
- 会議室の詳細を確認する（`/rooms/:room_id`）
- 予約を申請する（`/rooms/:room_id/reserve`）
- 会議室を登録する（`/owner/rooms/new`）
- 精算結果を確認する（`/owner/settlements`）

**構成要素**:
| 要素 | デザインシステムコンポーネント | 配置 |
|------|------------------------------|------|
| サービスロゴ | Logo (variant: icon_with_text) | ヘッダー左 |
| プライマリナビゲーション | Button (variant: ghost) × N | ヘッダー中央〜右 |
| ユーザーアバター + ドロップダウン | Avatar, Dropdown | ヘッダー右 |
| メインコンテンツエリア | - | ヘッダー下・最大幅 1200px |
| フッター | - | ページ最下部 |

**ロール別ナビゲーション分岐**:
```
利用者:     会議室を探す / 予約履歴 / マイレビュー / 問合せ履歴 / 設定
オーナー:   マイ会議室 / 予約管理 / 精算 / 評価 / 設定
共通:       ログアウト
```

**デザイントークン参照**:
| 用途 | トークン |
|------|---------|
| ヘッダー背景 | `var(--semantic-background)` |
| ナビゲーションアクティブ | `var(--portal-primary)` = `#2563EB`（利用者）/ `#0D9488`（オーナー） |
| ボーダー | `var(--semantic-border)` = `#E2E8F0` |

---

### 1.2 AdminPortalShell（管理者向けポータル共通レイアウト）

全 UC の `/admin/*` で共通して使われるシェル。

**適用 UC（代表）**:
- オーナー登録審査一覧を確認する（`/admin/owners`）
- 手数料売上を分析する（`/admin/fee-sales`）
- 利用状況を分析する（`/admin/usage-analytics`）
- 利用履歴を管理する（`/admin/usage-history`）
- 問合せに対応する（`/admin/inquiries`）
- 精算額を計算する（`/admin/settlements`）
- 精算を実行する（`/admin/settlements/:id/execute`）

**構成要素**:
| 要素 | デザインシステムコンポーネント | 配置 |
|------|------------------------------|------|
| サービスロゴ（管理版） | Logo (variant: icon_with_text) | サイドバー上部 |
| サイドナビゲーション | Button (variant: ghost) × N | サイドバー（固定幅 240px） |
| ページタイトル + パンくず | Badge, - | ヘッダーバー |
| メインコンテンツエリア | - | サイドバー右・最大幅 calc(100vw - 240px) |

**サイドナビゲーション項目**:
```
ダッシュボード / オーナー審査 / 利用状況分析 / 手数料売上 / 精算管理 / 問合せ対応
```

**デザイントークン参照**:
| 用途 | トークン |
|------|---------|
| サイドバー背景 | `var(--semantic-surface)` = `#F8FAFC` |
| アクティブ項目 | `var(--portal-admin-primary)` = `#1D4ED8` |

---

## 2. 共通フォームパターン

### 2.1 EntityEditForm（エンティティ編集フォーム汎用パターン）

以下の UC で同一パターンの「単一エンティティ編集フォーム」が繰り返し出現する:
- 会議室情報を変更する（`RoomEditForm`）
- オーナー情報を変更する（`OwnerProfileEditForm`）
- 運用ルールを設定する（`OperationRulesForm`）
- キャンセルポリシーを設定する（`CancelPolicyForm`）

**共通 Props インターフェース**:
```typescript
interface EntityEditFormProps<T> {
  initialValues: T;          // 現在値（プリフィル用）
  onSave: (values: T) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}
```

**共通内部状態パターン**:
| 状態 | 型 | 用途 |
|------|---|------|
| `formValues` | T | 編集中の値 |
| `isDirty` | boolean | 変更検知（保存ボタン活性化制御） |
| `isSaving` | boolean | 保存中ローディング |
| `errors` | Record\<string, string\> | フィールドエラー |

**共通コンポーネント構成**:
```
EntityEditForm
  ├─ Input (variant: default) × N  ← フォームフィールド
  ├─ Button (variant: default, size: md)  ← 保存ボタン（isDirty=true 時活性化）
  ├─ Button (variant: outline, size: md)  ← キャンセルボタン
  └─ Badge (variant: success)  ← 保存成功バナー（保存後3秒表示）
```

**デザインシステムとの対応**:
| コンポーネント | design-event.yaml 対応 |
|--------------|----------------------|
| `Input` | `InputField` コンポーネント |
| `Button (default)` | `PrimaryButton` コンポーネント |
| `Button (outline)` | `SecondaryButton` コンポーネント |
| `Badge (success)` | `StatusBadge (variant: success)` コンポーネント |

---

### 2.2 SearchFilterPanel（検索フィルターパネル汎用パターン）

以下の UC で検索フィルタパターンが出現する:
- 会議室を検索する（`RoomSearchFilterPanel`）
- オーナー登録審査一覧を確認する（`OwnerReviewFilter`）
- 利用履歴を管理する（`UsageHistoryFilter`）
- 利用状況を分析する（`UsageAnalyticsFilter`）
- 手数料売上を分析する（`FeeSalesFilter`）
- 問合せに対応する（`InquiryListFilter`）

**共通 Props インターフェース**:
```typescript
interface SearchFilterPanelProps<F> {
  initialValues?: F;
  onSearch: (values: F) => void;
  onClear: () => void;
  isLoading?: boolean;
}
```

**共通コンポーネント構成**:
```
SearchFilterPanel
  ├─ Input / Select × N  ← 絞り込み条件フィールド
  ├─ Button (variant: primary)  ← 検索実行ボタン
  └─ Button (variant: ghost)   ← 条件クリアボタン
```

**特殊パターン — 動的フィールド切替**:
会議室種別（物理/バーチャル）の選択で表示フィールドが切り替わるパターン（`会議室を検索する`）。
会議室種別 enum が変わるたびに検索フィルタの構造が動的変化する。

```typescript
// 会議室種別に応じた動的フィールド制御
const virtualFields = ["meeting_tool_type", "max_connections"];
const physicalFields = ["area", "capacity", "amenities"];
```

---

### 2.3 ConfirmActionModal（確認ダイアログ汎用パターン）

以下の UC で「操作前確認ダイアログ」パターンが出現する:
- 予約を取り消す（`ReservationCancelConfirmModal`）
- 退会を申請する（`WithdrawalConfirmModal`）
- 精算を実行する（`SettlementExecuteConfirmModal`）
- 会議室の公開状態を変更する（状態遷移確認）
- 予約を審査する（許諾/却下確認）
- オーナー登録を審査する（承認/却下確認）

**共通 Props インターフェース**:
```typescript
interface ConfirmActionModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel?: string;
  variant?: "default" | "destructive";
  onConfirm: () => Promise<void>;
  onCancel: () => void;
  isProcessing?: boolean;
}
```

**共通コンポーネント構成**:
```
ConfirmActionModal (Modal)
  ├─ Modal.Header   ← タイトル
  ├─ Modal.Body     ← 説明文・影響範囲サマリー
  └─ Modal.Footer
       ├─ Button (variant: default / destructive)  ← 確認実行
       └─ Button (variant: outline)                ← キャンセル
```

---

## 3. 共通一覧パターン

### 3.1 PaginatedList（ページネーション付き一覧汎用パターン）

以下の UC で「ページネーション付きデータ一覧」パターンが出現する:
- オーナー登録審査一覧を確認する
- 利用履歴を管理する
- 問合せに対応する（管理者）
- 問合せ一覧（利用者）
- 会議室の評価を確認する
- 利用者の評価を確認する
- 利用者評価一覧を確認する
- 精算一覧（管理者・オーナー）

**共通 Props インターフェース**:
```typescript
interface PaginatedListProps<T> {
  items: T[];
  total: number;
  page: number;
  perPage: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
  emptyMessage?: string;
}
```

**共通コンポーネント構成**:
```
PaginatedList
  ├─ (items.length === 0) → EmptyState コンポーネント
  ├─ (isLoading) → Skeleton × perPage
  ├─ DataTable / CardList  ← アイテム表示（用途により切替）
  └─ Pagination
       ├─ Button (variant: outline) ← 前ページ
       ├─ Button (variant: outline) × N  ← ページ番号
       └─ Button (variant: outline) ← 次ページ
```

**2つのバリアント**:
| バリアント | 使用 UC | 表示形式 |
|-----------|--------|---------|
| `DataTable` | 管理者向け一覧（審査、問合せ、精算、利用履歴） | テーブル形式（ソート対応） |
| `CardGrid` | 会議室検索結果、評価一覧 | カード形式（`RoomCard`, `ReviewCard`） |

---

### 3.2 RoomCard（会議室カード）

物理・バーチャルの会議室情報を表示するカードコンポーネント。

**適用 UC**:
- 会議室を検索する
- 会議室の詳細を確認する（関連会議室一覧内）
- バーチャル会議室を予約する（検索結果内）

**Props**:
```typescript
interface RoomCardProps {
  roomId: string;
  name: string;
  roomType: "physical" | "virtual";
  area?: string;
  capacity: number;
  pricePerHour: number;
  facilities?: string[];
  imageUrl?: string;
  avgRating?: number;
  toolType?: "Zoom" | "Teams" | "Google Meet";
  maxConnections?: number;
  variant?: "physical" | "virtual";
  onClick?: () => void;
}
```

**コンポーネント構成**:
```
RoomCard
  ├─ ImagePlaceholder / img  ← 会議室画像（virtual時はツールアイコン）
  ├─ Badge (variant: info)   ← 物理バッジ（Blue）
  │  または Badge (variant: virtual)  ← バーチャルバッジ（Violet）
  ├─ StarRating (readonly)   ← 評価スコア（var(--semantic-rating)=#FBBF24）
  ├─ PriceDisplay            ← 時間単価（¥X,XXX/h）
  └─ MeetingToolBadge        ← バーチャル時のみ（Zoom/Teams/Google Meet）
```

**design-event.yaml との対応**:
| 本コンポーネント | design-event.yaml |
|----------------|------------------|
| `RoomCard` | `Card` コンポーネント（カスタマイズ） |
| `StarRating` | `RatingDisplay` コンポーネント |
| `PriceDisplay` | `PriceTag` コンポーネント |
| `Badge (virtual)` | `StatusBadge (variant: virtual, color: violet)` |

---

### 3.3 StatusBadge（状態表示バッジ）

RDRA 状態モデルの状態値を視覚的に表示するバッジ。

**適用 UC（全状態モデルで使用）**:
- オーナー状態（審査待ち / 登録済み / 却下 / 退会）
- 会議室状態（非公開 / 公開可能 / 公開中）
- 予約状態（申請 / 確定 / 変更 / 取消）
- 問合せ状態（未対応 / 回答済み / 対応済み）
- 精算状態（未精算 / 精算計算済み / 支払済み）
- 決済状態（未登録 / 決済手段登録済み / 引き落とし済み）
- 鍵状態（保管中 / 貸出中）

**カラーマッピング**:
| 状態 | variant | カラートークン |
|------|---------|-------------|
| 審査待ち / 申請 / 未対応 / 未精算 | `warning` | `var(--semantic-warning)` = `#D97706` |
| 登録済み / 確定 / 公開中 / 支払済み / 引き落とし済み | `success` | `var(--semantic-success)` = `#16A34A` |
| 却下 / 取消 | `error` | `var(--semantic-error)` = `#DC2626` |
| 退会 / 非公開 | `neutral` | `var(--semantic-muted)` = `#64748B` |
| 公開可能 / 変更 / 回答済み / 精算計算済み | `info` | `var(--semantic-info)` = `#2563EB` |
| 貸出中 | `active` | `var(--portal-primary)` = `#0D9488` |

**Props**:
```typescript
interface StatusBadgeProps {
  status: string;
  model: "owner" | "room" | "reservation" | "inquiry" | "settlement" | "payment" | "key" | "usage";
  size?: "sm" | "md";
}
```

---

## 4. 共通状態表示パターン

### 4.1 EmptyState（空状態）

データが0件の場合に表示するパターン。以下の UC で出現する:
- 会議室を検索する（検索結果0件）
- 利用者評価一覧（評価なし）
- 問合せ一覧（問合せなし）
- 精算一覧（精算なし）

**Props**:
```typescript
interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void };
}
```

---

### 4.2 LoadingSkeleton（ローディング骨格）

API レスポンス待機中のスケルトン UI。全 UC の一覧・詳細画面で使用。

**バリアント**:
| バリアント | 使用場面 |
|-----------|---------|
| `CardSkeleton` | 会議室検索結果（20枚） |
| `TableRowSkeleton` | 管理者向けテーブル一覧 |
| `DetailSkeleton` | 会議室詳細・精算詳細 |
| `FormSkeleton` | フォームの初期読み込み（プリフィル待ち） |

---

### 4.3 ErrorBanner（エラーバナー）

API エラー・認可エラー発生時の通知表示。全 UC で共通して出現。

**パターン**:
| HTTP ステータス | 表示メッセージパターン | コンポーネント |
|---------------|---------------------|-------------|
| 400 | フィールド別エラーメッセージ（フォーム内インライン） | Input の error prop |
| 401 | 「セッションが切れました。ログインし直してください。」 | Toast (variant: error) |
| 403 | 「この操作を行う権限がありません。」 | Banner (variant: error) |
| 404 | 「リソースが見つかりませんでした。」 | Banner (variant: error) |
| 409 | 「既に処理済みです。画面を更新してください。」 | Banner (variant: warning) |
| 5xx | 「サーバーエラーが発生しました。しばらく後に再試行してください。」 | Toast (variant: error) |

---

### 4.4 ProcessingState（処理中状態表示）

非同期処理（精算実行・精算支払連携等）の進行状態を表示するパターン。

**適用 UC**:
- 精算を実行する（SQS 非同期処理のポーリング表示）
- バーチャル会議室利用を開始する / 終了する（CronJob 処理待ち）

**表示遷移**:
```
[実行ボタン押下]
  ↓
[処理中スピナー + 「処理中です。しばらくお待ちください。」]
  ↓ ポーリング（5秒間隔）
[完了 → StatusBadge (success)] or [失敗 → ErrorBanner]
```

---

## 5. design-event.yaml との対応整理

| 本設計の共通コンポーネント | design-event.yaml の既存コンポーネント | 差分・追加が必要なもの |
|--------------------------|---------------------------------------|-------------------|
| `UserPortalShell` | `Layout` (base layout) | ロール別ナビ分岐ロジックの追加 |
| `AdminPortalShell` | `Layout` (sidebar variant) | サイドバーレイアウトバリアント追加 |
| `EntityEditForm` | `InputField`, `PrimaryButton`, `SecondaryButton` | `isDirty` による保存ボタン活性化パターン |
| `SearchFilterPanel` | `InputField`, `Button` | フィルタパネルコンテナとして新規追加 |
| `ConfirmActionModal` | `Modal` | `destructive` variant の追加 |
| `PaginatedList` | `Card`, `Button` | テーブルバリアント・ページネーション UI 追加 |
| `RoomCard` | `Card` | 会議室特化のカスタマイズ（StarRating、PriceDisplay 統合） |
| `StatusBadge` | `StatusBadge` | 状態モデル全7種のカラーマッピング拡充 |
| `EmptyState` | なし（新規） | 新規追加 |
| `LoadingSkeleton` | なし（新規） | 各バリアント新規追加 |
| `ErrorBanner` / `Toast` | `Toast`, `Banner` | HTTP ステータス別メッセージマッピング追加 |
| `ProcessingState` | なし（新規） | 非同期ポーリング状態表示として新規追加 |

---

## 6. Storybook Story 対応表

各共通コンポーネントに対応する Storybook Story ファイルパス（`docs/design/latest/storybook-app/` 配下）:

| コンポーネント | Story ファイル |
|-------------|-------------|
| `UserPortalShell` | `src/stories/layout/UserPortalShell.stories.tsx` |
| `AdminPortalShell` | `src/stories/layout/AdminPortalShell.stories.tsx` |
| `EntityEditForm` | `src/stories/forms/EntityEditForm.stories.tsx` |
| `SearchFilterPanel` | `src/stories/forms/SearchFilterPanel.stories.tsx` |
| `ConfirmActionModal` | `src/stories/modals/ConfirmActionModal.stories.tsx` |
| `PaginatedList` | `src/stories/data/PaginatedList.stories.tsx` |
| `RoomCard` | `src/stories/cards/RoomCard.stories.tsx` |
| `StatusBadge` | `src/stories/badges/StatusBadge.stories.tsx` |
| `EmptyState` | `src/stories/feedback/EmptyState.stories.tsx` |
| `LoadingSkeleton` | `src/stories/feedback/LoadingSkeleton.stories.tsx` |
| `ErrorBanner` | `src/stories/feedback/ErrorBanner.stories.tsx` |
| `ProcessingState` | `src/stories/feedback/ProcessingState.stories.tsx` |
