# UI デザイン仕様

## レイアウトパターン

### 利用者ポータル (user)

- **レイアウト構成**: ヘッダー + コンテンツ（サイドバーなし）
- **ヘッダー**: 固定。Logo (full) + プライマリナビ + ユーザーメニュー
- **サイドバー**: なし（シンプルなコンシューマー向け）
- **コンテンツエリア**: 最大幅 1280px、中央寄せ
- **プライマリカラー**: Blue 600 (#2563EB)

### オーナーポータル (owner)

- **レイアウト構成**: サイドバー + ヘッダー + メインコンテンツ
- **ヘッダー**: 固定。Logo (icon) + パンくずリスト + 通知ベル + ユーザーメニュー
- **サイドバー**: 左固定、折りたたみ可能（240px → 64px）。プライマリナビを縦配置
- **コンテンツエリア**: フルwidth（サイドバー分を差し引き）
- **プライマリカラー**: Teal 600 (#0D9488)

### 管理者ポータル (admin)

- **レイアウト構成**: サイドバー + ヘッダー + メインコンテンツ
- **ヘッダー**: 固定。Logo (icon) + パンくずリスト + 通知ベル + ユーザーメニュー
- **サイドバー**: 左固定、折りたたみ可能（240px → 64px）。プライマリナビを縦配置
- **コンテンツエリア**: フルwidth（サイドバー分を差し引き）
- **プライマリカラー**: Slate 700 (#334155)

### 共通レイアウト要素

| 要素 | デザインシステムコンポーネント | 配置 |
|------|------------------------------|------|
| ロゴ | Logo (full / icon / stacked) | ヘッダー左端 / サイドバー上部 |
| プライマリナビ | - (ポータル別に実装) | ヘッダー中央 / サイドバー |
| ユーザーメニュー | Button (variant: ghost) + ドロップダウン | ヘッダー右端 |
| 通知ベル | Badge (variant: notification) | ヘッダー右端 |
| パンくずリスト | - (セマンティックHTML) | ヘッダー下 / コンテンツ上 |
| フッター | - (利用者ポータルのみ) | ページ最下部 |

## レスポンシブ戦略

### ブレイクポイント

| 名称 | 幅 | レイアウト変更 |
|------|---|-------------|
| Mobile | < 640px | サイドバー非表示→ハンバーガーメニュー。カード1列。テーブル→カード切替 |
| Tablet | 640px - 1024px | サイドバー折りたたみ状態。カード2列。テーブル横スクロール |
| Desktop | > 1024px | サイドバー展開。カード3-4列。テーブル通常表示 |

### モバイル対応方針

- **ナビゲーション**: 利用者ポータル=ボトムタブバー（検索・予約・問合せ・マイページ）、オーナー/管理者=ハンバーガーメニュー
- **テーブル**: 5列以下はそのまま横スクロール、6列以上はカード表示に切替
- **フォーム**: スタック表示（横並び禁止）。入力フィールドは十分なタッチターゲット（44px以上）
- **会議室カード**: 1列表示。画像は横幅100%。スワイプで次のカードへ

## デザインシステムコンポーネント利用ガイドライン

### コンポーネント選定ルール

| 用途 | 推奨コンポーネント | 非推奨 | 理由 |
|------|-----------------|--------|------|
| 会議室一覧表示 | RoomCard | テーブル行 | 画像・評価・価格を視覚的に表現できる |
| 予約カレンダー | BookingCalendar | 日付入力 | 空き状況を直感的に表示 |
| 予約ステータス | ReservationStatusBadge | テキスト | 色とラベルで即座に状態把握 |
| 評価入力 | StarRating | 数値入力 | 直感的な5段階評価 |
| オーナー認証状態 | OwnerVerificationBadge | テキスト | 認証済みの信頼感を視覚表現 |
| 料金表示 | PriceDisplay | テキスト | 通貨フォーマット・割引表示を統一 |
| 鍵状態管理 | KeyHandoverTracker | テキスト | 貸出/返却のステップを視覚的に追跡 |
| 精算サマリー | SettlementSummaryCard | テーブル | 金額情報をカードで見やすく |
| 問合せスレッド | InquiryThread | テーブル | チャット形式で対話を時系列表示 |
| 検索フィルター | SearchFilter | チェックボックス群 | 折りたたみ可能な構造化フィルター |
| 主要アクション | Button (variant: primary) | リンク | 操作の重要度を視覚的に表現 |
| 情報カード | Card | div | 一貫した角丸・影・パディング |
| テキスト入力 | Input | textarea | 1行入力はInputで統一 |
| ステータス表示 | Badge | テキスト | カラートークンと連動した状態表示 |

### 状態表示パターン

| 状態モデル | 状態 | 表示方法 | コンポーネント | カラートークン |
|-----------|------|---------|-------------|-------------|
| オーナー | 審査待ち | Badge | Badge (variant: warning) | amber-500 |
| オーナー | 登録済み | Badge | OwnerVerificationBadge | green-600 |
| オーナー | 却下 | Badge | Badge (variant: destructive) | red-600 |
| オーナー | 退会 | Badge | Badge (variant: secondary) | gray-500 |
| 予約 | 申請 | Badge | ReservationStatusBadge | amber-500 |
| 予約 | 確定 | Badge | ReservationStatusBadge | green-600 |
| 予約 | 変更 | Badge | ReservationStatusBadge | blue-600 |
| 予約 | 取消 | Badge | ReservationStatusBadge | red-600 |
| 会議室 | 非公開 | Badge | Badge (variant: secondary) | gray-500 |
| 会議室 | 公開可能 | Badge | Badge (variant: outline) | amber-500 |
| 会議室 | 公開中 | Badge | Badge (variant: default) | green-600 |
| 鍵 | 保管中 | ステッパー | KeyHandoverTracker | gray-500 |
| 鍵 | 貸出中 | ステッパー | KeyHandoverTracker | blue-600 |
| 鍵 | 返却済み | ステッパー | KeyHandoverTracker | green-600 |
| 決済 | 未登録 | Badge | Badge (variant: secondary) | gray-500 |
| 決済 | 決済手段登録済み | Badge | Badge (variant: outline) | blue-600 |
| 決済 | 引き落とし済み | Badge | Badge (variant: default) | green-600 |
| 精算 | 未精算 | Badge | Badge (variant: secondary) | gray-500 |
| 精算 | 精算計算済み | Badge | Badge (variant: outline) | blue-600 |
| 精算 | 支払済み | Badge | Badge (variant: default) | green-600 |
| 問合せ | 未対応 | Badge | Badge (variant: warning) | amber-500 |
| 問合せ | 回答済み | Badge | Badge (variant: default) | blue-600 |
| 問合せ | 対応済み | Badge | Badge (variant: default) | green-600 |

## ダークモード対応方針

- **切替方式**: システム設定連動 + 手動切替トグル（ヘッダーのユーザーメニュー内）
- **トークン戦略**: design-event.yaml の primitive tokens を CSS 変数化し、dark テーマで上書き。背景は gray-900、テキストは gray-50
- **注意事項**:
  - チャートの色はダークモードで明度を上げる（視認性確保）
  - 画像オーバーレイのコントラストを調整
  - 影(shadow)はダークモードでは不要 → border で代替
