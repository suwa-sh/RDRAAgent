# Spec 生成 分析根拠

## 分析日時
2026-03-30T12:00:32

## システム名
- 英語名（API/コード用）: RoomConnect
- 和名（仕様書用）: 貸し会議室サービス

## UC 一覧

```
オーナー管理業務
  └── オーナー登録フロー
        ├── プロフィールを登録する [owner / 社外]
        ├── オーナー申請を登録する [owner / 社外]
        └── オーナー申請を審査する [admin / 社内]
  └── オーナー退会フロー
        ├── 退会を申請する [owner / 社外]
        └── 退会を処理する [admin / 社内]

会議室管理業務
  └── 会議室登録フロー
        ├── 会議室を登録する [owner / 社外]
        ├── 運用ルールを設定する [owner / 社外]
        └── 会議室評価を照会する [owner / 社外]

会議室貸出業務
  └── 会議室貸出フロー
        ├── 利用者評価を照会する [owner / 社外]
        ├── 鍵の貸出を記録する [owner / 社外]
        ├── 鍵の返却を記録する [user / 社外]
        ├── 利用者評価を登録する [owner / 社外]
        └── 問合せ回答を登録する [owner / 社外]

会議室予約業務
  └── 会議室予約フロー
        ├── 会議室を検索する [user / 社外]
        └── 予約を登録する [user / 社外]
  └── 予約変更取消フロー
        ├── 予約を変更する [user / 社外]
        └── 予約を取消する [user / 社外]

評価業務
  └── 利用者評価登録フロー
        └── 会議室評価を登録する [user / 社外]

サービス運営業務
  └── 売上分析フロー
        └── 手数料売上を照会する [admin / 社内]
  └── 利用状況管理フロー
        └── 利用状況を照会する [admin / 社内]
  └── 問合せ対応フロー
        └── 問合せ対応を登録する [admin / 社内]

精算業務
  └── オーナー精算フロー
        ├── 精算額を計算する [admin / 社内]
        └── 精算を実行する [admin / 社内 + 外部システム: 決済機関]
```

合計: 6業務, 8 BUC, 22 UC

## UC-ティアマッピング

| UC名 | ポータル | tier-frontend | tier-backend-api | tier-worker |
|------|---------|:---:|:---:|:---:|
| プロフィールを登録する | owner | o | o | - |
| オーナー申請を登録する | owner | o | o | - |
| オーナー申請を審査する | admin | o | o | - |
| 退会を申請する | owner | o | o | - |
| 退会を処理する | admin | o | o | - |
| 会議室を登録する | owner | o | o | - |
| 運用ルールを設定する | owner | o | o | - |
| 会議室評価を照会する | owner | o | o | - |
| 利用者評価を照会する | owner | o | o | - |
| 鍵の貸出を記録する | owner | o | o | - |
| 鍵の返却を記録する | user | o | o | - |
| 利用者評価を登録する | owner | o | o | - |
| 問合せ回答を登録する | owner | o | o | - |
| 会議室を検索する | user | o | o | - |
| 予約を登録する | user | o | o | - |
| 予約を変更する | user | o | o | - |
| 予約を取消する | user | o | o | - |
| 会議室評価を登録する | user | o | o | - |
| 手数料売上を照会する | admin | o | o | - |
| 利用状況を照会する | admin | o | o | - |
| 問合せ対応を登録する | admin | o | o | - |
| 精算額を計算する | admin | o | o | - |
| 精算を実行する | admin | o | o | o |

注: 精算を実行する のみ tier-worker（CronJob精算バッチ + 決済機関連携）を含む

## UC-画面マッピング

| UC名 | RDRA画面 | Design画面 | ポータル | コンポーネント |
|------|---------|-----------|---------|-------------|
| プロフィールを登録する | プロフィール登録画面 | プロフィール登録画面 | owner | Input, Button |
| オーナー申請を登録する | オーナー申請画面 | オーナー申請画面 | owner | Input, Button |
| オーナー申請を審査する | オーナー審査画面 | オーナー審査画面 | admin | Badge, Button |
| 退会を申請する | 退会申請画面 | 退会申請画面 | owner | Button |
| 退会を処理する | 退会処理画面 | 退会処理画面 | admin | Button |
| 会議室を登録する | 会議室登録画面 | 会議室登録画面 | owner | Input, Button |
| 運用ルールを設定する | 運用ルール設定画面 | 運用ルール設定画面 | owner | Input, Button |
| 会議室評価を照会する | 会議室評価一覧画面 | 会議室評価一覧画面 | owner | StarRating, Card |
| 利用者評価を照会する | 利用者評価確認画面 | 利用者評価確認画面 | owner | StarRating |
| 鍵の貸出を記録する | 鍵管理画面 | 鍵管理画面 | owner | KeyStatusBadge |
| 鍵の返却を記録する | 鍵返却画面 | 鍵返却画面 | user | KeyStatusBadge |
| 利用者評価を登録する | 利用者評価登録画面 | 利用者評価登録画面 | owner | StarRating |
| 問合せ回答を登録する | 問合せ回答画面 | 問合せ回答画面 | owner | InquiryThread |
| 会議室を検索する | 会議室検索画面 | 会議室検索画面 | user | SearchFilter, RoomCard, StarRating, PriceDisplay |
| 予約を登録する | 予約登録画面 | 予約登録画面 | user | BookingCalendar, ReservationStatusBadge, PriceDisplay |
| 予約を変更する | 予約変更画面 | 予約変更画面 | user | BookingCalendar, ReservationStatusBadge |
| 予約を取消する | 予約取消画面 | 予約取消画面 | user | ReservationStatusBadge |
| 会議室評価を登録する | 会議室評価登録画面 | 会議室評価登録画面 | user | StarRating |
| 手数料売上を照会する | 売上分析画面 | 売上分析画面 | admin | SummaryCard, PriceDisplay |
| 利用状況を照会する | 利用状況分析画面 | 利用状況分析画面 | admin | SummaryCard |
| 問合せ対応を登録する | 問合せ対応画面 | 問合せ対応画面 | admin | InquiryThread |
| 精算額を計算する | 精算処理画面 | 精算処理画面 | admin | SummaryCard, PriceDisplay |
| 精算を実行する | 精算実行画面 | 精算実行画面 | admin | PriceDisplay, Button |

