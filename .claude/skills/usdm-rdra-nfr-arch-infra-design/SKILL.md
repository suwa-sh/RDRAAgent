---
name: usdm-rdra-nfr-arch-infra-design
description: >
  アーキテクチャ設計・インフラ設計からデザインシステムを生成し Storybook に変換するスキル。
  usdm-rdra-nfr-arch-infra スキルの後段に位置する。
  docs/rdra/latest/ の BUC・アクター・情報・状態モデルと
  docs/nfr/latest/nfr-grade.yaml、docs/arch/latest/arch-design.yaml、docs/infra/latest/ を入力とし、
  3層デザイントークン（primitive→semantic→component）、ドメイン特化コンポーネント仕様、
  RDRA画面マッピング、状態モデルマッピングを生成し、Next.js + Storybook プロジェクトとして出力する。
  イベントソーシングで履歴管理する。
  「デザインシステムを作成」「Storybookを生成」「UI設計」「コンポーネントカタログ」
  「デザイントークン」「画面設計」「ポータル別デザイン」などで発動。
---

# Design System Generator (usdm-rdra-nfr-arch-infra-design)

RDRA/NFR/Arch/Infra モデルからデザインシステムを生成し、Storybook プロジェクトとして出力する。

## 前提条件

### 依存スキル

実行前に以下のスキルの存在をチェックする。不足がある場合はユーザーに報告し、インストール方法を提示する。

**必須:**
- `design-system` — トークンアーキテクチャ・コンポーネント仕様の知識
- `ui-ux-pro-max` — UI/UXデザインインテリジェンス

**推奨 (brand/design統合時):**
- `brand` — ブランドガイドライン・カラーパレット・タイポグラフィ・ボイスフレームワーク
- `design` — ロゴ生成 (55 styles, SVG)・アイコン生成 (15 styles, SVG)

**推奨 (Storybook生成時):**
- `storybook-config` — Storybook 設定知識
- `component-scaffold` — コンポーネント雛形生成パターン
- `story-generation` — Story 自動生成パターン
- `design-system-starter` — デザインシステム骨組み

```bash
# 依存スキルチェック
for skill in design-system ui-ux-pro-max storybook-config component-scaffold story-generation design-system-starter; do
  if [ -f "$HOME/.claude/skills/$skill/SKILL.md" ]; then
    echo "OK: $skill"
  else
    echo "MISSING: $skill"
  fi
done
```

不足スキルがある場合:
1. ユーザーに不足スキルの一覧を提示
2. 以下の選択肢を提示:
   - **A**: 不足スキルをインストールしてから続行
   - **B**: 不足スキルなしで続行（該当ステップの品質が低下する可能性あり）
   - **C**: 中断
3. A の場合、インストール元リポジトリを案内:
   - `design-system`, `ui-ux-pro-max`: `github.com/nextlevelbuilder/ui-ux-pro-max-skill`
   - `storybook-config`, `component-scaffold`, `story-generation`: `github.com/flight505/storybook-assistant`
   - `design-system-starter`: `github.com/softaworks/agent-toolkit`

### 入力ファイル

| パス | 必須 | 用途 |
|------|------|------|
| `docs/rdra/latest/BUC.tsv` | 必須 | 画面・UC・アクティビティ定義 |
| `docs/rdra/latest/アクター.tsv` | 必須 | アクター定義 → ポータル導出 |
| `docs/rdra/latest/情報.tsv` | 必須 | 情報モデル → データ表示コンポーネント |
| `docs/rdra/latest/状態.tsv` | 必須 | 状態モデル → ステータスBadge/トラッカー |
| `docs/rdra/latest/バリエーション.tsv` | 推奨 | バリエーション → フィルター/フォーム |
| `docs/nfr/latest/nfr-grade.yaml` | 必須 | NFRグレード → 設計判断 |
| `docs/arch/latest/arch-design.yaml` | 必須 | アーキテクチャ → レイアウト/技術選定 |
| `docs/infra/latest/` | 推奨 | インフラ設計 → CDN/キャッシュ考慮 |

## 出力ディレクトリ

