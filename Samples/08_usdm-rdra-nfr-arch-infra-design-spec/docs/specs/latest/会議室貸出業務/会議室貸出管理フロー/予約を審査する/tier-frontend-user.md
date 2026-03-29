# 予約を審査する - 利用者・オーナー向けフロントエンド仕様

## 変更概要

予約審査画面を実装する。オーナーが予約申請の詳細、利用者の評価情報を確認し、許諾または拒否を選択できる画面。拒否の場合は拒否理由テキストの入力を必須とする。

## 画面仕様

### 予約審査画面

- **URL**: `/owner/reservations/:id/review`
- **アクセス権**: 会議室オーナー（該当会議室の所有者のみ）
- **ポータル**: owner（オーナーポータル）

#### 表示要素とコンポーネントマッピング

| 要素 | 種別 | デザインシステムコンポーネント | 説明 |
|------|------|------------------------------|------|
| 予約ステータスバッジ | バッジ | ReservationStatusBadge | 現在の予約状態（申請）を色付きで表示 |
| 予約詳細情報 | カード | Card (variant: default) | 利用日時・利用者名・利用時間を表示 |
| 利用者評価サマリー | 評価表示 | StarRating (readOnly: true) | 利用者の平均評価スコア（クリックで評価詳細へ遷移） |
| 評価確認リンク | リンク | Button (variant: ghost) | 「利用者の評価を確認する」画面へ遷移 |
| 低評価ガイダンス | 警告表示 | Badge (variant: warning) | 平均スコア2.0以下の場合に拒否推奨を表示 |
| 拒否理由テキストエリア | フォーム | Input (variant: default) | 拒否選択時に入力必須（最大200文字） |
| 許諾ボタン | ボタン | Button (variant: primary) | 予約を許諾する |
| 拒否ボタン | ボタン | Button (variant: destructive) | 予約を拒否する |

#### デザイントークン参照

| 用途 | トークン | 値 |
|------|---------|---|
| 背景色 | var(--semantic-background) | #FFFFFF |
| アクセント | var(--portal-primary) | #0D9488 (Teal 600, オーナーポータル) |
| 警告色 | var(--semantic-warning) | #F97316 |
| 危険ボタン | var(--semantic-destructive) | #DC2626 |

#### UIロジック

- **状態管理**: decision（approved/rejected/null）、rejectReason（string）、isSubmitting（boolean）をローカルステートで管理
- **バリデーション**: 拒否選択時に rejectReason が空の場合、「拒否理由を入力してください」バリデーションエラーを表示。最大200文字制限
- **ローディング**: 審査送信中は許諾/拒否ボタンをdisabled化し、スピナーを表示
- **エラーハンドリング**: 409エラー時は「この予約はすでに審査済みです」モーダルを表示し予約一覧に遷移。503エラー時は「システムエラーが発生しました。しばらく後に再試行してください」トーストを表示

#### 操作フロー

1. 予約一覧から対象予約の「審査する」ボタンをクリックして遷移
2. 予約詳細（利用日時、利用者名）と利用者の平均評価スコアを確認
3. 必要に応じて「利用者の評価を確認」リンクで評価詳細を確認
4. 平均スコア2.0以下の場合は拒否推奨ガイダンスが表示される
5. 「許諾する」または「拒否する」を選択
6. 拒否の場合は拒否理由を入力
7. 確認モーダルで意思確認後、APIに送信

## コンポーネント設計

### ReservationReviewPanel

- **ベースコンポーネント**: ReservationStatusBadge + StarRating + Card
- **Props**:
  | Prop | 型 | 必須 | 説明 |
  |------|---|------|------|
  | reservation | ReservationDetail | Yes | 予約詳細情報 |
  | userRating | UserRatingSummary | Yes | 利用者評価サマリー |
  | onDecision | (decision: 'approved' \| 'rejected', reason?: string) => void | Yes | 審査決定コールバック |
- **状態**: idle, confirming, submitting, done
- **イベント**: onApprove, onReject（拒否理由付き）

## ティア完了条件（BDD）

```gherkin
Feature: 予約を審査する - フロントエンド

  Scenario: 許諾ボタンクリックで確認モーダルが表示される
    Given 会議室オーナー「山田花子」が予約審査画面（予約ID: R-001）を表示している
    When 「許諾する」ボタンをクリックする
    Then 「この予約を許諾しますか？」確認モーダルが表示される

  Scenario: 拒否理由未入力で拒否ボタンをクリックするとバリデーションエラーが表示される
    Given 会議室オーナー「山田花子」が予約審査画面で「拒否する」を選択した状態である
    When 拒否理由を空のまま「確定する」ボタンをクリックする
    Then 「拒否理由を入力してください」バリデーションエラーメッセージが表示される
```

---

## 共通コンポーネント参照

以下の共通コンポーネント（`@/components/common/` 配下）を使用する。
詳細な設計は `_cross-cutting/ux-ui/common-components.md` を参照。

| 共通コンポーネント | インポートパス | 用途 | Props マッピング |
|------------------|--------------|------|----------------|
| `ConfirmActionModal` | `@/components/common/ConfirmActionModal` | 予約審査（許諾/却下）確認ダイアログ | `variant: "default" | "destructive", title: "予約許諾確認" | "予約却下確認", confirmLabel: "許諾する" | "却下する", onConfirm: () => POST /reservations/:id/approve または /reject` |
| `StatusBadge` | `@/components/common/StatusBadge` | 予約状態の表示 | `status: reservation.status, model: "reservation"` |
| `LoadingSkeleton` | `@/components/common/LoadingSkeleton` | 予約詳細の読み込み中 | `variant: "DetailSkeleton"` |
| `ErrorBanner` | `@/components/common/ErrorBanner` | API エラー表示 | `status: 409/5xx, message: エラーメッセージ` |