## API エンドポイント推定

| UC名 | メソッド | パス | 概要 |
|------|---------|------|------|
| プロフィールを登録する | POST | /api/v1/owners/profile | オーナープロフィール登録 |
| オーナー申請を登録する | POST | /api/v1/owners/applications | オーナー申請登録 |
| オーナー申請を審査する | POST | /api/v1/admin/owners/applications/{id}/actions/review | オーナー申請審査 |
| 退会を申請する | POST | /api/v1/owners/withdrawal | 退会申請 |
| 退会を処理する | POST | /api/v1/admin/owners/{id}/actions/withdraw | 退会処理 |
| 会議室を登録する | POST | /api/v1/owners/rooms | 会議室登録 |
| 運用ルールを設定する | PUT | /api/v1/owners/rooms/{id}/rules | 運用ルール設定 |
| 会議室評価を照会する | GET | /api/v1/owners/rooms/{id}/reviews | 会議室評価一覧 |
| 利用者評価を照会する | GET | /api/v1/owners/reservations/{id}/user-reviews | 利用者評価照会 |
| 鍵の貸出を記録する | POST | /api/v1/owners/rooms/{roomId}/keys/actions/lend | 鍵貸出記録 |
| 鍵の返却を記録する | POST | /api/v1/reservations/{id}/keys/actions/return | 鍵返却記録 |
| 利用者評価を登録する | POST | /api/v1/owners/reservations/{id}/user-reviews | 利用者評価登録 |
| 問合せ回答を登録する | POST | /api/v1/owners/inquiries/{id}/replies | 問合せ回答登録 |
| 会議室を検索する | GET | /api/v1/rooms | 会議室検索 |
| 予約を登録する | POST | /api/v1/reservations | 予約登録 |
| 予約を変更する | PUT | /api/v1/reservations/{id} | 予約変更 |
| 予約を取消する | POST | /api/v1/reservations/{id}/actions/cancel | 予約取消 |
| 会議室評価を登録する | POST | /api/v1/reservations/{id}/room-reviews | 会議室評価登録 |
| 手数料売上を照会する | GET | /api/v1/admin/analytics/revenue | 手数料売上照会 |
| 利用状況を照会する | GET | /api/v1/admin/analytics/usage | 利用状況照会 |
| 問合せ対応を登録する | POST | /api/v1/admin/inquiries/{id}/responses | 問合せ対応登録 |
| 精算額を計算する | POST | /api/v1/admin/settlements/actions/calculate | 精算額計算 |
| 精算を実行する | POST | /api/v1/admin/settlements/{id}/actions/execute | 精算実行 |

## 非同期イベント

| イベント名 | チャネル | 方向 | トリガーUC | 説明 |
|-----------|---------|------|----------|------|
| settlement.execute | settlement-queue | publish | 精算を実行する | 決済機関への精算実行を非同期で処理 |
| settlement.completed | settlement-result-queue | subscribe | 精算を実行する | 決済機関からの精算結果を受信 |

## 全体横断設計方針

### ユーザーフロー
- 利用者フロー: 会議室検索 → 予約登録 → 鍵返却 → 会議室評価登録
- オーナーフロー: プロフィール登録 → オーナー申請 → 会議室登録 → 運用ルール設定 → 鍵貸出 → 利用者評価
- 運営担当者フロー: オーナー審査 → 売上分析 → 利用状況管理 → 精算処理

### 情報アーキテクチャ
- Userポータル: 会議室検索, 予約管理, 鍵返却, 評価, 問合せ
- Ownerポータル: プロフィール, 会議室管理, 運用ルール, 評価確認, 鍵管理, 問合せ回答, 退会
- Adminポータル: オーナー審査, 退会処理, 売上分析, 利用状況, 問合せ対応, 精算

### データ可視化対象
- 売上分析画面: 手数料売上の月次推移、会議室別売上比較
- 利用状況分析画面: 利用履歴の月次推移、会員別・物件別利用状況

## NFR 反映事項
- 可用性 Lv3: エラー状態・ローディング状態を全画面に実装
- 性能 Lv3: 一覧APIにページネーション（page, per_page）実装、レスポンスタイム5秒以内
- セキュリティ: OAuth2/OIDC + RBAC（3ロール）、冪等キー付与
- モバイル対応: Userポータルをモバイルファースト設計
