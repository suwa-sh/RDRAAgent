# RDRAAgent

[kanzaki/RDRAAgent_v0.6](https://github.com/kanzaki/RDRAAgent_v0.6) を fork し、Node.js CLIメニュー方式から **Claude Code の agent skill** として再パッケージングしたものです。

RDRA（Relationship Driven Requirement Analysis）2.0 の要件定義プロセスを、初期要望テキストから段階的にRDRAモデルを自動生成し、仕様・非機能要件まで作成します。

## スキル構成

### rdra（フルビルド型）

初期要望テキストから RDRA モデルを一括生成するスタンドアロンのスキルです。

```
初期要望.txt → Phase1〜5（並列タスク） → RDRAモデル(TSV) → 仕様生成
```

| トリガー例 | 入力 | 出力 |
|-----------|------|------|
| 「要件定義して」「RDRAで分析して」 | `初期要望.txt` | `1_RDRA/*.tsv`, `2_RDRASpec/` |

### usdm-rdra → usdm-rdra-nfr（差分パイプライン型）

変更要望の差分更新から非機能要件定義までを段階的に連携するスキルチェーンです。`usdm-rdra` の初期構築モードは内部で `rdra` スキルを呼び出します。

```
usdm-rdra                          usdm-rdra-nfr
（機能要件: 差分パイプライン）        （非機能要件: グレード定義）

変更要望テキスト                     docs/rdra/latest/*.tsv
  → USDM分解                          → NFRグレード推論
  → RDRA差分更新   ─── 入力 ───→       → 対話で確認・調整
  → Spec生成(BDD)                      → nfr-grade.yaml出力
```

| スキル | トリガー例 | 入力 | 出力 |
|--------|-----------|------|------|
| **usdm-rdra** | 「差分で要件更新」「変更要望を反映」 | 変更要望テキスト | `docs/usdm/`, `docs/rdra/`, `docs/specs/` |
| **usdm-rdra-nfr** | 「非機能要求を整理」「NFRグレードを作成」 | `docs/rdra/latest/` | `docs/nfr/latest/nfr-grade.yaml` |

## 必要な環境

- **Claude Code** (CLI / Desktop App / IDE Extension)
- **Node.js** v18以上（ヘルパースクリプト用）

npm install は不要です。外部ライブラリに依存しません。

## セットアップ

```bash
git clone https://github.com/suwa-sh/RDRAAgent.git
cd RDRAAgent
```

### グローバルインストール（全プロジェクトで利用可能）

```bash
./install.sh
```

`~/.claude/skills/` に `rdra`, `usdm-rdra`, `usdm-rdra-nfr` のシンボリックリンクが作成され、どのプロジェクトからでもスキルを利用できます。

### プロジェクト固有インストール

```bash
./install.sh /path/to/your/project
```

`<project>/.claude/skills/` に各スキルのリンクが作成されます。

### このリポジトリ内で直接動作確認

セットアップ不要です。`.claude/skills/` に全スキルが含まれているため、このディレクトリで Claude Code を起動すればそのまま使えます。

## 使い方

### 1. 初期要望を準備する

プロジェクトルートに `初期要望.txt` を作成し、実現したいビジネスとシステムについて記述します。

```
システム名: 図書館管理システム
要求:
- 蔵書の貸出・返却管理
- 利用者の登録管理
- 蔵書の検索機能
...
```

`Samples/` フォルダーにサンプルがあるので参考にしてください。

### 2. Claude Code で要件定義を実行する

Claude Code を起動し、以下のように依頼します:

```
要件定義して
```

または特定のフェーズだけ実行したい場合:

```
Phase1だけ実行して
```

RDRAスキルが自動的に呼び出され、以下のフェーズが順に実行されます:

| フェーズ | 内容 | 出力先 |
|---------|------|--------|
| Phase1 | 基礎要素の特定（11タスク並列） | `0_RDRAZeroOne/phase1/` |
| Phase2 | 要素の詳細化（3タスク並列） | `0_RDRAZeroOne/phase2/` |
| Phase3 | コンテキスト整理（3タスク並列） | `0_RDRAZeroOne/phase3/` |
| Phase4 | 関係モデル変換（4タスク並列） | `0_RDRAZeroOne/phase4/` |
| Phase5 | システム概要生成 | `1_RDRA/` |
| RDRA統合 | 最終出力の集約 + 関連データ生成 | `1_RDRA/` |

### 3. 仕様を生成する

要件定義完了後、仕様生成を依頼します:

```
仕様を作って
```

| 出力ファイル | 内容 |
|------------|------|
| `2_RDRASpec/論理データモデル.md` | 論理データモデル |
| `2_RDRASpec/ビジネスルール.md` | ビジネスルール |
| `2_RDRASpec/画面照会.json` | 画面定義 |

### 4. 差分で要件を更新する（usdm-rdra）

初回の要件定義後、変更要望が発生したら差分パイプラインで更新します。

```
変更要望を反映して
```

変更要望テキストを USDM（要求・理由・仕様）に分解し、RDRA モデルを差分更新し、影響を受けた UC の Spec（BDD 完了条件付き）を自動生成します。

```
変更要望テキスト
  → USDM分解       → docs/usdm/events/{id}/requirements.yaml
  → RDRA差分更新    → docs/rdra/events/{id}/*.tsv → docs/rdra/latest/
  → Spec生成(BDD)   → docs/specs/events/{id}/     → docs/specs/latest/
```

すべての変更はイベントソーシングで履歴管理されます。

### 5. 非機能要求を定義する（usdm-rdra-nfr）

RDRA モデルが完成したら、非機能要求グレード（IPA 2018準拠）を定義します。

```
非機能要求を整理して
```

RDRA モデルから6大項目（可用性・性能・運用・移行・セキュリティ・環境）のグレードを自動推論し、選択肢形式の対話で確認・調整した後、`nfr-grade.yaml` として出力します。

```
docs/rdra/latest/*.tsv
  → Step1: 自動推論（BUC→可用性、アクター→性能、情報→セキュリティ等）
  → Step2: 対話確認（モデルシステム選定 → 重要項目 → 要確認項目）
  → Step3: nfr-grade.yaml + nfr-grade.md 出力
```

### 6. 可視化・エクスポート

要件定義の結果を外部ツールで確認できます:

- **RDRAGraph**: `1_RDRA/関連データ.txt` の内容をクリップボードにコピーし、[RDRAGraph](https://vsa.co.jp/rdratool/graph/v0.94/) に貼り付けて可視化
- **Google Spreadsheet**: `1_RDRA/ZeroOne.txt` を[テンプレート](https://docs.google.com/spreadsheets/d/1h7J70l6DyXcuG0FKYqIpXXfdvsaqjdVFwc6jQXSh9fM/)のZeroOneシートに貼り付け

## ディレクトリ構成

```
RDRAAgent/
├── .claude/skills/
│   ├── rdra/                     # スキル: フルビルド型 RDRA
│   │   ├── SKILL.md
│   │   ├── references/           # タスクプロンプト・ナレッジ
│   │   └── scripts/              # makeGraphData.js, makeZeroOneData.js
│   ├── usdm-rdra/                # スキル: 差分パイプライン型
│   │   ├── SKILL.md
│   │   ├── references/           # USDM分解・RDRA差分・Spec生成
│   │   └── scripts/              # バリデーション・Markdown生成
│   └── usdm-rdra-nfr/            # スキル: 非機能要求グレード
│       ├── SKILL.md
│       ├── references/           # NFRカタログ・推論ルール・対話フロー
│       └── scripts/              # バリデーション・グレード表生成
├── Samples/                      # サンプルプロジェクト
├── 初期要望.txt                   # 入力: 初期要望（rdra スキル用）
├── 0_RDRAZeroOne/                # 出力: rdra フェーズ別中間成果物
├── 1_RDRA/                       # 出力: rdra 統合データ
├── 2_RDRASpec/                   # 出力: rdra 仕様ドキュメント
└── docs/                         # 出力: usdm-rdra / usdm-rdra-nfr
    ├── usdm/                     #   USDM 要求（イベント + スナップショット）
    ├── rdra/                     #   RDRA 要件（イベント + スナップショット）
    ├── specs/                    #   Spec 仕様（UC x ティア、BDD）
    └── nfr/                      #   非機能要求グレード
```

## TSVファイル形式

- エンコーディング: UTF-8
- 区切り文字: タブ
- 1行目: ヘッダー（カラム名）

## RDRA の基本概念

| 用語 | 説明 |
|------|------|
| アクター | システムを利用する人の役割 |
| 外部システム | 連携する外部システム |
| 業務 | 会社の機能単位 |
| BUC | ビジネスユースケース（業務の価値実現単位） |
| 情報 | システムが扱うビジネス情報 |
| 状態 | 情報の変化を管理する状態モデル |
| 条件 | ビジネスルールや制約 |
| バリエーション | 業務のバリエーションパラメータ |

詳細は `.claude/skills/rdra/references/rdra-knowledge.md` を参照してください。

## 参考リンク

- [RDRAツール公式サイト](https://vsa.co.jp/rdratool/)
- [RDRAGraph](https://vsa.co.jp/rdratool/graph/)

## ライセンス

MIT License
