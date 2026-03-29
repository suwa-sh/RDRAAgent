# オーナーへ問合せを送信する - 利用者・オーナー向けフロントエンド仕様

## 変更概要

問合せ送信画面を実装する。InquiryThreadコンポーネントを使用して問合せ内容をチャット形式で表示し、新規問合せ送信フォームを提供する。

## 画面仕様

### 問合せ送信画面

- **URL**: `/inquiries/new?ownerId=:ownerId`
- **アクセス権**: 利用者（ログイン済み）
- **ポータル**: user（利用者ポータル）

#### 表示要素とコンポーネントマッピング

| 要素 | 種別 | デザインシステムコンポーネント | 説明 |
|------|------|------------------------------|------|
| 問合せ相手情報 | カード | Card (variant: default) | オーナー名・会議室名を表示 |
| 問合せ履歴スレッド | スレッド | InquiryThread (messages: []) | 既存の問合せ履歴をチャット形式で表示（初回は空） |
| 問合せ内容入力 | フォーム | Input (variant: default, multiline) | 問合せ内容テキストエリア（最大1000文字） |
| 送信ボタン | ボタン | Button (variant: primary) | 「送信」ボタン |

#### デザイントークン参照

| 用途 | トークン | 値 |
|------|---------|---|
| 背景色 | var(--semantic-background) | #FFFFFF |
| アクセント | var(--portal-primary) | #2563EB (Blue 600, 利用者ポータル) |

#### UIロジック

- **状態管理**: content（string）、isSubmitting（boolean）をローカルステートで管理
- **バリデーション**: content が空の場合「問合せ内容を入力してください」を表示。1000文字超過の場合は「1000文字以内で入力してください」を表示
- **ローディング**: 送信中は送信ボタンをdisabled化しスピナーを表示
- **エラーハンドリング**: サーバーエラーはトーストで「送信に失敗しました。再試行してください」を表示

#### 操作フロー

1. 会議室詳細画面の「オーナーに問い合わせる」ボタンをクリックして遷移
2. 問合せ送信相手（オーナー: 山田花子、会議室: 渋谷会議室001）を確認
3. 問合せ内容を入力（例: 「駐車場はありますか？」）
4. 「送信」ボタンをクリック
5. 送信完了後、InquiryThreadに送信した問合せが追加表示される

## コンポーネント設計

### InquirySendForm

- **ベースコンポーネント**: InquiryThread + Input + Card
- **Props**:
  | Prop | 型 | 必須 | 説明 |
  |------|---|------|------|
  | ownerId | string | Yes | 問合せ先オーナーID |
  | ownerName | string | Yes | 問合せ先オーナー名 |
  | roomName | string | No | 関連する会議室名 |
  | existingMessages | Message[] | No | 既存の問合せ履歴 |
  | onSuccess | (inquiryId: string) => void | Yes | 送信成功後のコールバック |
- **状態**: idle, submitting, done
- **イベント**: onSubmit（content）

## ティア完了条件（BDD）

```gherkin
Feature: オーナーへ問合せを送信する - フロントエンド

  Scenario: 問合せ内容を入力して送信ボタンをクリックする
    Given 利用者「田中太郎」が問合せ送信画面（オーナー: 山田花子）を表示している
    When 問合せ内容「駐車場はありますか？」を入力し「送信」ボタンをクリックする
    Then 送信中スピナーが表示され、完了後にInquiryThreadに「駐車場はありますか？」が追加表示される

  Scenario: 問合せ内容が空の状態で送信ボタンをクリックするとバリデーションエラーが表示される
    Given 利用者「田中太郎」が問合せ送信画面を表示しており内容が空である
    When 「送信」ボタンをクリックする
    Then 「問合せ内容を入力してください」バリデーションエラーが表示される
```

---

## 共通コンポーネント参照

以下の共通コンポーネント（`@/components/common/` 配下）を使用する。
詳細な設計は `_cross-cutting/ux-ui/common-components.md` を参照。

| 共通コンポーネント | インポートパス | 用途 | Props マッピング |
|------------------|--------------|------|----------------|
| `LoadingSkeleton` | `@/components/common/LoadingSkeleton` | フォームの読み込み中 | `variant: "FormSkeleton"` |
| `ErrorBanner` | `@/components/common/ErrorBanner` | API エラー表示 | `status: 400/5xx, message: エラーメッセージ` |
