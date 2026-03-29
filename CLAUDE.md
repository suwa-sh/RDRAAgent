# CLAUDE.md

## Project Overview

RDRAAgent は RDRA（Relationship Driven Requirement Analysis）2.0 の要件定義プロセスを **Claude Code の agent skill** として実装したツール。初期要望テキストから5フェーズで段階的にRDRAモデルを自動生成し、仕様まで作成する。

## Architecture

### Skill 構成

```
.claude/skills/rdra/
├── SKILL.md                  # オーケストレーション（フェーズ定義・並列実行指示）
├── references/               # タスクプロンプト・ナレッジ
│   ├── rdra-knowledge.md     # RDRA基本概念（全フェーズ共通）
│   ├── rdra-graph.md         # RDRAGraph データ構造
│   ├── rdra-sheet.md         # RDRASheet フォーマット
│   ├── phase1/               # Phase1 タスクプロンプト（11タスク）
│   ├── phase2/               # Phase2 タスクプロンプト（3タスク）
│   ├── phase3/               # Phase3 タスクプロンプト（3タスク）
│   ├── phase4/               # Phase4 タスクプロンプト（4タスク）
│   ├── phase5/               # Phase5 タスクプロンプト（1タスク）
│   └── spec/                 # 仕様生成タスクプロンプト（6タスク）
└── scripts/
    ├── makeGraphData.js      # RDRAGraph用関連データ生成
    └── makeZeroOneData.js    # RDRASheet用データ生成
```

### Data Flow

```
初期要望.txt
  → Phase1（11タスク並列） → 0_RDRAZeroOne/phase1/
  → Phase2（3タスク並列）  → 0_RDRAZeroOne/phase2/
  → Phase3（3タスク並列）  → 0_RDRAZeroOne/phase3/
  → Phase4（4タスク並列）  → 0_RDRAZeroOne/phase4/
  → Phase5               → 1_RDRA/システム概要.json
  → RDRA統合              → 1_RDRA/（TSV + 関連データ）
  → 仕様生成              → 2_RDRASpec/（論理データ・ビジネスルール・画面定義）
```

### フェーズ間の依存関係

- Phase1: `rdra-knowledge.md` + `初期要望.txt` → 11タスク並列
- Phase2: Phase1出力（初期要望分析.md, 業務.tsv, アクター.tsv, 状態.tsv, ビジネスポリシー.tsv）→ 3タスク並列
- Phase3: Phase2出力（業務.tsv）+ Phase1出力（アクター.tsv）+ Phase2出力（情報.tsv）→ 3タスク並列
- Phase4: Phase3出力（BUC.tsv, 情報.tsv）+ Phase2出力（状態.tsv）→ 4タスク並列
- Phase5: Phase4出力 → システム概要.json
- 仕様生成: 1_RDRA/ のデータ → 2_RDRASpec/

## Key Rules

1. **No npm Dependencies**: 外部ライブラリに依存しない。Node.js 標準モジュールのみ使用
2. **TSV Format**: UTF-8、タブ区切り、1行目はヘッダー
3. **File Generation**: テンプレートやプレースホルダーは作成しない。必ず完全な内容を生成する
4. **JavaScript Only**: ヘルパースクリプトは JavaScript のみ

## File Organization

| パス | 用途 |
|------|------|
| `初期要望.txt` | ユーザー入力: 初期要望 |
| `Samples/` | サンプルプロジェクト |
| `0_RDRAZeroOne/phase1~4/` | 中間出力（フェーズ別TSV） |
| `1_RDRA/` | 統合出力（最終TSV + 関連データ） |
| `2_RDRASpec/` | 仕様出力（Markdown + JSON） |

## usdm-rdra スキル（差分パイプライン型）

USDM x Event Sourcing による差分更新パイプライン。既存 `rdra` スキルのフルビルドに加え、変更要望単位での差分更新をサポートする。

### Skill 構成

```
.claude/skills/usdm-rdra/
├── SKILL.md                          # パイプラインオーケストレーション
├── references/
│   ├── usdm-schema.md                # USDM YAML スキーマ定義
│   ├── event-sourcing-rules.md       # イベントソーシングルール
│   ├── usdm/
│   │   ├── usdm-decompose.md         # USDM 分解タスク
│   │   └── usdm-snapshot-update.md   # USDM スナップショット更新
│   ├── rdra/
│   │   ├── rdra-diff-generate.md     # RDRA 差分生成
│   │   ├── rdra-snapshot-update.md   # RDRA スナップショット更新
│   │   └── rdra-initial-build.md     # RDRA 初期構築
│   └── sync/
│       └── sync-check.md             # 実装同期確認
```

