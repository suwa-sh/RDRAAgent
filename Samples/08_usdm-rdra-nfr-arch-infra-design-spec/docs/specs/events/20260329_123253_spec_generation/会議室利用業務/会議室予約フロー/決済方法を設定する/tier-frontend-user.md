# 決済方法を設定する - 利用者・オーナー向けフロントエンド仕様

## 変更概要

決済方法設定画面を実装する。クレジットカード・電子マネーの選択に応じてフォームを動的に切り替え、カード情報は安全に入力できるよう配慮する。

## 画面仕様

### 決済方法設定画面

- **URL**: `/settings/payment`
- **アクセス権**: 利用者（ログイン必須）
- **ポータル**: user

#### 表示要素とコンポーネントマッピング

| 要素 | 種別 | デザインシステムコンポーネント | 説明 |
|------|------|------------------------------|------|
| 決済方法セレクター | フォーム | Button (variant=outline, toggle) | クレジットカード / 電子マネー の選択 |
| カード番号フィールド | フォーム | Input (type=text, pattern) | 16桁カード番号（Luhn チェック） |
| 有効期限フィールド | フォーム | Input (type=text, placeholder=MM/YY) | MM/YY 形式 |
| CVV フィールド | フォーム | Input (type=password) | 3-4桁のセキュリティコード |
| 電子マネーID フィールド | フォーム | Input (type=text) | 電子マネーID（電子マネー選択時のみ表示） |
| 設定ボタン | ボタン | Button (variant=primary) | 「設定する」 |
| 戻るボタン | ボタン | Button (variant=ghost) | 前の画面に戻る |

#### デザイントークン参照

| 用途 | トークン | 値 |
|------|---------|---|
| 背景色 | var(--semantic-background) | #FFFFFF |
| アクセント | var(--portal-primary) | #2563EB |
| エラー | var(--semantic-destructive) | #DC2626 |

#### UIロジック

- **状態管理**: 決済方法選択（credit_card/e_money）・各フォームフィールド値
- **バリデーション**:
  - カード番号: 16桁数字・Luhn アルゴリズムチェック
  - 有効期限: MM/YY 形式・未来日付であること
  - CVV: 3桁（AmexRの場合4桁）
- **ローディング**: 設定ボタン押下後はスピナー・ボタン無効化
- **エラーハンドリング**: フィールド下にインラインエラーメッセージを表示

#### 操作フロー

1. 予約申請画面から「決済方法を設定する」リンクをクリック
2. 決済方法設定画面（/settings/payment）に遷移
3. 決済方法（クレジットカード/電子マネー）を選択
4. 選択に応じてフォームが表示される
5. 情報を入力して「設定する」ボタンを押す
6. 完了後、元の予約申請画面に戻る

## コンポーネント設計

### PaymentMethodForm

- **ベースコンポーネント**: Input, Button
- **Props**:
  | Prop | 型 | 必須 | 説明 |
  |------|---|------|------|
  | onSubmit | (method: PaymentMethodInput) => Promise<void> | Yes | 設定実行コールバック |
  | redirectAfterSetup | string | No | 設定後のリダイレクト先 URL |
- **状態**: 決済方法選択・フォームフィールド値・バリデーションエラー
- **イベント**: onMethodChange、onSubmit

## ティア完了条件（BDD）

```gherkin
Feature: 決済方法を設定する - 利用者向けフロントエンド

  Scenario: クレジットカード選択時にカード情報フォームが表示される
    Given 利用者「田中太郎」が決済方法設定画面を開いている
    When 「クレジットカード」を選択する
    Then カード番号・有効期限・CVV の入力フィールドが表示され、電子マネーIDフィールドは非表示になる

  Scenario: 無効なカード番号を入力するとバリデーションエラーが表示される
    Given 利用者「田中太郎」が決済方法設定画面でクレジットカードを選択している
    When カード番号に「1234567890123456」を入力して「設定する」を押す
    Then カード番号フィールドの下に「正しいカード番号を入力してください」と表示される
```

---

## 共通コンポーネント参照

以下の共通コンポーネント（`@/components/common/` 配下）を使用する。
詳細な設計は `_cross-cutting/ux-ui/common-components.md` を参照。

| 共通コンポーネント | インポートパス | 用途 | Props マッピング |
|------------------|--------------|------|----------------|
| `StatusBadge` | `@/components/common/StatusBadge` | 決済状態の表示 | `status: payment.status, model: "payment"` |
| `LoadingSkeleton` | `@/components/common/LoadingSkeleton` | フォームの読み込み中 | `variant: "FormSkeleton"` |
| `ErrorBanner` | `@/components/common/ErrorBanner` | API エラー表示 | `status: 400/5xx, message: エラーメッセージ` |
