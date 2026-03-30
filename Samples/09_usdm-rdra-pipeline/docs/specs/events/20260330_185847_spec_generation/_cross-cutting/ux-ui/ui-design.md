# UI デザイン仕様

## レイアウトパターン

### 利用者ポータル

- **レイアウト構成**: ヘッダー + コンテンツ（モバイルファースト）
- **ヘッダー**: 固定。Logo(icon) + ナビゲーション + ユーザーメニュー
- **サイドバー**: なし（モバイルファーストのため、ハンバーガーメニューで代替）
- **コンテンツエリア**: 最大幅 1280px、センタリング
- **フッター**: 利用規約・プライバシーポリシーリンク

### オーナーポータル

- **レイアウト構成**: サイドバー + メインコンテンツ
- **ヘッダー**: 固定。Logo(full) + パンくず + ユーザーメニュー
- **サイドバー**: 折りたたみ可能。幅 256px。ナビゲーションメニュー
- **コンテンツエリア**: フル幅（サイドバー分を除く）
- **フッター**: なし（サイドバーレイアウト）

### 管理者ポータル

- **レイアウト構成**: サイドバー + メインコンテンツ
- **ヘッダー**: 固定。Logo(icon) + 「管理画面」ラベル + ユーザーメニュー
- **サイドバー**: 固定。幅 256px。ナビゲーションメニュー
- **コンテンツエリア**: フル幅（サイドバー分を除く）
- **フッター**: なし（サイドバーレイアウト）

### 共通レイアウト要素

| 要素 | デザインシステムコンポーネント | 配置 |
|------|------------------------------|------|
| ロゴ | Logo (full/icon/stacked) | ヘッダー左端 |
| ナビゲーション | Button (ghost) + Icon | サイドバーまたはヘッダー |
| パンくずリスト | Button (ghost) + Icon (chevron) | ヘッダー下部 |
| ユーザーメニュー | Button (ghost) + Card (dropdown) | ヘッダー右端 |
| 通知バッジ | Badge (info) | ヘッダーアイコン上 |

## レスポンシブ戦略

### ブレイクポイント

| 名称 | 幅 | レイアウト変更 |
|------|---|-------------|
| Mobile | < 640px | シングルカラム。ハンバーガーメニュー。カード縦スタック。テーブルはカード表示に切替 |
| Tablet | 640px - 1024px | 2カラムグリッド。サイドバー折りたたみ。フィルターはドロワーに格納 |
| Desktop | > 1024px | フルレイアウト。サイドバー展開。フィルター常時表示 |
| Wide | > 1280px | コンテンツ最大幅制限。余白拡大 |

### モバイル対応方針

- **ナビゲーション**: 利用者ポータルはボトムタブバー(最大5項目)。オーナー/管理者ポータルはハンバーガーメニュー
- **テーブル**: 640px未満ではカード表示に切替。5列超のテーブルは横スクロール可能
- **フォーム**: フォーム要素は縦スタック。ラベルはフィールド上部に配置。タッチターゲット48px以上
- **画像**: 会議室画像はアスペクト比維持でレスポンシブ。サムネイルはlazy loading
- **モーダル/ダイアログ**: モバイルではフルスクリーンシートに切替

## デザインシステムコンポーネント利用ガイドライン

### コンポーネント選定ルール

| 用途 | 推奨コンポーネント | 非推奨 | 理由 |
|------|-----------------|--------|------|
| 主要アクション | Button (default, lg) | テキストリンク | CTAは視覚的に目立つボタンで |
| 破壊的操作 | Button (destructive) | Button (default) | 取消・退会等は赤色で注意喚起 |
| ステータス表示 | OwnerStatusBadge / ReservationStatusBadge / InquiryStatusBadge | テキストのみ | 色コード付きBadgeで視覚的に識別 |
| 金額表示 | PriceDisplay | 素のテキスト | 通貨記号・桁区切り統一 |
| 評価表示 | StarRating (readonly) | 数値テキスト | 星アイコンで直感的に評価を把握 |
| 評価入力 | StarRating (interactive) | Select/Slider | タップ/クリックで直感的に入力 |
| 会議室一覧 | RoomCard (compact/detailed) | テーブル行 | 画像付きカードで魅力を訴求 |
| 日時選択 | BookingCalendar | テキスト入力 | カレンダーUIで空き状況を視覚化 |
| 検索フィルター | SearchFilter | 個別フォーム要素 | フィルターUIをパッケージ化 |
| スレッド表示 | InquiryThread | テーブル | メッセージ形式で自然な会話体験 |
| 集計表示 | DashboardChart | テーブルのみ | チャートで傾向を視覚的に把握 |

### 状態表示パターン

| 状態モデル | 表示方法 | コンポーネント | カラートークン |
|-----------|---------|-------------|-------------|
| オーナー申請状態: 未申請 | Badge | OwnerStatusBadge | var(--color-gray-500) |
| オーナー申請状態: 申請中 | Badge | OwnerStatusBadge | var(--color-blue-600) |
| オーナー申請状態: 審査中 | Badge | OwnerStatusBadge | var(--color-amber-600) |
| オーナー申請状態: 承認 | Badge | OwnerStatusBadge | var(--color-green-600) |
| オーナー申請状態: 却下 | Badge | OwnerStatusBadge | var(--color-red-600) |
| オーナー申請状態: 退会 | Badge | OwnerStatusBadge | var(--color-gray-500) |
| 予約状態: 仮予約 | Badge | ReservationStatusBadge | var(--color-amber-600) |
| 予約状態: 確定 | Badge | ReservationStatusBadge | var(--color-green-600) |
| 予約状態: 変更 | Badge | ReservationStatusBadge | var(--color-blue-600) |
| 予約状態: 利用中 | Badge | ReservationStatusBadge | var(--color-violet-600) |
| 予約状態: 利用完了 | Badge | ReservationStatusBadge | var(--color-green-600) |
| 予約状態: 取消 | Badge | ReservationStatusBadge | var(--color-red-600) |
| 問合せ状態: 受付 | Badge | InquiryStatusBadge | var(--color-blue-600) |
| 問合せ状態: 対応中 | Badge | InquiryStatusBadge | var(--color-amber-600) |
| 問合せ状態: 回答済 | Badge | InquiryStatusBadge | var(--color-green-600) |
| 問合せ状態: 完了 | Badge | InquiryStatusBadge | var(--color-gray-500) |

## ダークモード対応方針

- **切替方式**: システム設定連動 + 手動切替トグル（ヘッダーのユーザーメニュー内）
- **トークン戦略**: design-event.yaml の dark_overrides を使用。CSS カスタムプロパティで切替
- **注意事項**:
  - 画像・アイコンは dark/light 両方で視認性を確認
  - チャート（DashboardChart）の色はダークモード用パレットを別途定義
  - shadow はダークモードで stronger（0.3 opacity）に調整済み
  - 白背景の Card は gray-900 に、ボーダーは gray-800 に切替
