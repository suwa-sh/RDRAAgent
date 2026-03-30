# 共通コンポーネント設計

## 共通レイアウトシェル

### UserPortalShell
- **用途**: 利用者ポータルの共通レイアウト（ヘッダー + コンテンツ + ボトムナビ）
- **利用 UC**: 会議室を照会する, 会議室を予約する, 予約を変更する, 予約を取消する, 評価を登録する, 問合せを送信する, サービス問合せを送信する
- **構成**: Logo(icon) + ナビゲーション + ユーザーメニュー + ボトムタブバー(モバイル)

### OwnerPortalShell
- **用途**: オーナーポータルの共通レイアウト（サイドバー + ヘッダー + コンテンツ）
- **利用 UC**: オーナーを登録する, 会議室を登録する, 運用ルールを設定する, 利用者使用許諾する, 鍵を貸し出す, 鍵を返却する, 利用者評価を登録する, 会議室評価を確認する, 問合せに回答する, 利用実績を確認する, 売上実績を確認する, 精算内容を確認する
- **構成**: サイドバー(折りたたみ可) + Logo(full) + パンくず + ユーザーメニュー

### AdminPortalShell
- **用途**: 管理者ポータルの共通レイアウト（サイドバー + ヘッダー + コンテンツ）
- **利用 UC**: オーナー申請を審査する, 手数料売上を分析する, 利用履歴を管理する, 利用状況を分析する, サービス問合せに対応する, オーナー精算を実行する
- **構成**: サイドバー(固定) + Logo(full) + パンくず + 環境バッジ + ユーザーメニュー

## 共通フィードバックコンポーネント

### EmptyState
- **用途**: データが存在しない場合の空状態表示
- **利用 UC**: 会議室を照会する, 会議室評価を確認する, 利用実績を確認する, 売上実績を確認する, 精算内容を確認する, 利用履歴を管理する, 手数料売上を分析する
- **Props**: icon(Icon), title(string), description(string), action?(Button)

### LoadingSkeleton
- **用途**: データ取得中のスケルトンUI表示
- **利用 UC**: 全28 UC（全画面共通）
- **Props**: variant("card"|"table"|"form"|"list"), count(number)

### ErrorBanner
- **用途**: APIエラー時のエラー通知バナー
- **利用 UC**: 全28 UC（全画面共通）
- **Props**: message(string), type("error"|"warning"), onDismiss(function)

### ProcessingState
- **用途**: 処理実行中の状態表示（精算実行等）
- **利用 UC**: オーナー精算を実行する
- **Props**: title(string), progress?(number), description?(string)

## 共通モーダルコンポーネント

### ConfirmActionModal
- **用途**: 破壊的操作の確認ダイアログ（退会、予約取消、精算実行）
- **利用 UC**: オーナー退会する, 予約を取消する, オーナー精算を実行する
- **Props**: title(string), message(string), confirmLabel(string), cancelLabel(string), variant("destructive"|"warning"), onConfirm(function), onCancel(function)

## 共通フォームコンポーネント

### EntityEditForm
- **用途**: エンティティ（オーナー、会議室、運用ルール等）の入力フォーム
- **利用 UC**: オーナーを登録する, 会議室を登録する, 運用ルールを設定する
- **Props**: fields(FieldConfig[]), onSubmit(function), submitLabel(string), isLoading(boolean)

## 共通一覧コンポーネント

### SearchFilterPanel
- **用途**: 検索条件パネル（フィルター + ソート + 期間選択）
- **利用 UC**: 会議室を照会する, 利用履歴を管理する, 利用状況を分析する, 手数料売上を分析する
- **Props**: filters(FilterConfig[]), onFilterChange(function), onReset(function)

### PaginatedList
- **用途**: ページネーション付きリスト表示
- **利用 UC**: 会議室を照会する, 会議室評価を確認する, 利用履歴を管理する, 精算内容を確認する
- **Props**: items(any[]), totalCount(number), page(number), perPage(number), onPageChange(function), renderItem(function)
