# 退会を申請する - 利用者・オーナー向けフロントエンド仕様

## 変更概要

退会申請画面を新規作成する。ログイン済みオーナーが退会を申請するための確認フローを提供する。退会は取り消し不可な操作のため、二段階確認を実施する。

## 画面仕様

### 退会申請画面

- **URL**: `/owner/account/withdraw`
- **アクセス権**: ログイン済み会議室オーナー（登録済み状態）
- **ポータル**: owner

#### 表示要素とコンポーネントマッピング

| 要素 | 種別 | デザインシステムコンポーネント | 説明 |
|------|------|------------------------------|------|
| 退会に関する注意事項カード | カード | Card (variant: default) | 退会後の影響（会議室非公開化・データ削除等）を説明 |
| 退会申請ボタン | ボタン | Button (variant: destructive, size: lg) | クリックで確認モーダルを表示 |
| 退会確認モーダル | モーダル | Card (variant: default) | 「本当に退会しますか？」確認ダイアログ（幅560px） |
| 退会確定ボタン | ボタン | Button (variant: destructive, size: md) | モーダル内の最終確定ボタン |
| キャンセルボタン | ボタン | Button (variant: outline, size: md) | モーダルを閉じる |
| エラーバナー | テキスト | Badge (variant: destructive) | 未完了予約エラー等を表示 |

#### デザイントークン参照

| 用途 | トークン | 値 |
|------|---------|---|
| 背景色 | var(--semantic-background) | #FFFFFF |
| アクセント | var(--portal-primary) | #0D9488 (Teal 600) |
| 危険操作色 | var(--semantic-destructive) | #DC2626 |

#### UIロジック

- **状態管理**: モーダル表示フラグ、処理中フラグ
- **バリデーション**: 退会確定ボタンは一度クリックすると非活性化（二重送信防止）
- **ローディング**: 退会処理中はスピナー表示
- **エラーハンドリング**: 422（未完了予約あり）は詳細メッセージをエラーバナーで表示。処理成功時はログアウト後に完了画面へリダイレクト

#### 操作フロー

1. `/owner/account/withdraw` を開く
2. 退会の影響に関する注意事項カードが表示される
3. 「退会する」ボタンをクリックする
4. 確認モーダルが表示される（「本当に退会しますか？すべての会議室が非公開になります。」）
5. 「退会を確定する」ボタンをクリックする
6. ローディングスピナーが表示される
7. 成功時: 退会完了画面（`/owner/withdrawal-complete`）にリダイレクトされ、自動ログアウト
8. エラー時: エラーバナーが表示される（未完了予約がある場合等）

## コンポーネント設計

### WithdrawalConfirmation

- **ベースコンポーネント**: Card, Button, Badge
- **Props**:
  | Prop | 型 | 必須 | 説明 |
  |------|---|------|------|
  | ownerId | string | Yes | 退会対象のオーナーID |
  | onWithdrawComplete | () => void | Yes | 退会完了コールバック |
- **状態**:
  - `showModal`: boolean
  - `isProcessing`: boolean
  - `errorMessage`: string | null
- **イベント**: `onWithdrawClick`（退会申請クリック）, `onConfirm`（確定クリック）, `onCancel`（キャンセルクリック）

## ティア完了条件（BDD）

```gherkin
Feature: 退会を申請する - フロントエンド

  Scenario: 退会申請ボタンクリックで確認モーダルが表示される
    Given ログイン済みオーナー「田中一郎」が退会申請画面を開いている
    When 「退会する」ボタンをクリックする
    Then 「本当に退会しますか？すべての会議室が非公開になります。」の確認モーダルが表示される

  Scenario: 退会確定後に退会完了画面へリダイレクトされる
    Given オーナー「田中一郎」が確認モーダルを表示している状態で未完了予約がない
    When 「退会を確定する」ボタンをクリックする
    Then 退会完了画面（/owner/withdrawal-complete）にリダイレクトされ、自動ログアウトされる

  Scenario: 未完了予約がある場合にエラーバナーが表示される
    Given オーナー「田中一郎」が確認モーダルの「退会を確定する」をクリックした
    When APIから422エラー（未完了予約あり）が返る
    Then 「未完了の予約があるため退会できません。全ての予約が完了後に再度お試しください。」のエラーバナーが表示される
```

---

## 共通コンポーネント参照

以下の共通コンポーネント（`@/components/common/` 配下）を使用する。
詳細な設計は `_cross-cutting/ux-ui/common-components.md` を参照。

| 共通コンポーネント | インポートパス | 用途 | Props マッピング |
|------------------|--------------|------|----------------|
| `ConfirmActionModal` | `@/components/common/ConfirmActionModal` | 退会申請確認ダイアログ | `variant: "destructive", title: "退会確認", description: "退会するとすべてのデータが削除されます。", confirmLabel: "退会する", onConfirm: () => POST /owner/withdrawal` |
| `ErrorBanner` | `@/components/common/ErrorBanner` | API エラー表示 | `status: 409/5xx, message: エラーメッセージ` |
