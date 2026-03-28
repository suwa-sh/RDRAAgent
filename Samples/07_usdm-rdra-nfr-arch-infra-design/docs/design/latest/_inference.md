# Design System Inference - RoomConnect

## ポータル導出根拠

| アクター | 社内外 | 立場 | → ポータル | カラー |
|----------|--------|------|-----------|--------|
| 利用者 | 社外 | 受益者 | User | Blue #2563EB |
| 会議室オーナー | 社外 | 提供者 | Owner | Teal #0D9488 |
| サービス運営担当者 | 社内 | 提供者 | Admin | Slate #334155 |

## コンポーネント導出根拠

| RDRA パターン | → コンポーネント |
|--------------|-----------------|
| 画面「会議室検索画面」+ バリエーション「会議室検索条件」 | SearchFilter |
| 情報「会議室情報」(画像属性) + 画面「会議室検索画面」 | RoomCard |
| 状態モデル「予約」(6状態) | ReservationStatusBadge |
| 状態モデル「鍵」(3状態, 順序性あり) | KeyHandoverTracker |
| 情報「会議室評価」(評価スコア属性) | StarRating |
| 情報「会議室情報」(価格属性) | PriceDisplay |
| 状態モデル「オーナー」(審査フロー) | OwnerVerificationBadge |
| 情報「精算情報」(金額属性複数) | SettlementSummaryCard |
| 画面「問合せ送信画面」「問合せ回答画面」 | InquiryThread |
| 画面「予約申請画面」+ 日時選択 | BookingCalendar |

## NFR → デザイン判断

| NFR | 判断 |
|-----|------|
| 可用性 24h運用 | エラー/ローディング状態を全画面に |
| 性能 ~10,000同時ユーザー | ページネーション・仮想スクロール |
| 性能 p99 500ms | Skeleton UI |
| セキュリティ RBAC 3ロール | ポータル別ナビゲーション |
| セキュリティ PII | マスク表示 |
| 運用 モバイル対応 | User ポータル = モバイルファースト |

## Arch → 技術判断

| Arch 要素 | 判断 |
|-----------|------|
| presentation: Go + React/Next.js | Next.js + TypeScript + Tailwind CSS |
| 3ポータル | data-portal 属性 + CSS変数 |
| IdP: Cognito | ログインは Hosted UI |
| CDN: CloudFront | Static asset 24h キャッシュ |
| API Gateway Rate Limit | スロットリング時リトライ UI |
| Cache: Redis 5min TTL | stale-while-revalidate |
