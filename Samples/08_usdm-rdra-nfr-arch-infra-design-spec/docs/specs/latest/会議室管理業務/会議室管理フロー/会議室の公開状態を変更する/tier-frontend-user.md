# 会議室の公開状態を変更する - 利用者・オーナー向けフロントエンド仕様

## 変更概要

会議室公開管理画面を新規作成する。ログイン済みオーナーが会議室の公開状態（公開中/非公開）を切り替える画面。現在の状態に応じて表示するアクションボタンが変化する。

## 画面仕様

### 会議室公開管理画面

- **URL**: `/owner/rooms/:room_id/publication`
- **アクセス権**: ログイン済み会議室オーナー（対象会議室の所有者）
- **ポータル**: owner

#### 表示要素とコンポーネントマッピング

| 要素 | 種別 | デザインシステムコンポーネント | 説明 |
|------|------|------------------------------|------|
| 現在の公開状態バッジ | ステータス | Badge (variant: 状態別) | 非公開=outline, 公開可能=info, 公開中=success |
| 公開するボタン | ボタン | Button (variant: default, size: md) | 「公開可能」状態の場合のみ表示 |
| 非公開にするボタン | ボタン | Button (variant: outline, size: md) | 「公開中」または「公開可能」状態の場合に表示 |
| 公開条件未達メッセージ | テキスト | Card (variant: default) | 「非公開」状態で条件未達の場合に表示（次のステップを案内） |
| 操作完了バナー | テキスト | Badge (variant: success / info) | 操作成功後に表示 |

#### デザイントークン参照

| 用途 | トークン | 値 |
|------|---------|---|
| 背景色 | var(--semantic-background) | #FFFFFF |
| アクセント | var(--portal-primary) | #0D9488 (Teal 600) |
| 公開中色 | var(--semantic-success) | #16A34A |
| 非公開色 | var(--semantic-border) | #E2E8F0 |
| 情報色 | var(--semantic-info) | #3B82F6 |

#### UIロジック

- **状態管理**: 会議室の現在の公開状態、処理中フラグ
- **バリデーション**: 状態に応じてボタン表示を制御（非公開状態では「公開する」ボタン非表示 or disabled）
- **ローディング**: 操作後はスピナー表示
- **エラーハンドリング**: 422（公開条件未達）は「運用ルールとキャンセルポリシーを設定してください」と設定画面へのリンクを表示

#### 操作フロー

1. `/owner/rooms/:room_id/publication` を開く
2. 現在の公開状態が Badge で表示される
3. 「公開可能」状態の場合: 「公開する」ボタンが表示される
4. 「公開中」状態の場合: 「非公開にする」ボタンが表示される
5. 「非公開」状態かつ条件未達の場合: 設定手順の案内カードが表示される
6. ボタンをクリックし、操作完了後にバナーが表示される

## コンポーネント設計

### RoomPublicationControl

- **ベースコンポーネント**: Badge, Button, Card
- **Props**:
  | Prop | 型 | 必須 | 説明 |
  |------|---|------|------|
  | roomId | string | Yes | 対象会議室ID |
  | currentStatus | 'non_public' \| 'publishable' \| 'public' | Yes | 現在の公開状態 |
  | onStatusChange | (newStatus: string) => void | Yes | 状態変更コールバック |
- **状態**:
  - `isProcessing`: boolean
  - `resultMessage`: string | null
- **イベント**: `onPublish`（公開操作）, `onUnpublish`（非公開操作）

## ティア完了条件（BDD）

```gherkin
Feature: 会議室の公開状態を変更する - フロントエンド

  Scenario: 公開可能状態で「公開する」ボタンが表示される
    Given 会議室「渋谷会議室A」が「公開可能」状態でオーナーが管理画面を開いている
    When 画面が表示される
    Then 「公開可能」バッジ（info色）と「公開する」ボタンが表示される

  Scenario: 公開中から非公開への変更で成功バナーが表示される
    Given 会議室「渋谷会議室A」が「公開中」状態でオーナーが「非公開にする」をクリックした
    When APIから200が返る
    Then 「会議室を非公開にしました」のバナー（Badge: info）が表示され、バッジが「非公開」（outline）に変わる
```

---

## 共通コンポーネント参照

以下の共通コンポーネント（`@/components/common/` 配下）を使用する。
詳細な設計は `_cross-cutting/ux-ui/common-components.md` を参照。

| 共通コンポーネント | インポートパス | 用途 | Props マッピング |
|------------------|--------------|------|----------------|
| `ConfirmActionModal` | `@/components/common/ConfirmActionModal` | 公開状態変更確認ダイアログ | `variant: "default", title: "公開状態変更確認", description: "会議室を公開します。利用者から予約申請を受け付け可能になります。", confirmLabel: "変更する", onConfirm: () => PATCH /owner/rooms/:id/status` |
| `StatusBadge` | `@/components/common/StatusBadge` | 会議室公開状態の表示 | `status: room.status, model: "room"` |
| `LoadingSkeleton` | `@/components/common/LoadingSkeleton` | 会議室詳細の読み込み中 | `variant: "DetailSkeleton"` |
| `ErrorBanner` | `@/components/common/ErrorBanner` | API エラー表示 | `status: 409/5xx, message: エラーメッセージ` |
