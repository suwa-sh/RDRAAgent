# CLAUDE.md

## Project Overview

RDRAAgent は RDRA（Relationship Driven Requirement Analysis）2.0 の要件定義プロセスを **Claude Code の agent skill** として実装したツール。初期要望テキストから4フェーズで段階的にRDRAモデルを自動生成し、仕様まで作成する。upstream: https://github.com/vsakanzaki/RDRAAgent0.7

## Architecture

### Skill 構成

```
.claude/skills/rdra/
├── SKILL.md                  # オーケストレーション（フェーズ定義・並列実行指示）
├── references/               # タスクプロンプト・ナレッジ
│   ├── rdra-knowledge.md     # RDRA基本概念（全フェーズ共通）
│   ├── rdra-graph.md         # RDRAGraph データ構造
│   ├── rdra-sheet.md         # RDRASheet フォーマット
│   ├── phase1/               # Phase1 タスクプロンプト（5タスク）
│   ├── phase2/               # Phase2 タスクプロンプト（3タスク）
│   ├── phase3/               # Phase3 タスクプロンプト（2タスク）
│   ├── phase4/               # Phase4 タスクプロンプト（8タスク）
│   └── spec/                 # 仕様生成タスクプロンプト（6タスク）
└── scripts/
    ├── makeBUC.js            # ph3BUC + ph4UC* → 1_RDRA/BUC.tsv（12列展開）
    ├── attachContext.js      # 条件・バリエーション・状態にコンテキスト列を付与
    ├── rdraFileCopy.js       # システム概要・アクター・外部システム・情報を1_RDRAへコピー
    ├── makeGraphData.js      # RDRAGraph用 1_RDRA/if/関連データ.txt 生成
    └── makeZeroOneData.js    # RDRASheet用 1_RDRA/if/ZeroOne.txt 生成
```

### Data Flow

```
初期要望.txt
  → Phase1（5タスク並列）  → 0_RDRAZeroOne/phase1/（ph1業務, ph1ビジネスポリシー, ph1ビジネスパラメータ, ph1要求, システム概要）
  → Phase2（3タスク並列）  → 0_RDRAZeroOne/phase2/（ph2アクティビティ, ph2条件, ph2状態）
  → Phase3（2タスク並列）  → 0_RDRAZeroOne/phase3/（ph3BUC, ph3バリエーション）
  → Phase4（8タスク並列）  → 0_RDRAZeroOne/phase4/（ph4アクター, ph4外部システム, ph4UCアクター, ph4UCタイマー, ph4UC外部システム, ph4情報, ph4条件, ph4状態）
  → RDRA統合
    1. makeBUC.js        → 1_RDRA/BUC.tsv（12列展開）
    2. attachContext.js  → 1_RDRA/{条件,バリエーション,状態}.tsv（コンテキスト付与）
    3. rdraFileCopy.js   → 1_RDRA/{システム概要.json,アクター.tsv,外部システム.tsv,情報.tsv}
    4. makeGraphData.js  → 1_RDRA/if/関連データ.txt
    5. makeZeroOneData.js → 1_RDRA/if/ZeroOne.txt（オプション）
  → 仕様生成              → 2_RDRASpec/（論理データ・ビジネスルール・画面定義）
```

### フェーズ間の依存関係

- Phase1: `rdra-knowledge.md` + `初期要望.txt` → 5タスク並列
- Phase2: Phase1出力（ph1業務, ph1ビジネスポリシー, ph1要求）→ 3タスク並列
- Phase3: Phase1出力 + Phase2出力（ph2アクティビティ, ph2条件, ph2状態）→ 2タスク並列
- Phase4: Phase3出力（ph3BUC, ph3バリエーション）+ Phase2出力（ph2状態）+ Phase1出力（ph1要求）→ 8タスク並列
- 仕様生成: 1_RDRA/ のデータ → 2_RDRASpec/

## Key Rules

1. **No npm Dependencies**: 外部ライブラリに依存しない。Node.js 標準モジュールのみ使用
2. **TSV Format**: UTF-8、タブ区切り、1行目はヘッダー、空フィールドでもタブ区切りを省略しない
3. **File Generation**: テンプレートやプレースホルダーは作成しない。必ず完全な内容を生成する
4. **JavaScript Only**: ヘルパースクリプトは JavaScript のみ
5. **No Program Generation**: プロンプトはプログラム生成を禁止

## File Organization

| パス | 用途 |
|------|------|
| `初期要望.txt` | ユーザー入力: 初期要望 |
| `Samples/` | サンプルプロジェクト |
| `0_RDRAZeroOne/phase1~4/` | 中間出力（フェーズ別TSV、ph1/ph2/ph3/ph4 プレフィックス） |
| `1_RDRA/` | 統合出力（最終TSV + 関連データ） |
| `2_RDRASpec/` | 仕様出力（Markdown + JSON） |

## External Resources

- **RDRAGraph**: https://vsa.co.jp/rdratool/graph/v0.94/
- **Google Spreadsheet Template**: https://docs.google.com/spreadsheets/d/1h7J70l6DyXcuG0FKYqIpXXfdvsaqjdVFwc6jQXSh9fM/