```
docs/design/
  events/{event_id}/           # イベント履歴（不変）
    design-event.yaml          # ★ 中核成果物（brand/tokens/components/screens/states）
    design-event.md            # Markdown 表現（generateDesignEventMd.js で生成）
    _inference.md              # 推論根拠
    source.txt                 # トリガー説明
    storybook-app/             # Next.js + Storybook プロジェクト
  latest/                      # 最新スナップショット（完全上書き）
    design-event.yaml
    design-event.md
    storybook-app/
```

## Scripts

| スクリプト | 用途 |
|-----------|------|
| `scripts/schema-design-event.json` | design-event.yaml の JSON Schema |
| `scripts/validateDesignEvent.js` | YAML バリデーション (exit 0/1/2) |
| `scripts/generateDesignEventMd.js` | YAML → Markdown 生成 |

## オーケストレーション

### Step1: モデル分析とデザイン方針決定

**読み込み:** `references/design/design-infer.md`

1. RDRA モデルを読み込み、以下を抽出する:
   - **ポータル構成**: アクターの社内外・立場からポータルを導出（例: 利用者/オーナー/管理者）
   - **画面一覧**: BUC.tsv の `画面` 列からユニークな画面名を抽出
   - **ドメインエンティティ**: 情報.tsv からコンポーネント化候補を特定
   - **状態モデル**: 状態.tsv からステータス表示が必要なエンティティを特定
   - **バリエーション**: バリエーション.tsv から検索/フィルター条件を抽出
2. NFR グレードから設計判断を導出する:
   - 可用性 → エラー/ローディング状態の網羅性
   - 性能 → ページネーション/仮想スクロール要否
   - セキュリティ → PII マスク表示、認証UI
3. Arch 設計から技術判断を導出する:
   - presentation tier → フレームワーク・レイアウト構成
   - ポータル数・認証方式 → テーマ切替方式
4. `_inference.md` に推論根拠を記録する

### Step2: ユーザー確認（対話）

**読み込み:** `references/design/design-dialogue.md`

以下を順番にユーザーに提示し、確認・調整する。各ステップで選択肢を提示する。

1. **ポータル構成の確認**
   - 導出したポータル一覧とプライマリカラー案を提示
   - 選択肢: 承認 / カラー変更 / ポータル追加・削除

2. **デザイントークン方針の確認**
   - トークン3層構造のサマリーを提示
   - 選択肢: 承認 / フォント変更 / カラースケール変更

3. **ドメインコンポーネント構成の確認**
   - RDRA から導出したコンポーネント一覧を提示
   - 選択肢: 承認 / コンポーネント追加・削除 / 仕様変更

4. **Storybook プロジェクト構成の確認**
   - Tech stack と Stories 構成を提示
   - 選択肢: 承認 / フレームワーク変更 / Stories 追加

### Step3: design-event.yaml 生成

**読み込み:** `references/design/design-tokens-generate.md`, `references/design/design-components-generate.md`

1. Step1 の分析結果 + Step2 の確認結果をもとに `design-event.yaml` を生成する
2. brand セクション: `brand` スキルの出力がある場合は統合。なければ推論から生成
3. tokens セクション: `design-system` スキルの `references/token-architecture.md` を参照し3層構造で生成
4. components セクション: RDRA 画面/情報/状態からドメインコンポーネントを導出
5. screens セクション: RDRA 画面 → ルート → コンポーネントマッピング
6. states セクション: RDRA 状態モデル → Badge/Color マッピング

**重要な実装ルール（実績からの学び）:**
- `--color-white: #FFFFFF` のような基本トークンは必ず明示的に `:root` に定義する
- ポータル切替は `[data-portal="user|owner|admin"]` CSS セレクタで実現する
- dark mode では status 系の `-50` 色（green-50 等）は明るすぎる → `rgba()` 半透明値を使う
- hover 色は light/dark で別値が必要 → `--hover-muted` のようなセマンティックトークンを定義する
- すべてのセマンティック/コンポーネントトークンに dark mode オーバーライドを定義する
- `.dark` クラスと `@media (prefers-color-scheme: dark)` の両方に定義する

### Step4: design-event.yaml バリデーション

```bash
node <skill-path>/scripts/validateDesignEvent.js docs/design/events/{event_id}/design-event.yaml
```

