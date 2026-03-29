# 鍵の返却を記録する - 利用者・オーナー向けフロントエンド仕様

## 変更概要

鍵返却記録画面を実装する。KeyHandoverTrackerコンポーネントで「貸出中」ステップを表示し、「鍵を受け取った」ボタンのクリックで返却状態に遷移させる。

## 画面仕様

### 鍵返却記録画面

- **URL**: `/owner/rentals/:id/key-return`
- **アクセス権**: 会議室オーナー（該当会議室の所有者のみ）
- **ポータル**: owner（オーナーポータル）

#### 表示要素とコンポーネントマッピング

| 要素 | 種別 | デザインシステムコンポーネント | 説明 |
|------|------|------------------------------|------|
| 鍵返却ステッパー | ステッパー | KeyHandoverTracker (currentStep: "key-return", lentAt, returnDue) | 現在の「貸出中」ステップと貸出開始時刻・返却予定時刻を表示 |
| 予約情報カード | カード | Card (variant: default) | 利用者名・利用終了予定日時・実利用開始日時 |
| 返却記録ボタン | ボタン | Button (variant: primary) | 「鍵を受け取った」ボタン |
| キャンセルボタン | ボタン | Button (variant: outline) | 前画面に戻る |

#### デザイントークン参照

| 用途 | トークン | 値 |
|------|---------|---|
| 背景色 | var(--semantic-background) | #FFFFFF |
| アクセント | var(--portal-primary) | #0D9488 (Teal 600, オーナーポータル) |
| 貸出中ステップ色 | blue-600 | #2563EB |
| 返却済ステップ色 | green-600 | #16A34A |

#### UIロジック

- **状態管理**: isSubmitting（boolean）をローカルステートで管理
- **バリデーション**: なし（ボタン操作のみ）
- **ローディング**: 送信中はボタンに「記録中...」スピナーを表示、disabled化
- **エラーハンドリング**: 409エラー時は「鍵はすでに返却済みです」モーダルを表示。サーバーエラーはトーストで通知

#### 操作フロー

1. 貸出中の予約一覧から「鍵返却」ボタンをクリックして遷移
2. KeyHandoverTrackerで「貸出中」ステップ（貸出開始時刻: 10:00、返却予定: 12:00）を確認
3. 「鍵を受け取った」ボタンをクリック
4. 確認ダイアログで意思確認
5. API 送信後、KeyHandoverTrackerが「返却済」ステップに切り替わる
6. 「利用者を評価する」リンクが表示される

## コンポーネント設計

### KeyReturnPanel

- **ベースコンポーネント**: KeyHandoverTracker + Card
- **Props**:
  | Prop | 型 | 必須 | 説明 |
  |------|---|------|------|
  | rentalId | string | Yes | 予約ID（鍵返却対象） |
  | reservation | ReservationSummary | Yes | 予約サマリー（利用者名・日時） |
  | lentAt | string | Yes | 貸出日時 (ISO 8601) |
  | returnDue | string | Yes | 返却予定日時 (ISO 8601) |
  | onSuccess | () => void | Yes | 返却記録成功後のコールバック |
- **状態**: idle, confirming, submitting, done
- **イベント**: onKeyReturn（返却ボタンクリック）

## ティア完了条件（BDD）

```gherkin
Feature: 鍵の返却を記録する - フロントエンド

  Scenario: 「鍵を受け取った」ボタンクリックで確認ダイアログが表示される
    Given 会議室オーナー「山田花子」が鍵返却記録画面（予約ID: R-001、貸出開始: 10:00）を表示している
    When 「鍵を受け取った」ボタンをクリックする
    Then 「田中太郎さんから鍵を受け取りましたか？」確認ダイアログが表示される

  Scenario: 返却記録完了後にKeyHandoverTrackerが「返却済」に切り替わる
    Given 鍵返却記録画面（予約ID: R-001）が表示されており、鍵状態が「貸出中」である
    When APIから鍵返却成功レスポンス（keyStatus: "保管中"）が返される
    Then KeyHandoverTrackerの現在ステップが「返却済」に更新され、「利用者を評価する」リンクが表示される
```

---

## 共通コンポーネント参照

以下の共通コンポーネント（`@/components/common/` 配下）を使用する。
詳細な設計は `_cross-cutting/ux-ui/common-components.md` を参照。

| 共通コンポーネント | インポートパス | 用途 | Props マッピング |
|------------------|--------------|------|----------------|
| `StatusBadge` | `@/components/common/StatusBadge` | 鍵の状態表示（保管中/貸出中） | `status: key.status, model: "key"` |
| `LoadingSkeleton` | `@/components/common/LoadingSkeleton` | 鍵情報の読み込み中 | `variant: "DetailSkeleton"` |
| `ErrorBanner` | `@/components/common/ErrorBanner` | API エラー表示 | `status: 409/5xx, message: エラーメッセージ` |
