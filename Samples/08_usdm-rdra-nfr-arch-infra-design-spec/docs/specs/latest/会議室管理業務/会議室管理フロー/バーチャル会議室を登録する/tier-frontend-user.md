# バーチャル会議室を登録する - 利用者・オーナー向けフロントエンド仕様

## 変更概要

バーチャル会議室登録画面を新規作成する。バーチャル会議室専用のフォームを提供し、会議ツール種別の選択に応じたURL形式ガイドを表示する。

## 画面仕様

### バーチャル会議室登録画面

- **URL**: `/owner/rooms/new/virtual`
- **アクセス権**: ログイン済み会議室オーナー（登録済み状態）
- **ポータル**: owner

#### 表示要素とコンポーネントマッピング

| 要素 | 種別 | デザインシステムコンポーネント | 説明 |
|------|------|------------------------------|------|
| 会議室名入力フィールド | フォーム | Input (variant: default) | 必須。最大100文字 |
| 会議ツール種別選択 | フォーム | Input（セレクト） | 必須。「Zoom」「Teams」「Google Meet」 |
| 同時接続数入力フィールド | フォーム | Input (variant: default) | 必須。数値（人）。最大999 |
| 録画可否選択 | フォーム | Input（ラジオボタン） | 必須。「可」「不可」 |
| 価格入力フィールド | フォーム | Input (variant: default) | 必須。数値（円/時間） |
| 価格プレビュー | テキスト | PriceDisplay | 入力した価格をリアルタイムフォーマット表示 |
| 会議URL入力フィールド | フォーム | Input (variant: default) | 必須。URL形式（https://）。会議ツール種別に応じたプレースホルダー |
| URLフォーマットガイド | テキスト | Card (variant: default) | 会議ツール種別選択時にURLの形式例を表示 |
| 登録ボタン | ボタン | Button (variant: default, size: lg) | 必須項目入力後に活性化 |
| バーチャル識別バッジ | バッジ | Badge (variant: virtual) | 「バーチャル会議室」を示すバッジ（#8B5CF6） |

#### デザイントークン参照

| 用途 | トークン | 値 |
|------|---------|---|
| 背景色 | var(--semantic-background) | #FFFFFF |
| アクセント | var(--portal-primary) | #0D9488 (Teal 600) |
| バーチャルアクセント | var(--semantic-virtual_accent) | #8B5CF6 |
| ボーダー色 | var(--semantic-border) | #E2E8F0 |

#### UIロジック

- **状態管理**: 会議ツール種別、フォーム値、バリデーション状態、送信中フラグ
- **バリデーション**: 全必須項目チェック。会議URLはhttps://で始まるURL形式チェック。同時接続数は1以上999以下
- **ローディング**: 登録ボタン押下後はスピナー
- **エラーハンドリング**: URLフォーマットエラーはフィールド下に「有効な会議URLを入力してください（https://で始まるURL）」を表示

#### 操作フロー

1. `/owner/rooms/new/virtual` を開く
2. 会議室名を入力する
3. 会議ツール種別（Zoom/Teams/Google Meet）を選択する
4. URLフォーマットガイドが表示される（例: Zoomなら「https://zoom.us/j/XXXXXXXXXX」）
5. 同時接続数・録画可否・価格・会議URLを入力する
6. 入力完了後、登録ボタンが活性化される
7. 登録ボタンをクリックする
8. 成功時: 「登録が完了しました。運用ルールを設定して公開準備を進めてください。」を表示

## コンポーネント設計

### VirtualRoomRegistrationForm

- **ベースコンポーネント**: Input, Button, PriceDisplay, Badge, Card
- **Props**:
  | Prop | 型 | 必須 | 説明 |
  |------|---|------|------|
  | onSuccess | (roomId: string) => void | Yes | 登録成功コールバック |
- **状態**:
  - `meetingToolType`: 'zoom' \| 'teams' \| 'google_meet' \| null
  - `formValues`: VirtualRoomFormValues
  - `errors`: Record\<string, string\>
  - `isSubmitting`: boolean
- **イベント**: `onToolTypeChange`（ツール種別変更でURLガイド更新）, `onSubmit`

## ティア完了条件（BDD）

```gherkin
Feature: バーチャル会議室を登録する - フロントエンド

  Scenario: Zoom選択時にZoom用URLプレースホルダーが表示される
    Given オーナー「田中一郎」がバーチャル会議室登録画面を開いている
    When 会議ツール種別「Zoom」を選択する
    Then 会議URLフィールドのプレースホルダーが「https://zoom.us/j/XXXXXXXXXX」に変わり、URLガイドが表示される

  Scenario: 無効なURL形式でバリデーションエラーが表示される
    Given オーナー「田中一郎」がバーチャル会議室登録画面で「Zoom」を選択している
    When 会議URLフィールドに「zoom.us/j/123」（httpsなし）を入力してフォーカスを外す
    Then 「有効な会議URLを入力してください（https://で始まるURL）」のエラーが表示される

  Scenario: バーチャル識別バッジが表示される
    Given オーナー「田中一郎」がバーチャル会議室登録画面を開いた
    When 画面が表示される
    Then 「バーチャル会議室」のBadge（variant: virtual、紫色）が表示される
```

---

## 共通コンポーネント参照

以下の共通コンポーネント（`@/components/common/` 配下）を使用する。
詳細な設計は `_cross-cutting/ux-ui/common-components.md` を参照。

| 共通コンポーネント | インポートパス | 用途 | Props マッピング |
|------------------|--------------|------|----------------|
| `LoadingSkeleton` | `@/components/common/LoadingSkeleton` | フォーム初期読み込み | `variant: "FormSkeleton"` |
| `ErrorBanner` | `@/components/common/ErrorBanner` | API エラー表示 | `status: 400/409/5xx, message: エラーメッセージ` |
