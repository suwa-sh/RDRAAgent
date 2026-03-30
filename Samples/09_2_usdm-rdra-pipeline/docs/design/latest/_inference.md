# Design System 推論根拠

## event_id: 20260330_154625_design_system
## trigger_event: rdra:20260330_150443_initial_build, arch:20260330_153500_infra_feedback

---

## 1. ポータル構成

| ポータル | アクター | 社内外/立場 | カラー | 画面数 |
|---------|---------|------------|--------|--------|
| User | 利用者 | 社外/受益者 | Blue #2563EB | 7 |
| Owner | 会議室オーナー | 社外/提供者 | Teal #0D9488 | 15 |
| Admin | サービス運営担当者 | 社内/提供者 | Slate #334155 | 6 |

## 2. 画面一覧 (ポータル別)

### User ポータル (7画面)
- 会議室検索画面 → /rooms/search
- 会議室予約画面 → /rooms/:id/reserve
- 予約変更画面 → /reservations/:id/edit
- 予約取消画面 → /reservations/:id/cancel
- 評価登録画面 → /reservations/:id/review
- 問合せ送信画面 → /inquiries/new
- サービス問合せ画面 → /support/new

### Owner ポータル (15画面)
- オーナー登録画面 → /register
- 規約確認画面 → /register/terms
- オーナー申請画面 → /register/apply
- オーナー退会画面 → /settings/withdraw
- 会議室登録画面 → /rooms/new
- 運用ルール設定画面 → /rooms/:id/rules
- 会議室評価一覧画面 → /rooms/:id/reviews
- 利用者許諾画面 → /reservations/:id/approve
- 鍵管理画面 → /reservations/:id/key
- 鍵返却画面 → /reservations/:id/key-return
- 利用者評価登録画面 → /reservations/:id/rate-user
- 問合せ回答画面 → /inquiries/:id/reply
- 利用実績確認画面 → /analytics/usage
- 売上実績確認画面 → /analytics/revenue
- 精算確認画面 → /settlements

### Admin ポータル (6画面)
- オーナー審査画面 → /owners/:id/review
- 手数料売上分析画面 → /analytics/commission
- 利用履歴管理画面 → /analytics/history
- 利用状況分析画面 → /analytics/usage
- サービス問合せ対応画面 → /inquiries/:id
- 精算実行画面 → /settlements/execute

## 3. ドメインコンポーネント候補

| コンポーネント | 導出根拠 | 対応画面 |
|--------------|---------|---------|
| RoomCard | 情報「会議室情報」+ 画面「会議室検索画面」 | 会議室検索画面 |
| SearchFilter | 画面に「検索」を含む + バリエーション「決済方法」等 | 会議室検索画面 |
| BookingCalendar | 予約日時属性 + 画面「会議室予約画面」 | 会議室予約画面 |
| ReservationCard | 情報「予約情報」+ 状態「予約状態」 | 利用者許諾画面、予約変更画面 |
| StarRating | 情報「会議室評価」「利用者評価」に評価点属性 | 評価登録画面、会議室評価一覧画面 |
| StatusBadge | 状態モデル5種 (オーナー状態、予約状態、鍵状態、会議室利用状態、会議室状態) | 全画面で横断利用 |
| StepTracker | 予約状態 (5状態)、オーナー状態 (6状態) | 予約詳細、オーナー詳細 |
| PriceDisplay | 情報「予約情報」「売上実績」に金額属性 | 予約画面、精算画面 |
| InquiryThread | 情報「問合せ」+ 画面「問合せ送信画面」「問合せ回答画面」 | 問合せ画面 |
| SummaryCard | 情報「売上実績」「手数料売上」「利用実績」 | 分析画面 |
| KeyStatusBadge | 状態「鍵状態」 | 鍵管理画面 |

## 4. NFR → デザイン判断

| NFR | 判断 |
|-----|------|
| 可用性 A.1.1.1 (9時〜翌8時) | エラー状態・ローディング状態を全画面に実装 |
| 性能 B.2.1.1 | Skeleton UI でパーシーブドパフォーマンス改善 |
| セキュリティ E.5.2.1 (RBAC) | ポータル別ナビゲーション・権限ベース表示切替 |
| セキュリティ E.6.1.1 (暗号化) | PII マスク表示 (カード番号、電話番号) |
| 運用 F.1.1.2 (モバイル対応) | User ポータルをモバイルファースト設計 |

## 5. Arch → 技術判断

| Arch 要素 | 判断 |
|-----------|------|
| Next.js (SSR/SPA) | React + TypeScript ベースのコンポーネント |
| アクター別 UI 分離 (SP-002) | data-portal 属性によるテーマ切替 |
| マネージド IdP (SP-008, SP-009) | ログイン画面はカスタム UI |
| API Gateway レート制限 (SP-007) | スロットリング時のリトライ UI |
| レスポンシブデザイン (SP-001) | モバイルファースト + デスクトップ対応 |
