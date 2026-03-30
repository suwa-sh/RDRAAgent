# 共通コンポーネント設計

## 概要

全 UC の tier-frontend.md を俯瞰して抽出した、複数 UC で共通して使われるコンポーネントパターン。

## 共通レイアウトシェル

### UserPortalShell

- **用途**: User ポータルの全画面で使用するレイアウトシェル
- **構成**: ヘッダー（Logo icon + ナビ + ユーザーメニュー）+ コンテンツ + フッター
- **利用UC**: 会議室を検索する、予約を登録する、予約を変更する、予約を取消する、鍵の返却を記録する、会議室評価を登録する
- **インポート**: `@/components/common/UserPortalShell`

### OwnerPortalShell

- **用途**: Owner ポータルの全画面で使用するレイアウトシェル
- **構成**: サイドバー（Logo full + メニュー）+ ヘッダー（通知 + ユーザーメニュー）+ コンテンツ
- **利用UC**: プロフィールを登録する、オーナー申請を登録する、会議室を登録する、運用ルールを設定する、会議室評価を照会する、利用者評価を照会する、鍵の貸出を記録する、利用者評価を登録する、問合せ回答を登録する、退会を申請する
- **インポート**: `@/components/common/OwnerPortalShell`

### AdminPortalShell

- **用途**: Admin ポータルの全画面で使用するレイアウトシェル
- **構成**: サイドバー（Logo full + メニュー）+ ヘッダー（通知 + ユーザーメニュー）+ コンテンツ
- **利用UC**: オーナー申請を審査する、退会を処理する、手数料売上を照会する、利用状況を照会する、問合せ対応を登録する、精算額を計算する、精算を実行する
- **インポート**: `@/components/common/AdminPortalShell`

## 共通フィードバックコンポーネント

### StatusBadge

- **用途**: 各種状態モデルの状態表示を統一するバッジ
- **Props**: status: string, colorMap: Record<string, string>
- **利用UC**: オーナー申請を審査する（オーナー申請状態）、予約を登録する/変更する/取消する（予約状態）、鍵の貸出を記録する/返却を記録する（鍵状態、会議室利用状態）
- **インポート**: `@/components/common/StatusBadge`

### EmptyState

- **用途**: データがない場合の空状態表示
- **Props**: title: string, description: string, actionLabel?: string, onAction?: () => void
- **利用UC**: 会議室を検索する（検索結果0件）、会議室評価を照会する（評価0件）、利用状況を照会する（履歴0件）
- **インポート**: `@/components/common/EmptyState`

### LoadingSkeleton

- **用途**: データ取得中のSkeleton UI表示
- **Props**: variant: "card" | "table" | "form", count?: number
- **利用UC**: 全画面のデータ取得時
- **インポート**: `@/components/common/LoadingSkeleton`

### ErrorBanner

- **用途**: APIエラー時のエラーバナー表示
- **Props**: message: string, onRetry?: () => void
- **利用UC**: 全画面のAPIエラー時
- **インポート**: `@/components/common/ErrorBanner`

### ProcessingState

- **用途**: 非同期処理の進行中状態表示
- **Props**: title: string, description: string
- **利用UC**: 精算を実行する（処理中表示）
- **インポート**: `@/components/common/ProcessingState`

## 共通モーダル

### ConfirmActionModal

- **用途**: 破壊的操作・重要操作前の確認ダイアログ
- **Props**: title: string, message: string, confirmLabel: string, onConfirm: () => void, onCancel: () => void, variant?: "default" | "destructive"
- **利用UC**: 退会を申請する、予約を取消する、精算を実行する
- **インポート**: `@/components/common/ConfirmActionModal`

## 共通フォームパターン

### EntityEditForm

- **用途**: 情報の登録・編集フォームの統一パターン（入力→バリデーション→送信→完了）
- **Props**: fields: FieldConfig[], onSubmit: (data) => Promise<void>, submitLabel: string
- **利用UC**: プロフィールを登録する、会議室を登録する、運用ルールを設定する
- **インポート**: `@/components/common/EntityEditForm`

## 共通一覧パターン

### SearchFilterPanel

- **用途**: 一覧画面のフィルター・ソートパネル
- **Props**: filters: FilterConfig[], onFilterChange: (filters) => void
- **利用UC**: 会議室を検索する、会議室評価を照会する
- **インポート**: `@/components/common/SearchFilterPanel`

### PaginatedList

- **用途**: ページネーション付き一覧表示
- **Props**: items: T[], total: number, page: number, perPage: number, onPageChange: (page) => void, renderItem: (item: T) => ReactNode
- **利用UC**: 会議室を検索する、会議室評価を照会する、手数料売上を照会する、利用状況を照会する
- **インポート**: `@/components/common/PaginatedList`