### Data Flow（差分更新モード）

```
変更要望テキスト
  → Step1: USDM 分解      → docs/usdm/events/{id}/requirements.yaml
  → Step2: RDRA 差分生成   → docs/rdra/events/{id}/*.tsv
  → Step3: スナップショット → docs/rdra/latest/*.tsv
```

### docs ディレクトリ構成

| パス | 用途 |
|------|------|
| `docs/usdm/events/` | USDM イベント履歴 |
| `docs/usdm/latest/` | USDM 最新スナップショット |
| `docs/rdra/events/` | RDRA 差分イベント履歴 |
| `docs/rdra/latest/` | RDRA 最新スナップショット（TSV + 関連データ） |
| `docs/nfr/events/` | NFR グレード イベント履歴 |
| `docs/nfr/latest/` | NFR グレード 最新スナップショット |

## usdm-rdra-nfr スキル（非機能要求グレード定義）

RDRA モデルから IPA 非機能要求グレード 2018 に基づき、非機能要求を推論・対話・出力する。usdm-rdra スキルの後段に位置し、将来のシステムアーキテクチャ設計スキルへの入力となる。

### Skill 構成

```
.claude/skills/usdm-rdra-nfr/
├── SKILL.md                              # オーケストレーション
├── references/
│   ├── nfr-grade-schema.md               # NFR グレード YAML スキーマ
│   ├── nfr-grade-catalog.md              # IPA 6大項目カタログ
│   ├── nfr-inference-rules.md            # RDRA → NFR 推論ルール
│   ├── event-sourcing-rules.md           # NFR 用イベントソーシングルール
│   └── nfr/
│       ├── nfr-infer.md                  # Step1: RDRA から推論
│       ├── nfr-dialogue.md               # Step2: 対話で確認
│       ├── nfr-grade-output.md           # Step3: YAML 出力
│       └── nfr-snapshot-update.md        # スナップショット更新
└── scripts/
    ├── validateNfrGrade.js               # NFR YAML バリデーション
    └── schema-nfr-grade.json             # JSON スキーマ
```

### Data Flow

```
docs/rdra/latest/*.tsv（RDRA モデル）
  → Step1: RDRA モデルから NFR 推論
  → Step2: 対話で確認・調整
  → Step3: NFR グレード表 YAML 出力 → docs/nfr/events/{id}/nfr-grade.yaml
  → スナップショット更新             → docs/nfr/latest/nfr-grade.yaml
```

## usdm-rdra-nfr-arch スキル（アーキテクチャ設計）

RDRA モデルと NFR グレードからシステムアーキテクチャ・アプリケーションアーキテクチャ・データアーキテクチャを推論・対話・出力する。usdm-rdra-nfr スキルの後段に位置する。全テクノロジー記述はベンダーニュートラル（FaaS, CaaS(k8s), RDB 等）。クラウドベンダーへのマッピングは後続の別スキルの責務。

### Skill 構成

```
.claude/skills/usdm-rdra-nfr-arch/
├── SKILL.md                              # オーケストレーション
├── references/
│   ├── arch-schema.md                    # アーキテクチャ設計 YAML スキーマ
│   ├── arch-inference-rules.md           # RDRA+NFR → アーキテクチャ推論ルール
│   ├── event-sourcing-rules.md           # アーキテクチャ用イベントソーシングルール
│   └── arch/
│       ├── arch-infer.md                 # Step1: RDRA+NFR から推論
│       ├── arch-dialogue.md              # Step2: 対話で確認
│       ├── arch-output.md                # Step3: YAML 出力
│       └── arch-snapshot-update.md       # スナップショット更新
└── scripts/
    ├── validateArchDesign.js             # アーキテクチャ YAML バリデーション
    ├── generateArchDesignMd.js           # Markdown 生成
    └── schema-arch-design.json           # JSON スキーマ
```

### Data Flow

```
docs/rdra/latest/*.tsv + docs/nfr/latest/nfr-grade.yaml
  → Step1: RDRA+NFR からアーキテクチャ推論
  → Step2: 対話で確認・調整
  → Step3: arch-design.yaml 出力 → docs/arch/events/{id}/
  → スナップショット更新           → docs/arch/latest/
```

### docs ディレクトリ構成（追加分）

