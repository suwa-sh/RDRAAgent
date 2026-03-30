# 変更サマリ

- event_id: 20260330_184257_design_system
- trigger_event: rdra:20260330_180653_initial_build, arch:20260330_182346_initial_arch

## 追加 (初期構築)
- brand: RoomConnect (Blue #2563EB / Teal #0D9488)
- portals: user (利用者), owner (オーナー), admin (管理者) の3ポータル
- tokens: primitive 40+色, semantic 15トークン, component 6カテゴリ, dark overrides
- components/ui: Button, Badge, Card, Input, Icon (5コンポーネント)
- components/domain: RoomCard, SearchFilter, BookingCalendar, StarRating, PriceDisplay, OwnerStatusBadge, ReservationStatusBadge, InquiryStatusBadge, InquiryThread, SettlementSummary, DashboardChart (11コンポーネント)
- screens: 33画面 (User 9, Owner 15, Admin 9)
- states: オーナー申請状態(6), 予約状態(6), 問合せ状態(4)
- assets: Logo SVG 3種, Icon SVG 18種
- storybook-app: Next.js + Storybook プロジェクト

## 変更
- なし

## 削除
- なし
