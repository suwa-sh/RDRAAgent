# 共通コンポーネント設計

## レイアウトシェル

### UserPortalShell
- **用途**: 利用者ポータルの共通レイアウト（ヘッダー + コンテンツ + ボトムタブ）
- **利用UC**: 会議室を照会する, 会議室を予約する, 予約を変更する, 予約を取消する, 鍵を受け取る, オーナーに問合せる, 会議室を評価する, ホストを評価する, サービスに問合せる
- **Props**: children, activeTab
- **コンポーネント構成**: Logo (icon), Button (ghost) x nav, Badge (info) x notification

### OwnerPortalShell
- **用途**: オーナーポータルの共通レイアウト（サイドバー + メインコンテンツ）
- **利用UC**: 規約を参照する, オーナーを登録する, オーナー申請する, 会議室を登録する, 運用ルールを設定する, 会議室評価を確認する, プロフィールを編集する, 利用許諾を判定する, 鍵を貸出する, 鍵を返却する, 利用者を評価する, 問合せに回答する, 評価結果を確認する, オーナー退会する, 精算結果を確認する
- **Props**: children, activeSidebarItem
- **コンポーネント構成**: Logo (full), Button (ghost) x sidebar nav

### AdminPortalShell
- **用途**: 管理者ポータルの共通レイアウト（サイドバー + メインコンテンツ）
- **利用UC**: オーナー登録を審査する, 退会を処理する, 手数料売上を分析する, 運用状況を管理する, 利用履歴を管理する, 利用状況を分析する, サービス問合せに回答する, 精算額を計算する, 精算を実行する
- **Props**: children, activeSidebarItem
- **コンポーネント構成**: Logo (icon), Button (ghost) x sidebar nav

## 共通フィードバックコンポーネント

### StatusBadge
- **用途**: 全ステータスモデル（オーナー申請状態、予約状態、問合せ状態）の統一Badge表示
- **利用UC**: オーナー申請する, オーナー登録を審査する, 会議室を予約する, 予約を変更する, 予約を取消する, 利用許諾を判定する, 鍵を貸出する, 鍵を返却する, オーナーに問合せる, 問合せに回答する, サービスに問合せる, サービス問合せに回答する
- **ベースコンポーネント**: Badge
- **Props**: model (string: オーナー/予約/問合せ), status (string), size (sm/md)
- **design-event.yaml 参照**: OwnerStatusBadge, ReservationStatusBadge, InquiryStatusBadge を統合ラッパー化

### EmptyState
- **用途**: データ0件時の空状態表示（アイコン + メッセージ + CTA）
- **利用UC**: 会議室を照会する, 評価結果を確認する, 利用履歴を管理する, 精算結果を確認する
- **Props**: icon (ReactNode), title (string), description (string), action (ReactNode)

### LoadingSkeleton
- **用途**: データ取得中のSkeleton UI
- **利用UC**: 全UC（全画面共通）
- **Props**: variant (card/table/form/detail), count (number)

### ErrorBanner
- **用途**: APIエラー時のバナー表示（メッセージ + リトライボタン）
- **利用UC**: 全UC（全画面共通）
- **Props**: message (string), onRetry (function), dismissible (boolean)

### ProcessingState
- **用途**: 非同期処理中の進捗表示（スピナー + メッセージ）
- **利用UC**: 会議室を予約する, 精算を実行する, オーナー申請する
- **Props**: message (string), progress (number, optional)

## 共通モーダルコンポーネント

### ConfirmActionModal
- **用途**: 破壊的操作の確認ダイアログ（取消・退会・精算実行等）
- **利用UC**: 予約を取消する, オーナー退会する, 精算を実行する, 退会を処理する
- **Props**: title (string), message (string), confirmLabel (string), onConfirm (function), onCancel (function), variant (default/destructive)
- **ベースコンポーネント**: Card + Button (destructive) + Button (outline)

## 共通フォームコンポーネント

### EntityEditForm
- **用途**: エンティティ編集フォーム共通パターン（入力 -> バリデーション -> 確認 -> 送信）
- **利用UC**: オーナーを登録する, プロフィールを編集する, 会議室を登録する, 運用ルールを設定する
- **Props**: fields (FieldConfig[]), onSubmit (function), initialValues (object), submitLabel (string)
- **ベースコンポーネント**: Input + Button

## 共通一覧コンポーネント

### SearchFilterPanel
- **用途**: 検索・フィルター条件の入力パネル
- **利用UC**: 会議室を照会する, 利用履歴を管理する, 利用状況を分析する
- **Props**: filters (FilterConfig[]), onFilter (function), onReset (function)
- **ベースコンポーネント**: Input + Button (outline)

### PaginatedList
- **用途**: ページネーション付き一覧表示
- **利用UC**: 会議室を照会する, 評価結果を確認する, 利用履歴を管理する, 精算結果を確認する, 会議室評価を確認する
- **Props**: items (array), renderItem (function), page (number), totalPages (number), onPageChange (function)
- **ベースコンポーネント**: Card + Button (outline)
