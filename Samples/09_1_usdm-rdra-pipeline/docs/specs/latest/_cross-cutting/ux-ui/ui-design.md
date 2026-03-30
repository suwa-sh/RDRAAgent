# UI デザイン仕様

## レイアウトパターン

### User ポータル

- **レイアウト構成**: ヘッダー + コンテンツ（モバイルファースト）
- **ヘッダー**: 固定。Logo(icon) + ナビゲーション + ユーザーメニュー
- **サイドバー**: なし（モバイルファーストのため、ハンバーガーメニューで対応）
- **コンテンツエリア**: 最大幅 1280px、中央寄せ
- **プライマリカラー**: var(--color-blue-600) #2563EB

### Owner ポータル

- **レイアウト構成**: サイドバー + メインコンテンツ
- **ヘッダー**: 固定。Logo(full) + 通知ベル + ユーザーメニュー
- **サイドバー**: 幅16rem（var(--component-sidebar-width)）、折りたたみ可能
- **コンテンツエリア**: サイドバー右側、パディング var(--spacing-6)
- **プライマリカラー**: var(--color-teal-600) #0D9488

### Admin ポータル

- **レイアウト構成**: サイドバー + メインコンテンツ
- **ヘッダー**: 固定。Logo(full) + 通知ベル + ユーザーメニュー
- **サイドバー**: 幅16rem（var(--component-sidebar-width)）、固定
- **コンテンツエリア**: サイドバー右側、パディング var(--spacing-6)
- **プライマリカラー**: var(--color-slate-700) #334155

### 共通レイアウト要素

| 要素 | デザインシステムコンポーネント | 配置 |
|------|------------------------------|------|
| ロゴ | Logo (full / icon) | ヘッダー左端 / サイドバー上部 |
| ナビゲーション | Button (ghost variant) | ヘッダー / サイドバー |
| 通知 | Badge (info variant) | ヘッダー右側 |
| ユーザーメニュー | Button (ghost) + ドロップダウン | ヘッダー右端 |
| フッター | テキスト | ページ下部（User ポータルのみ） |

## レスポンシブ戦略

### ブレイクポイント

| 名称 | 幅 | レイアウト変更 |
|------|---|-------------|
| Mobile | < 640px | シングルカラム。サイドバー非表示。ハンバーガーメニュー。テーブルはカード表示に変換 |
| Tablet | 640px - 1024px | 2カラム。サイドバー折りたたみ状態。テーブルは横スクロール |
| Desktop | > 1024px | フルレイアウト。サイドバー展開。テーブルフル表示 |

### モバイル対応方針

- **ナビゲーション**: User ポータルはハンバーガーメニュー + 下部タブバー（検索/予約/通知）。Owner/Admin はハンバーガーメニューのみ
- **テーブル**: モバイルではカード形式に切替。ソート・フィルターはアコーディオンで折りたたみ
- **フォーム**: 縦スタック表示。入力フィールドはフルwidth。ステッパー形式で段階表示
- **カレンダー**: BookingCalendar はモバイルで日単位表示に切替

## デザインシステムコンポーネント利用ガイドライン

### コンポーネント選定ルール

| 用途 | 推奨コンポーネント | 非推奨 | 理由 |
|------|-----------------|--------|------|
| 主要アクション | Button (default) | Button (ghost) | 視認性の確保 |
| 破壊的操作 | Button (destructive) | Button (default) | 操作の危険度を色で伝達 |
| 状態表示 | Badge / ReservationStatusBadge / KeyStatusBadge | テキストのみ | 状態の視認性向上 |
| 金額表示 | PriceDisplay | テキスト直書き | JPY フォーマットの統一 |
| 評価表示 | StarRating | テキスト数値 | 直感的な評価伝達 |
| 会議室カード | RoomCard | Card (default) | 会議室固有の情報レイアウト最適化 |
| 問合せ表示 | InquiryThread | カスタム実装 | スレッド表示の統一 |
| KPI表示 | SummaryCard | Card + テキスト | KPI固有のレイアウト最適化 |

### 状態表示パターン

| 状態モデル | 表示方法 | コンポーネント | カラートークン |
|-----------|---------|-------------|-------------|
| オーナー申請状態 - 申請中 | Badge | Badge (info) | var(--color-blue-600) |
| オーナー申請状態 - 審査中 | Badge | Badge (warning) | var(--color-orange-500) |
| オーナー申請状態 - 承認 | Badge | Badge (success) | var(--color-green-600) |
| オーナー申請状態 - 却下 | Badge | Badge (destructive) | var(--color-red-600) |
| オーナー申請状態 - 退会 | Badge | Badge (outline) | var(--color-gray-500) |
| 予約状態 - 仮予約 | Badge | ReservationStatusBadge | var(--color-amber-400) |
| 予約状態 - 予約確定 | Badge | ReservationStatusBadge | var(--color-green-600) |
| 予約状態 - 変更中 | Badge | ReservationStatusBadge | var(--color-orange-500) |
| 予約状態 - 取消済 | Badge | ReservationStatusBadge | var(--color-gray-500) |
| 予約状態 - 完了 | Badge | ReservationStatusBadge | var(--color-blue-600) |
| 会議室利用状態 - 利用前 | Badge | Badge (info) | var(--color-blue-600) |
| 会議室利用状態 - 利用中 | Badge | Badge (success) | var(--color-green-600) |
| 会議室利用状態 - 利用終了 | Badge | Badge (outline) | var(--color-gray-500) |
| 鍵状態 - 貸出中 | Badge | KeyStatusBadge | var(--color-orange-500) |
| 鍵状態 - 返却済 | Badge | KeyStatusBadge | var(--color-green-600) |

## ダークモード対応方針

- **切替方式**: システム設定連動 + 手動切替トグル（ヘッダーに配置）
- **トークン戦略**: design-event.yaml の `dark_overrides` を適用。semantic トークンで背景: var(--color-gray-950)、前景: var(--color-gray-100)、ボーダー: var(--color-gray-800)
- **注意事項**:
  - Card の影は dark 時に強め（0 4px 6px -1px rgba(0,0,0,0.3)）
  - テーブルヘッダーは var(--color-gray-900) に変更
  - 評価の空星は var(--color-gray-700) に変更
  - ホバー時の背景は var(--color-gray-800) に変更