| パス | 用途 |
|------|------|
| `docs/arch/events/` | アーキテクチャ設計 イベント履歴 |
| `docs/arch/latest/` | アーキテクチャ設計 最新スナップショット |
| `docs/infra/events/` | インフラ設計 イベント履歴 |
| `docs/infra/latest/` | インフラ設計 最新スナップショット |

## usdm-rdra-nfr-arch-infra スキル（インフラ設計 + Arch フィードバック）

アーキテクチャ設計（arch-design.yaml）を MCL product-design スキルの入力に変換し、クラウドインフラ設計を生成。結果をアーキテクチャ設計にフィードバックする。usdm-rdra-nfr-arch スキルの後段に位置する。Foundation コンテキストは必須、Shared Platform コンテキストは任意。

### Skill 構成

```
.claude/skills/usdm-rdra-nfr-arch-infra/
├── SKILL.md                              # オーケストレーション
├── references/
│   ├── translation-mapping.md            # Arch+NFR → product-input 変換マッピング
│   ├── event-sourcing-rules.md           # インフラ用イベントソーシングルール
│   ├── infra-event-schema.md             # infra-event.yaml スキーマ
│   ├── arch-feedback-rules.md            # Arch フィードバックルール
│   └── infra/
│       ├── infra-translate.md            # Step1: 変換タスク
│       ├── infra-execute.md              # Step2: MCL 実行タスク
│       ├── infra-feedback.md             # Step3: フィードバックタスク
│       ├── infra-writeback-check.md      # Step4: Infra 書き戻しチェック
│       └── infra-snapshot-update.md      # スナップショット更新
└── scripts/
    ├── validateInfraEvent.js             # infra-event.yaml バリデーション
    ├── generateInfraEventMd.js           # Markdown 生成
    └── schema-infra-event.json           # JSON スキーマ
```

### Data Flow

```
docs/arch/latest/arch-design.yaml + docs/nfr/latest/nfr-grade.yaml
  → Step1: Arch+NFR → MCL Product Input 変換 → specs/product/input/product-input.yaml
  → Step2: mcl-product-design 実行          → specs/product/output/, docs/infra/events/
  → Step3: Infra フィードバック → Arch 更新  → docs/arch/events/{feedback_id}/
  → Step4: Infra 書き戻しチェック            → 再実行要否を判定（要なら Step1 に戻る）
```

### docs ディレクトリ構成（追加分）

| パス | 用途 |
|------|------|
| `docs/infra/events/` | インフラ設計 イベント履歴（mcl-output/ 含む） |
| `docs/infra/latest/` | インフラ設計 最新スナップショット（mcl-output/ 含む） |
| `specs/product/input/` | MCL product-design 入力（一時。実行後に docs/infra/ へ集約） |

## usdm-rdra-nfr-arch-infra-design スキル（デザインシステム生成）

アーキテクチャ設計・インフラ設計からデザインシステムを生成し Storybook に変換する。usdm-rdra-nfr-arch-infra スキルの後段に位置する。

### Skill 構成

```
.claude/skills/usdm-rdra-nfr-arch-infra-design/
├── SKILL.md                              # オーケストレーション（10ステップ）
├── references/
│   ├── event-sourcing-rules.md           # Step10: イベントソーシングルール
│   └── design/
│       ├── design-infer.md               # Step1: モデル分析タスク
│       ├── design-dialogue.md            # Step2: 対話フロー
│       ├── design-tokens-generate.md     # Step3: トークン生成ルール
│       ├── design-components-generate.md # Step3: コンポーネント仕様生成
│       ├── design-assets-generate.md     # Step6: Logo/Icon SVG 生成
│       ├── design-storybook-generate.md  # Step7: Storybook 生成 + emoji→Icon
│       └── design-lessons-learned.md     # Step7,8: 教訓・品質チェックリスト
└── scripts/
    ├── schema-design-event.json          # design-event.yaml JSON Schema
    ├── validateDesignEvent.js            # Step4: YAML バリデーション
    └── generateDesignEventMd.js          # Step5: Markdown 生成
```

### Data Flow

```
docs/rdra/latest/*.tsv + docs/nfr/latest/nfr-grade.yaml + docs/arch/latest/arch-design.yaml
  → Step1:  モデル分析・デザイン方針決定
  → Step2:  ユーザー確認（対話・選択肢提示）
  → Step3:  design-event.yaml 生成（brand/tokens/components/screens/states）
  → Step4:  validateDesignEvent.js でバリデーション
  → Step5:  generateDesignEventMd.js で Markdown 生成
  → Step6:  Logo/Icon SVG 生成（直接記述 or AI生成）
  → Step7:  Storybook プロジェクト生成（emoji禁止、Icon コンポーネント使用）
  → Step8:  画面確認（必須。chrome-devtools で目視確認）
  → Step9:  storybook build 検証
  → Step10: イベント記録・スナップショット更新
```

