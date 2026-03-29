# オーナー登録を審査する - 管理者向けフロントエンド仕様

## 変更概要

オーナー審査画面を新規作成する。サービス運営担当者が審査待ちオーナーの申請情報を確認し、承認または却下の判定を行える管理画面。

## 画面仕様

### オーナー審査画面

- **URL**: `/admin/owners/:owner_id/review`
- **アクセス権**: サービス運営担当者（社内アクター、MFA必須）
- **ポータル**: admin

#### 表示要素とコンポーネントマッピング

| 要素 | 種別 | デザインシステムコンポーネント | 説明 |
|------|------|------------------------------|------|
| オーナー審査状態バッジ | ステータス | OwnerVerificationBadge | 現在の審査状態（未審査/認証済/却下）を色付きバッジで表示 |
| 申請者情報カード | カード | Card (variant: default) | 氏名・連絡先・メールアドレス・申請日時を表示 |
| 承認ボタン | ボタン | Button (variant: default, size: md) | クリックで承認処理を実行 |
| 却下ボタン | ボタン | Button (variant: destructive, size: md) | クリックで却下確認モーダルを表示 |
| 却下確認モーダル | モーダル | Card (variant: default) | 却下前の確認ダイアログ（幅560px） |
| 処理完了バナー | テキスト | Badge (variant: success / destructive) | 審査完了後にバナー表示 |

#### デザイントークン参照

| 用途 | トークン | 値 |
|------|---------|---|
| 背景色 | var(--semantic-background) | #FFFFFF |
| アクセント | var(--portal-primary) | #334155 (Slate 700) |
| 承認色 | var(--semantic-success) | #16A34A |
| 却下色 | var(--semantic-destructive) | #DC2626 |

#### UIロジック

- **状態管理**: 審査対象オーナーデータ、モーダル表示フラグ、処理中フラグ
- **バリデーション**: 承認・却下ボタンは一度クリックすると非活性化し二重送信を防止
- **ローディング**: 審査操作後はスピナーを表示
- **エラーハンドリング**: 409（既審査済み）は「すでに審査が完了しています」バナーを表示。500系は「処理に失敗しました。再度お試しください」を表示

#### 操作フロー

1. `/admin/owners/:owner_id/review` にアクセスする
2. オーナー申請情報（氏名・連絡先・メールアドレス・申請日時）が表示される
3. OwnerVerificationBadge が「未審査」状態で表示される
4. 「承認」ボタンまたは「却下」ボタンを選択する
5. 「却下」選択時は確認モーダルが表示され、確認後に処理実行
6. 処理完了後、OwnerVerificationBadge が「認証済」または「却下」に更新される
7. 完了バナー（Badge）が表示される

## コンポーネント設計

### OwnerReviewPanel

- **ベースコンポーネント**: OwnerVerificationBadge, Card, Button
- **Props**:
  | Prop | 型 | 必須 | 説明 |
  |------|---|------|------|
  | ownerId | string | Yes | 審査対象のオーナーID |
  | ownerData | OwnerData | Yes | 申請者情報オブジェクト |
  | onReviewComplete | (result: 'approved' \| 'rejected') => void | Yes | 審査完了コールバック |
- **状態**:
  - `isProcessing`: boolean（処理中フラグ）
  - `showRejectModal`: boolean（却下確認モーダル表示フラグ）
  - `reviewResult`: 'approved' | 'rejected' | null
- **イベント**: `onApprove`（承認クリック）, `onReject`（却下確認クリック）, `onRejectConfirm`（却下確定クリック）

## ティア完了条件（BDD）

```gherkin
Feature: オーナー登録を審査する - 管理者フロントエンド

  Scenario: 審査担当者が申請情報を確認できる
    Given サービス運営担当者がオーナー審査画面（/admin/owners/abc-123/review）を開いた
    When 画面が表示される
    Then 申請者「田中一郎」の氏名・連絡先・申請日時が表示され、OwnerVerificationBadgeに「未審査」が表示される

  Scenario: 承認後にOwnerVerificationBadgeが認証済みに更新される
    Given サービス運営担当者がオーナー審査画面を開き、対象オーナーが審査待ち状態である
    When 「承認」ボタンをクリックする
    Then OwnerVerificationBadgeが「認証済」（グリーン）に変わり、「承認が完了しました」バナーが表示される

  Scenario: 却下時に確認モーダルが表示される
    Given サービス運営担当者がオーナー審査画面を開いている
    When 「却下」ボタンをクリックする
    Then 却下確認モーダルが表示され「本当に却下しますか？」のメッセージが表示される
```

---

## 共通コンポーネント参照

以下の共通コンポーネント（`@/components/common/` 配下）を使用する。
詳細な設計は `_cross-cutting/ux-ui/common-components.md` を参照。

| 共通コンポーネント | インポートパス | 用途 | Props マッピング |
|------------------|--------------|------|----------------|
| `ConfirmActionModal` | `@/components/common/ConfirmActionModal` | オーナー審査（承認/却下）確認ダイアログ | `variant: "default" | "destructive", title: "オーナー承認確認" | "オーナー却下確認", confirmLabel: "承認する" | "却下する", onConfirm: () => POST /admin/owners/:id/approve または /reject` |
| `StatusBadge` | `@/components/common/StatusBadge` | オーナー登録状態の表示 | `status: owner.status, model: "owner"` |
| `LoadingSkeleton` | `@/components/common/LoadingSkeleton` | オーナー詳細の読み込み中 | `variant: "DetailSkeleton"` |
| `ErrorBanner` | `@/components/common/ErrorBanner` | API エラー表示 | `status: 409/5xx, message: エラーメッセージ` |