- exit 0 (PASS) → Step5 へ進む
- exit 1 (FAIL) → エラー内容を修正し、再度 Step3 から design-event.yaml を修正
- exit 2 (システムエラー) → ファイルパス・形式を確認

### Step5: Markdown 生成

```bash
node <skill-path>/scripts/generateDesignEventMd.js docs/design/events/{event_id}/design-event.yaml
```

- `design-event.md` が同ディレクトリに生成される
- Brand、Portals、Tokens、Components、Screens、States、NFR Decisions のセクション

### Step6: アセット生成 (Logo / Icon SVG)

**読み込み:** `references/design/design-assets-generate.md`

Logo SVG (3バリアント) と Icon SVG (ドメイン必要セット) を生成する。

**方法A**: `brand` / `design` スキルの AI 画像生成 (Gemini 等) が利用可能な場合、スキルのプロンプト設計ノウハウ（スタイル選定、カラー心理学、業界ガイド）を活用して生成する。出力は PNG。SVG が必要な場合はトレースが別途必要
**方法B** (推奨): `design` スキルのプロンプト設計ノウハウ（モチーフ選定、構図）を参考にしつつ、SVG コードを直接記述する。外部 API 不要で確実。ベクター形式で Storybook に直接埋め込み可能

方法B の場合:
1. **Logo SVG** — ブランドカラー (`--primary`) を使い、ドメインを象徴するシンプルなアイコン + テキストで構成
   - `assets/logo-full.svg` (横長: アイコン + テキスト)
   - `assets/logo-icon.svg` (正方形: アイコンのみ)
   - `assets/logo-stacked.svg` (縦: アイコン上 + テキスト下)
   - `viewBox` を適切に設定、`fill="none"` + `stroke` ベースでスケーラブルに
2. **Icon SVG** — outlined style (stroke-based)、24x24 viewBox、`stroke="currentColor"` で色を CSS から制御可能に
   - RDRA の画面・機能からドメインに必要なアイコンを導出 (search, calendar, key, star, user, etc.)
   - `assets/icons/` に配置
3. `design-event.yaml` の `brand.logo.variants` と `brand.icons` のパスを更新

### Step7: Storybook プロジェクト生成

**読み込み:** `references/design/design-storybook-generate.md`, `references/design/design-lessons-learned.md`

1. Next.js + TypeScript + Tailwind CSS プロジェクトを作成する
2. Storybook を初期化する
3. デザイントークン CSS をプロジェクトに配置する
4. `.storybook/preview.ts` にポータル/テーマ切替デコレーターを設定する
5. UI 共通コンポーネントを実装する（Button, Badge, Card, Input 等）
6. ドメイン特化コンポーネントを実装する
7. 各コンポーネントの Stories を CSF3 形式で作成する
8. MDX ドキュメントページを作成する（Introduction にロゴ表示）
9. Logo/Icon SVG を `public/assets/` に配置し、コンポーネントから参照する:
   - Icon コンポーネントを作成 (`<Icon name="search" />` → `/assets/icons/search.svg`)
   - Logo/Icon カタログ Story を作成 (Brand/Logo, Brand/Icons)
   - Introduction MDX にロゴを `<img src="/assets/logo-full.svg">` で表示

**重要な実装ルール（実績からの学び）:**
- **コンポーネント内で絵文字 (emoji) を使わない** → Step6 で生成した Icon SVG を `<Icon name="..." />` で使う。emoji はプロダクション品質ではない
- **Tailwind v4 では `text-[var(--color)]` が色として機能しない** → 色指定は `style={{ color: 'var(--token)' }}` で直接指定するか、`@theme inline` で `--color-*` として登録して `text-*` クラスを使う
- Storybook 10 では `@storybook/blocks` は使えない → `@storybook/addon-docs/blocks` を使う
- MDX では markdown テーブルが HTML テーブルに変換されない → `<table>` タグで直接書く
- preview decorator で `document.body.style.background` と `document.body.style.color` も設定する
- コンポーネント内でハードコードカラー（`text-white`, `bg-gray-200` 等）を使わない → 必ずトークン参照
- Badge をフィルター選択肢に使わない → `<button>` トグルを使う
- 固定幅 (`w-24`) の input は `flex-1 min-w-0` にする
- `@storybook/blocks` パッケージのインストールが必要な場合は `--legacy-peer-deps` を使う