### docs ディレクトリ構成（追加分）

| パス | 用途 |
|------|------|
| `docs/design/events/` | デザインシステム イベント履歴 |
| `docs/design/latest/` | デザインシステム 最新スナップショット |
| `docs/design/latest/design-event.yaml` | 中核成果物（brand/tokens/components/screens/states） |
| `docs/design/latest/design-event.md` | Markdown 表現 |
| `docs/design/latest/assets/` | Logo SVG 3種 + Icon SVG セット |
| `docs/design/latest/storybook-app/` | Next.js + Storybook プロジェクト |

## usdm-rdra-nfr-arch-infra-design-spec スキル（Spec 生成）

RDRA モデル・NFR グレード・アーキテクチャ設計・デザインシステムから UC 単位の詳細仕様と全体横断 UX/UI 設計仕様を生成する。usdm-rdra-nfr-arch-infra-design スキルの後段に位置する。

### Skill 構成

```
.claude/skills/usdm-rdra-nfr-arch-infra-design-spec/
├── SKILL.md                              # オーケストレーション（8ステップ）
├── references/
│   ├── event-sourcing-rules.md           # イベントソーシングルール
│   ├── spec-event-schema.md              # spec-event.yaml スキーマ定義
│   └── specs/
│       ├── spec-template.md              # UC Spec フォーマット（OpenAPI/AsyncAPI/コンポーネント設計拡張）
│       ├── spec-generate.md              # UC Spec 生成タスク（全モデル参照）
│       ├── spec-snapshot-update.md       # スナップショット更新ルール
│       ├── spec-analyse.md              # Step1: モデル分析タスク
│       ├── cross-cutting-template.md     # 全体横断 Spec テンプレート
│       ├── openapi-rules.md              # OpenAPI 3.1 生成ルール
│       ├── asyncapi-rules.md             # AsyncAPI 3.0 生成ルール
│       ├── data-visualization-rules.md   # データ可視化設計ルール
│       └── ux-psychology-glossary.md     # UX 心理学用語集
└── scripts/
    ├── validateSpecEvent.js              # Spec バリデーション
    ├── generateSpecEventMd.js            # Markdown 生成
    └── schema-spec-event.json            # JSON スキーマ
```

### Data Flow

```
docs/rdra/latest/*.tsv + docs/nfr/latest/nfr-grade.yaml + docs/arch/latest/arch-design.yaml + docs/design/latest/design-event.yaml
  → Step1: モデル分析・Spec方針決定（`date` でタイムスタンプ取得、UCティアマッピング）
  → Step2: 全体横断 UX/UI 設計（UC の前に先行確定。RDRA+design-event.yaml から）
  → Step3: UC 単位 Spec 生成（RDRA トレーサビリティ4テーブル + mermaid、_api-summary.yaml）
  → Step3.5: BUC 単位 Spec 生成（UC 横断データフロー、状態遷移全体図、共有条件/バリエーション）
  → Step4: 全体横断統合（API/AsyncAPI + 共通コンポーネント + トレーサビリティマトリクス → 網羅率）
  → Step5: spec-event.yaml 生成
  → Step6: validateSpecEvent.js でバリデーション
  → Step7: generateSpecEventMd.js で Markdown 生成
  → Step8: スナップショット更新
  → Step9: Storybook Story 生成（Logo 利用、design スキルの references 参照）
```

### docs ディレクトリ構成（追加分）

| パス | 用途 |
|------|------|
| `docs/specs/events/` | Spec イベント履歴 |
| `docs/specs/latest/` | Spec 最新スナップショット |
| `docs/specs/latest/{業務名}/{BUC名}/{UC名}/` | UC 単位 Spec（spec.md, tier-{tier_id}.md（arch 動的）） |
| `docs/specs/latest/_cross-cutting/` | 全体横断 UX/UI/データ可視化仕様、OpenAPI、AsyncAPI |
| `docs/specs/latest/spec-event.yaml` | メタデータ（UC一覧、統計） |

## External Resources

- **RDRAGraph**: https://vsa.co.jp/rdratool/graph/v0.94/
- **Google Spreadsheet Template**: https://docs.google.com/spreadsheets/d/1h7J70l6DyXcuG0FKYqIpXXfdvsaqjdVFwc6jQXSh9fM/
