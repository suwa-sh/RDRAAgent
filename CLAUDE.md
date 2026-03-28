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
│   ├── specs/
│   │   ├── spec-template.md          # Spec テンプレート定義
│   │   ├── spec-generate.md          # Spec 生成
│   │   └── spec-snapshot-update.md   # Spec スナップショット更新
│   └── sync/
│       └── sync-check.md             # 実装同期確認
```

### Data Flow（差分更新モード）

```
変更要望テキスト
  → Step1: USDM 分解      → docs/usdm/events/{id}/requirements.yaml
  → Step2: RDRA 差分生成   → docs/rdra/events/{id}/*.tsv
  → Step3: スナップショット → docs/rdra/latest/*.tsv
  → Step4: Spec 生成       → docs/specs/events/{id}/{UC名}/
  → Step5: Spec 更新       → docs/specs/latest/{UC名}/
```

### docs ディレクトリ構成

| パス | 用途 |
|------|------|
| `docs/usdm/events/` | USDM イベント履歴 |
| `docs/usdm/latest/` | USDM 最新スナップショット |
| `docs/rdra/events/` | RDRA 差分イベント履歴 |
| `docs/rdra/latest/` | RDRA 最新スナップショット（TSV + 関連データ） |
| `docs/specs/events/` | Spec イベント履歴 |
| `docs/specs/latest/` | Spec 最新スナップショット（UC 単位） |
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

## External Resources

- **RDRAGraph**: https://vsa.co.jp/rdratool/graph/v0.94/
- **Google Spreadsheet Template**: https://docs.google.com/spreadsheets/d/1h7J70l6DyXcuG0FKYqIpXXfdvsaqjdVFwc6jQXSh9fM/