### Step8: 画面確認（必須）

**読み込み:** `references/design/design-lessons-learned.md`

**画面での確認が取れていないのに完了扱いにしてはならない。**

1. Storybook dev server を起動する (`npm run storybook -- --no-open`)
2. ブラウザツールで確認する（優先順位）:
   - `mcp__chrome-devtools__` (emulate, navigate_page, take_screenshot, evaluate_script)
   - `mcp__claude-in-chrome__` (tabs_create_mcp, computer screenshot)
   - `mcp__playwright__` (browser_navigate, browser_take_screenshot)
3. OS dark mode 環境では `mcp__chrome-devtools__emulate` で `colorScheme: light` を設定する
4. **当たり前品質チェック** (全項目 PASS が必須):
   - [ ] はみ出し: 要素が親コンテナからはみ出していないか
   - [ ] 文字切れ: テキストが途中で切れていないか（特に金額、長い日本語）
   - [ ] コントラスト: テキストが背景に対して読めるか（全ポータル x light/dark）
   - [ ] クリッカブル: インタラクティブ要素にホバー/ポインターカーソルがあるか
   - [ ] 色の適用: CSS変数が正しく解決されているか（透明や黒になっていないか）
5. 問題がある場合は修正 → 再確認のループを繰り返す
6. ユーザーにスクリーンショットを提示し、問題がないことを確認する

### Step9: ビルド検証

1. `npx storybook build` でビルドを実行する
2. エラーがある場合は修正して再ビルドする
3. 成功したらユーザーに報告する

### Step10: イベント記録とスナップショット更新

**読み込み:** `references/event-sourcing-rules.md`

1. イベント ID を生成する: `{YYYYMMDD_HHMMSS}_design_system`
2. **latest/ → events/ にコピー** (latest/ で開発・検証済みのファイルが正):
   - `docs/design/latest/` の全成果物を `docs/design/events/{event_id}/` にコピーする
   - `source.txt` と `_inference.md` を `events/{event_id}/` に書き込む
3. latest/ が events/{event_id}/ と一致することを確認する

**注意**: 開発・修正は常に `latest/` で行い、完了後に `events/` にコピーする。逆方向（events/ を編集して latest/ にコピー）はしない。events/ は不変。

### タスク完了時

1. 動作確認に使った Storybook dev server を**停止する** (`kill $(lsof -t -i :6006)`)
2. ユーザーに以下の起動・停止コマンドを提示する:

```
# 起動
cd docs/design/latest/storybook-app && npm run storybook

# 停止
Ctrl+C
```

## イベントソーシングルール

`references/event-sourcing-rules.md` に従う。要約:

- events/ ディレクトリは **不変**（書き込み後の変更・削除禁止）
- latest/ は **完全上書き**（マージではなく全置換）
- イベント ID フォーマット: `{YYYYMMDD_HHMMSS}_design_system`
- 同一秒のイベントはサフィックス `_2`, `_3` で区別

## References

| ファイル | 用途 |
|----------|------|
| `references/event-sourcing-rules.md` | Step10: イベントソーシング不変ルール |
| `references/design/design-infer.md` | Step1: モデル分析タスク詳細 |
| `references/design/design-dialogue.md` | Step2: 対話フロー詳細 |
| `references/design/design-tokens-generate.md` | Step3: トークン生成ルール |
| `references/design/design-components-generate.md` | Step3: コンポーネント仕様生成ルール |
| `references/design/design-assets-generate.md` | Step6: Logo/Icon SVG 直接生成パターン |
| `references/design/design-storybook-generate.md` | Step7: Storybook 生成ルール + emoji→Icon 置換 |
| `references/design/design-lessons-learned.md` | Step7,8: **必読** 実装の教訓・品質チェックリスト・フォーム要素 |
| `scripts/schema-design-event.json` | Step4: design-event.yaml の JSON Schema |
| `scripts/validateDesignEvent.js` | Step4: YAML バリデーション (exit 0/1/2) |
| `scripts/generateDesignEventMd.js` | Step5: YAML → Markdown 生成 |
