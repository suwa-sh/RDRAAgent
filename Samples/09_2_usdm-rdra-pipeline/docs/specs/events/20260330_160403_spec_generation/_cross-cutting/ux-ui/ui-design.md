# UI デザイン仕様

## レイアウトパターン

### 利用者ポータル

- **レイアウト構成**: ヘッダー + コンテンツ（モバイルファースト）
- **ヘッダー**: 固定。Logo(icon) + ナビゲーション + ユーザーメニュー
- **サイドバー**: なし（モバイル優先のためヘッダーナビ + ボトムナビ）
- **コンテンツエリア**: 最大幅 1280px、センタリング
- **プライマリカラー**: var(--color-blue-600) (#2563EB)

### オーナーポータル

- **レイアウト構成**: サイドバー + ヘッダー + メインコンテンツ
- **ヘッダー**: 固定。Logo(full) + パンくずリスト + ユーザーメニュー
- **サイドバー**: 折りたたみ可能（幅 16rem）。アイコン + テキストのナビゲーション
- **コンテンツエリア**: フル幅（サイドバーを除く）
- **プライマリカラー**: var(--color-teal-600) (#0D9488)

### 管理者ポータル

- **レイアウト構成**: サイドバー + ヘッダー + メインコンテンツ
- **ヘッダー**: 固定。Logo(full) + パンくずリスト + ユーザーメニュー + 環境バッジ
- **サイドバー**: 固定（折りたたみ不可）。アイコン + テキストのナビゲーション
- **コンテンツエリア**: フル幅（サイドバーを除く）
- **プライマリカラー**: var(--color-slate-700) (#334155)

### 共通レイアウト要素

| 要素 | デザインシステムコンポーネント | 配置 |
|------|------------------------------|------|
| ロゴ | Logo (full / icon) | ヘッダー左 |
| ナビゲーション | Button (ghost), Icon | サイドバー / ヘッダー |
| ユーザーメニュー | Button (ghost), Badge | ヘッダー右 |
| 通知バッジ | Badge (info) | ヘッダー右 |
| ステータス表示 | StatusBadge | コンテンツ内 |
| パンくずリスト | Button (ghost) chain | ヘッダー下 |

## レスポンシブ戦略

### ブレイクポイント

| 名称 | 幅 | レイアウト変更 |
|------|---|-------------|
| Mobile | < 640px | シングルカラム、ボトムナビ（利用者）、サイドバー非表示（オーナー/管理者）、テーブル→カード表示 |
| Tablet | 640px - 1024px | 2カラムグリッド、サイドバー折りたたみ、テーブル横スクロール |
| Desktop | > 1024px | フルレイアウト、サイドバー展開、テーブル通常表示 |

### モバイル対応方針

- **ナビゲーション**: 利用者ポータルはボトムタブバー（検索/予約/問合せ/マイページ）。オーナー/管理者はハンバーガーメニュー
- **テーブル**: 640px 未満でカード形式に切替。横スクロールは Tablet 以上
- **フォーム**: 入力フィールドをスタック配置。ステッパー形式でセクション分割
- **カレンダー**: モバイルでは日付ピッカーに切替（BookingCalendar のモバイル対応）
- **タッチターゲット**: 最小 44px x 44px（WCAG 2.5.5 準拠）

## デザインシステムコンポーネント利用ガイドライン

### コンポーネント選定ルール

| 用途 | 推奨コンポーネント | 非推奨 | 理由 |
|------|-----------------|--------|------|
| 主要アクション | Button (default) | Button (ghost) | 主アクションは視覚的に目立たせる |
| 補助アクション | Button (outline) | Button (default) | 視覚的階層を分ける |
| 破壊的操作 | Button (destructive) | Button (default, 赤色) | 意図しない操作を防ぐ |
| ステータス表示 | StatusBadge | テキストのみ | 色とアイコンで直感的に伝達 |
| 評価表示 | StarRating (readonly) | テキスト「4.5点」 | 視覚的に評価を把握 |
| 評価入力 | StarRating (interactive) | Input (number) | タップ/クリックで直感的 |
| 金額表示 | PriceDisplay | テキスト | 通貨フォーマットの統一 |
| カード表示 | Card (default) | div + border | 影とパディングの統一 |
| カード選択 | Card (hoverable) | Card (default) | ホバー効果でクリッカブルを示唆 |
| 問合せスレッド | InquiryThread | テキスト一覧 | タイムライン形式で文脈保持 |
| 集計サマリー | SummaryCard | テキスト + 数値 | トレンド表示で変化を伝達 |
| 予約情報 | ReservationCard | Card + テキスト | 予約固有の表示パターン |
| 検索フィルター | SearchFilter | Input + Select | 検索条件のグルーピング |
| 進捗表示 | StepTracker | テキスト「ステップ 2/4」 | 視覚的な進捗把握 |

### 状態表示パターン

| 状態モデル | 表示方法 | コンポーネント | カラートークン |
|-----------|---------|-------------|-------------|
| オーナー状態: 未登録 | Badge | StatusBadge | gray |
| オーナー状態: 申請中 | Badge | StatusBadge | blue |
| オーナー状態: 審査中 | Badge | StatusBadge | amber |
| オーナー状態: 承認済 | Badge | StatusBadge | green |
| オーナー状態: 却下 | Badge | StatusBadge | red |
| オーナー状態: 退会 | Badge | StatusBadge | gray |
| 予約状態: 予約申請中 | Badge | StatusBadge | blue |
| 予約状態: 予約確定 | Badge | StatusBadge | green |
| 予約状態: 変更中 | Badge | StatusBadge | amber |
| 予約状態: 取消済 | Badge | StatusBadge | red |
| 予約状態: 利用済 | Badge | StatusBadge | gray |
| 鍵状態: 保管中 | Badge | StatusBadge | gray |
| 鍵状態: 貸出中 | Badge | StatusBadge | amber |
| 鍵状態: 返却済 | Badge | StatusBadge | green |
| 会議室状態: 未公開 | Badge | StatusBadge | gray |
| 会議室状態: 公開中 | Badge | StatusBadge | green |
| 会議室状態: 貸出停止 | Badge | StatusBadge | red |
| 会議室利用状態: 利用前 | Badge | StatusBadge | gray |
| 会議室利用状態: 利用中 | Badge | StatusBadge | blue |
| 会議室利用状態: 利用終了 | Badge | StatusBadge | green |

## ダークモード対応方針

- **切替方式**: システム設定連動 + 手動切替（トグルスイッチ）
- **トークン戦略**: design-event.yaml の dark_overrides を CSS カスタムプロパティで切替
  - 背景: #FFFFFF → #0F172A
  - 前景: #0F172A → #F8FAFC
  - ボーダー: #E2E8F0 → #334155
  - ミュート: #F1F5F9 → #1E293B
  - カード背景: #FFFFFF → #1E293B
- **注意事項**:
  - チャートの色はダークモード時にコントラストを確保する
  - 画像にはダークモード用の背景処理を適用しない（そのまま表示）
  - StatusBadge の色はライト/ダーク両方で視認性を確保する
