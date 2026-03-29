# 問合せに回答する - 利用者・オーナー向けフロントエンド仕様

## 変更概要

問合せ回答画面を実装する。InquiryThreadコンポーネントで問合せ内容をチャット形式で表示し、オーナーが回答を入力して送信できるフォームを提供する。

## 画面仕様

### 問合せ回答画面

- **URL**: `/owner/inquiries/:id`
- **アクセス権**: 会議室オーナー（問合せの宛先オーナーのみ）
- **ポータル**: owner（オーナーポータル）

#### 表示要素とコンポーネントマッピング

| 要素 | 種別 | デザインシステムコンポーネント | 説明 |
|------|------|------------------------------|------|
| 問合せスレッド | スレッド | InquiryThread (messages) | 利用者の問合せ内容をチャット形式で表示 |
| 問合せステータス | バッジ | Badge (variant: warning) | 「未対応」バッジを表示 |
| 回答内容入力 | フォーム | Input (variant: default, multiline) | 回答テキストエリア（最大1000文字） |
| 回答送信ボタン | ボタン | Button (variant: primary) | 「回答を送信」ボタン |

#### デザイントークン参照

| 用途 | トークン | 値 |
|------|---------|---|
| 背景色 | var(--semantic-background) | #FFFFFF |
| アクセント | var(--portal-primary) | #0D9488 (Teal 600, オーナーポータル) |
| 未対応バッジ | amber-500 | #F59E0B |

#### UIロジック

- **状態管理**: replyContent（string）、isSubmitting（boolean）をローカルステートで管理
- **バリデーション**: replyContentが空の場合「回答内容を入力してください」バリデーションエラーを表示。1000文字超過は「1000文字以内で入力してください」を表示
- **ローディング**: 送信中は送信ボタンをdisabled化しスピナーを表示
- **エラーハンドリング**: 409エラーは「回答済み」Badge表示に切り替え入力フォームを非表示化

#### 操作フロー

1. 問合せ一覧から未対応の問合せをクリックして遷移
2. InquiryThreadで問合せ内容（「駐車場はありますか？」）を確認
3. 回答内容を入力（「会議室から徒歩2分のところにコインパーキングがあります」）
4. 「回答を送信」ボタンをクリック
5. 送信完了後、InquiryThreadに回答内容が追加され、ステータスが「回答済み」に更新される

## コンポーネント設計

### InquiryReplyForm

- **ベースコンポーネント**: InquiryThread + Input + Badge
- **Props**:
  | Prop | 型 | 必須 | 説明 |
  |------|---|------|------|
  | inquiryId | string | Yes | 問合せID |
  | messages | Message[] | Yes | 既存の問合せメッセージ |
  | status | "未対応" \| "回答済み" | Yes | 現在の問合せ状態 |
  | onSuccess | () => void | Yes | 回答送信成功後のコールバック |
- **状態**: idle, submitting, done
- **イベント**: onReply（replyContent）

## ティア完了条件（BDD）

```gherkin
Feature: 問合せに回答する - フロントエンド

  Scenario: 回答内容を入力して「回答を送信」ボタンをクリックする
    Given 会議室オーナー「山田花子」が問合せ回答画面（問合せID: I-001、状態: 未対応）を表示している
    When 回答内容「会議室から徒歩2分のところにコインパーキングがあります」を入力し「回答を送信」ボタンをクリックする
    Then 送信中スピナーが表示され、完了後にInquiryThreadに回答内容が追加され問合せステータスが「回答済み」に更新される

  Scenario: 回答内容が空の状態で送信ボタンをクリックするとバリデーションエラーが表示される
    Given 会議室オーナー「山田花子」が問合せ回答画面を表示しており回答内容が空である
    When 「回答を送信」ボタンをクリックする
    Then 「回答内容を入力してください」バリデーションエラーが表示される
```

---

## 共通コンポーネント参照

以下の共通コンポーネント（`@/components/common/` 配下）を使用する。
詳細な設計は `_cross-cutting/ux-ui/common-components.md` を参照。

| 共通コンポーネント | インポートパス | 用途 | Props マッピング |
|------------------|--------------|------|----------------|
| `StatusBadge` | `@/components/common/StatusBadge` | 問合せ状態の表示（未対応/回答済み） | `status: inquiry.status, model: "inquiry"` |
| `LoadingSkeleton` | `@/components/common/LoadingSkeleton` | 問合せ詳細の読み込み中 | `variant: "DetailSkeleton"` |
| `ErrorBanner` | `@/components/common/ErrorBanner` | API エラー表示 | `status: 409/5xx, message: エラーメッセージ` |
