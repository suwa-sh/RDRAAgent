# 鍵の貸出を記録する - 利用者・オーナー向けフロントエンド仕様

## 変更概要

鍵貸出記録画面を実装する。KeyHandoverTrackerコンポーネントを用いて鍵の貸出ステップを視覚的に表示し、「鍵を渡した」ボタンのクリックで貸出状態に遷移させる。

## 画面仕様

### 鍵貸出記録画面

- **URL**: `/owner/rentals/:id/key-out`
- **アクセス権**: 会議室オーナー（該当会議室の所有者のみ）
- **ポータル**: owner（オーナーポータル）

#### 表示要素とコンポーネントマッピング

| 要素 | 種別 | デザインシステムコンポーネント | 説明 |
|------|------|------------------------------|------|
| 鍵貸出ステッパー | ステッパー | KeyHandoverTracker (currentStep: "key-out") | 「保管中→貸出中→返却済」ステップを視覚表示 |
| 予約情報カード | カード | Card (variant: default) | 利用者名・利用開始予定日時・会議室名 |
| 貸出記録ボタン | ボタン | Button (variant: primary) | 「鍵を渡した」ボタン（押下で貸出状態に遷移） |
| キャンセルボタン | ボタン | Button (variant: outline) | 前画面に戻る |

#### デザイントークン参照

| 用途 | トークン | 値 |
|------|---------|---|
| 背景色 | var(--semantic-background) | #FFFFFF |
| アクセント | var(--portal-primary) | #0D9488 (Teal 600, オーナーポータル) |
| ステッパーアクティブ | blue-600 | #2563EB |

#### UIロジック

- **状態管理**: isSubmitting（boolean）をローカルステートで管理。送信中はボタンをdisabled化
- **バリデーション**: なし（ボタン操作のみ）
- **ローディング**: 送信中はボタンに「記録中...」スピナーを表示
- **エラーハンドリング**: 409エラー時は「鍵はすでに貸出中です」モーダルを表示。サーバーエラーはトーストで通知

#### 操作フロー

1. 予約一覧から「鍵貸出」ボタンをクリックして遷移
2. 予約情報（利用者名: 田中太郎、利用開始: 2026-03-29 10:00）とKeyHandoverTrackerを確認
3. 「鍵を渡した」ボタンをクリック
4. 確認ダイアログで意思確認
5. API 送信後、KeyHandoverTrackerが「貸出中」ステップに切り替わる
6. 「鍵返却記録画面へ」リンクが表示される

## コンポーネント設計

### KeyOutPanel

- **ベースコンポーネント**: KeyHandoverTracker + Card
- **Props**:
  | Prop | 型 | 必須 | 説明 |
  |------|---|------|------|
  | rentalId | string | Yes | 予約ID（鍵貸出対象） |
  | reservation | ReservationSummary | Yes | 予約サマリー（利用者名・日時） |
  | onSuccess | () => void | Yes | 貸出記録成功後のコールバック |
- **状態**: idle, confirming, submitting, done
- **イベント**: onKeyOut（貸出ボタンクリック）

## ティア完了条件（BDD）

```gherkin
Feature: 鍵の貸出を記録する - フロントエンド

  Scenario: 「鍵を渡した」ボタンクリックで確認ダイアログが表示される
    Given 会議室オーナー「山田花子」が鍵貸出記録画面（予約ID: R-001）を表示している
    When 「鍵を渡した」ボタンをクリックする
    Then 「田中太郎さんに鍵を渡しましたか？」確認ダイアログが表示される

  Scenario: 貸出記録完了後にKeyHandoverTrackerが「貸出中」に切り替わる
    Given 鍵貸出記録画面（予約ID: R-001）が表示されており、鍵状態が「保管中」である
    When APIから鍵貸出成功レスポンス（keyStatus: "貸出中"）が返される
    Then KeyHandoverTrackerの現在ステップが「貸出中」に更新され、「鍵返却記録画面へ」リンクが表示される
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
