# 予約を許諾する - 利用者・オーナー向けフロントエンド仕様

## 変更概要

オーナー向け予約許諾画面を実装する。申請状態の予約一覧を表示し、利用者情報・評価スコアを確認した上で許諾/拒否操作ができる。

## 画面仕様

### 予約許諾画面

- **URL**: `/owner/reservations/pending`
- **アクセス権**: 会議室オーナー（ログイン必須・オーナーロール）
- **ポータル**: user（オーナーポータル）

#### 表示要素とコンポーネントマッピング

| 要素 | 種別 | デザインシステムコンポーネント | 説明 |
|------|------|------------------------------|------|
| 申請一覧テーブル | テーブル | テーブル（テーブルrow_height: 48px） | 会議室名・利用者名・申請日時・利用日時・利用料金・操作 |
| 予約ステータスバッジ | バッジ | ReservationStatusBadge | 申請/確定/変更/取消を色で識別 |
| 利用者評価スコア | 評価 | StarRating (readonly=true, size=sm) | 利用者の過去評価平均スコア（参考情報） |
| 「許諾する」ボタン | ボタン | Button (variant=primary, size=sm) | 予約許諾実行 |
| 「拒否する」ボタン | ボタン | Button (variant=destructive, size=sm) | 予約拒否実行 |
| 利用者詳細リンク | リンク | - | 利用者評価詳細画面へのリンク |

#### デザイントークン参照

| 用途 | トークン | 値 |
|------|---------|---|
| アクセント | var(--portal-primary) | #0D9488（Teal 600） |
| 危険操作 | var(--semantic-destructive) | #DC2626 |

#### UIロジック

- **状態管理**: 許諾/拒否操作の確認モーダル表示・ローディング状態
- **バリデーション**: なし（選択操作のみ）
- **確認ダイアログ**: 許諾/拒否ボタン押下時に確認モーダルを表示（誤操作防止）
- **エラーハンドリング**: 操作失敗時はトースト通知

#### 操作フロー

1. オーナーがサイドバーの「予約管理」から「申請中の予約」を選択
2. 申請状態の予約一覧が表示される
3. 利用者の評価スコアを確認する
4. 「許諾する」または「拒否する」ボタンをクリック
5. 確認モーダルが表示される
6. 「確認」をクリックで操作実行
7. 一覧が更新される

## コンポーネント設計

### ReservationApprovalTable

- **ベースコンポーネント**: ReservationStatusBadge, StarRating, Button
- **Props**:
  | Prop | 型 | 必須 | 説明 |
  |------|---|------|------|
  | reservations | PendingReservation[] | Yes | 申請中の予約一覧 |
  | onApprove | (reservationId: string) => Promise<void> | Yes | 許諾コールバック |
  | onReject | (reservationId: string) => Promise<void> | Yes | 拒否コールバック |
- **状態**: 操作中の予約ID（ローディング制御）
- **イベント**: onApprove、onReject

## ティア完了条件（BDD）

```gherkin
Feature: 予約を許諾する - 利用者向けフロントエンド

  Scenario: 申請中の予約一覧が表示される
    Given 会議室オーナー「山田健太」がログイン済みで予約許諾画面を開いた
    When ページが読み込まれる
    Then 申請状態の予約が一覧表示され、各行に利用者名・利用日時・利用料金・利用者評価スコア・許諾/拒否ボタンが表示される

  Scenario: 許諾ボタン押下後に確認モーダルが表示される
    Given 会議室オーナー「山田健太」が予約許諾画面で予約 rsv-001 の「許諾する」ボタンを押した
    When ボタンをクリックする
    Then 「この予約を許諾しますか？」という確認モーダルが表示される
```

---

## 共通コンポーネント参照

以下の共通コンポーネント（`@/components/common/` 配下）を使用する。
詳細な設計は `_cross-cutting/ux-ui/common-components.md` を参照。

| 共通コンポーネント | インポートパス | 用途 | Props マッピング |
|------------------|--------------|------|----------------|
| `ConfirmActionModal` | `@/components/common/ConfirmActionModal` | 予約許諾確認ダイアログ | `variant: "default", title: "予約許諾確認", confirmLabel: "許諾する", onConfirm: () => POST /reservations/:id/approve` |
| `StatusBadge` | `@/components/common/StatusBadge` | 予約状態の表示 | `status: reservation.status, model: "reservation"` |
| `LoadingSkeleton` | `@/components/common/LoadingSkeleton` | 予約詳細の読み込み中 | `variant: "DetailSkeleton"` |
| `ErrorBanner` | `@/components/common/ErrorBanner` | API エラー表示 | `status: 409/5xx, message: エラーメッセージ` |
