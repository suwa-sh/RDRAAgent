# Spec 生成 分析根拠

## 分析日時
2026-03-30T16:04:03

## システム名
- 英語名(API/コード): RoomConnect (design-event.yaml brand.name)
- 和名(仕様書): 貸し会議室サービス (システム概要.json system_name)

## UC 一覧 (26 UC / 8業務 / 11 BUC)

```
オーナー管理業務
  └── オーナー登録フロー
        ├── オーナーを登録する [会議室オーナー/社外] → tier-frontend + tier-backend-api
        ├── 規約を参照する [会議室オーナー/社外] → tier-frontend + tier-backend-api
        ├── オーナー申請する [会議室オーナー/社外] → tier-frontend + tier-backend-api
        └── オーナー申請を審査する [サービス運営担当者/社内] → tier-frontend + tier-backend-api
  └── オーナー退会フロー
        └── オーナー退会する [会議室オーナー/社外] → tier-frontend + tier-backend-api

会議室管理業務
  └── 会議室登録フロー
        ├── 会議室を登録する [会議室オーナー/社外] → tier-frontend + tier-backend-api
        └── 運用ルールを設定する [会議室オーナー/社外] → tier-frontend + tier-backend-api
  └── 会議室評価確認フロー
        └── 会議室評価を確認する [会議室オーナー/社外] → tier-frontend + tier-backend-api

会議室貸出業務
  └── 会議室貸出フロー
        ├── 利用者使用許諾する [会議室オーナー/社外] → tier-frontend + tier-backend-api
        ├── 鍵を貸し出す [会議室オーナー/社外] → tier-frontend + tier-backend-api
        ├── 鍵を返却する [会議室オーナー/社外] → tier-frontend + tier-backend-api
        └── 利用者評価を登録する [会議室オーナー/社外] → tier-frontend + tier-backend-api
  └── 問合せ対応フロー
        ├── 問合せを送信する [利用者/社外] → tier-frontend + tier-backend-api
        └── 問合せに回答する [会議室オーナー/社外] → tier-frontend + tier-backend-api

会議室予約業務
  └── 会議室予約フロー
        ├── 会議室を照会する [利用者/社外] → tier-frontend + tier-backend-api
        └── 会議室を予約する [利用者/社外] → tier-frontend + tier-backend-api
  └── 予約変更取消フロー
        ├── 予約を変更する [利用者/社外] → tier-frontend + tier-backend-api
        └── 予約を取消する [利用者/社外] → tier-frontend + tier-backend-api

評価管理業務
  └── 評価登録フロー
        └── 評価を登録する [利用者/社外] → tier-frontend + tier-backend-api

利用実績管理業務
  └── 利用実績管理フロー
        ├── 利用実績を確認する [会議室オーナー/社外] → tier-frontend + tier-backend-api
        └── 売上実績を確認する [会議室オーナー/社外] → tier-frontend + tier-backend-api

サービス運営業務
  └── サービス運営管理フロー
        └── 手数料売上を分析する [サービス運営担当者/社内] → tier-frontend + tier-backend-api
  └── 利用状況管理フロー
        ├── 利用履歴を管理する [サービス運営担当者/社内] → tier-frontend + tier-backend-api
        └── 利用状況を分析する [サービス運営担当者/社内] → tier-frontend + tier-backend-api
  └── サービス問合せ対応フロー
        ├── サービス問合せを送信する [利用者/社外] → tier-frontend + tier-backend-api
        └── サービス問合せに対応する [サービス運営担当者/社内] → tier-frontend + tier-backend-api

精算業務
  └── オーナー精算フロー
        ├── 精算内容を確認する [会議室オーナー/社外] → tier-frontend + tier-backend-api
        └── オーナー精算を実行する [サービス運営担当者/社内] → tier-frontend + tier-backend-api + tier-backend-worker
```

## UC-ティアマッピング

| UC名 | tier-frontend | tier-backend-api | tier-backend-worker | ポータル |
|------|:---:|:---:|:---:|------|
| オーナーを登録する | o | o | - | owner |
| 規約を参照する | o | o | - | owner |
| オーナー申請する | o | o | - | owner |
| オーナー申請を審査する | o | o | - | admin |
| オーナー退会する | o | o | - | owner |
| 会議室を登録する | o | o | - | owner |
| 運用ルールを設定する | o | o | - | owner |
| 会議室評価を確認する | o | o | - | owner |
| 利用者使用許諾する | o | o | - | owner |
| 鍵を貸し出す | o | o | - | owner |
| 鍵を返却する | o | o | - | owner |
| 利用者評価を登録する | o | o | - | owner |
| 問合せを送信する | o | o | - | user |
| 問合せに回答する | o | o | - | owner |
| 会議室を照会する | o | o | - | user |
| 会議室を予約する | o | o | - | user |
| 予約を変更する | o | o | - | user |
| 予約を取消する | o | o | - | user |
| 評価を登録する | o | o | - | user |
| 利用実績を確認する | o | o | - | owner |
| 売上実績を確認する | o | o | - | owner |
| 手数料売上を分析する | o | o | - | admin |
| 利用履歴を管理する | o | o | - | admin |
| 利用状況を分析する | o | o | - | admin |
| サービス問合せを送信する | o | o | - | user |
| サービス問合せに対応する | o | o | - | admin |
| 精算内容を確認する | o | o | - | owner |
| オーナー精算を実行する | o | o | o | admin |

## UC-画面マッピング

| UC名 | RDRA画面 | Design画面 | ポータル | コンポーネント |
|------|---------|-----------|---------|-------------|
| オーナーを登録する | オーナー登録画面 | オーナー登録画面 | owner | Input, Button, StepTracker |
| 規約を参照する | 規約確認画面 | 規約確認画面 | owner | Card, Button |
| オーナー申請する | オーナー申請画面 | オーナー申請画面 | owner | Input, Button, StepTracker |
| オーナー申請を審査する | オーナー審査画面 | オーナー審査画面 | admin | StatusBadge, StepTracker, Card, Button |
| オーナー退会する | オーナー退会画面 | オーナー退会画面 | owner | Card, Button |
| 会議室を登録する | 会議室登録画面 | 会議室登録画面 | owner | Input, Button |
| 運用ルールを設定する | 運用ルール設定画面 | 運用ルール設定画面 | owner | Input, Button, Card |
| 会議室評価を確認する | 会議室評価一覧画面 | 会議室評価一覧画面 | owner | StarRating, Card |
| 利用者使用許諾する | 利用者許諾画面 | 利用者許諾画面 | owner | ReservationCard, StarRating, StatusBadge, Button |
| 鍵を貸し出す | 鍵管理画面 | 鍵管理画面 | owner | StatusBadge, Button |
| 鍵を返却する | 鍵返却画面 | 鍵返却画面 | owner | StatusBadge, Button |
| 利用者評価を登録する | 利用者評価登録画面 | 利用者評価登録画面 | owner | StarRating, Input, Button |
| 問合せを送信する | 問合せ送信画面 | 問合せ送信画面 | user | InquiryThread, Input, Button |
| 問合せに回答する | 問合せ回答画面 | 問合せ回答画面 | owner | InquiryThread, Input, Button |
| 会議室を照会する | 会議室検索画面 | 会議室検索画面 | user | SearchFilter, RoomCard, StarRating |
| 会議室を予約する | 会議室予約画面 | 会議室予約画面 | user | BookingCalendar, PriceDisplay, Button |
| 予約を変更する | 予約変更画面 | 予約変更画面 | user | ReservationCard, BookingCalendar, Button |
| 予約を取消する | 予約取消画面 | 予約取消画面 | user | ReservationCard, Button |
| 評価を登録する | 評価登録画面 | 評価登録画面 | user | StarRating, Input, Button |
| 利用実績を確認する | 利用実績確認画面 | 利用実績確認画面 | owner | SummaryCard, Card |
| 売上実績を確認する | 売上実績確認画面 | 売上実績確認画面 | owner | SummaryCard, PriceDisplay |
| 手数料売上を分析する | 手数料売上分析画面 | 手数料売上分析画面 | admin | SummaryCard, PriceDisplay |
| 利用履歴を管理する | 利用履歴管理画面 | 利用履歴管理画面 | admin | Card, StatusBadge |
| 利用状況を分析する | 利用状況分析画面 | 利用状況分析画面 | admin | SummaryCard, Card |
| サービス問合せを送信する | サービス問合せ画面 | サービス問合せ画面 | user | InquiryThread, Input, Button |
| サービス問合せに対応する | サービス問合せ対応画面 | サービス問合せ対応画面 | admin | InquiryThread, Input, Button |
| 精算内容を確認する | 精算確認画面 | 精算確認画面 | owner | PriceDisplay, StatusBadge, Card |
| オーナー精算を実行する | 精算実行画面 | 精算実行画面 | admin | PriceDisplay, StatusBadge, Button |

## 非同期イベント

| イベント名 | UC | 外部システム | チャネル |
|-----------|---|------------|---------|
| 精算依頼 | オーナー精算を実行する | 決済機関 | settlement-request-queue |

## 全体横断設計方針

### ユーザーフロー
1. 利用者フロー: 会議室検索 → 予約 → 鍵受取 → 利用 → 鍵返却 → 評価
2. オーナーフロー: 登録 → 規約確認 → 申請 → 会議室登録 → 運用ルール設定 → 貸出管理 → 精算確認
3. 運営フロー: オーナー審査 → 利用状況管理 → 売上分析 → 精算実行

### 情報アーキテクチャ
- 利用者ポータル (user): 会議室検索, 予約管理, 評価, 問合せ, サービス問合せ
- オーナーポータル (owner): 会議室管理, 貸出管理, 利用実績, 精算, 問合せ回答
- 管理者ポータル (admin): オーナー審査, 売上分析, 利用状況, 問合せ対応, 精算実行

### データ可視化対象
- 利用実績確認画面: 利用件数推移, 利用時間分布
- 売上実績確認画面: 月次売上推移, 会議室別売上
- 手数料売上分析画面: 手数料推移, 会議室別手数料, 貸出別手数料
- 利用状況分析画面: 会員別利用状況, 物件別利用状況

## NFR 反映事項
- 可用性 99% SLO → エラーハンドリング・リトライ
- レスポンスタイム 500ms → ページネーション・キャッシュ
- RBAC + Backend 作り込み → ポータル別認可
- PII 暗号化 → カード番号・個人情報マスク
- モバイルファースト → レスポンシブデザイン
