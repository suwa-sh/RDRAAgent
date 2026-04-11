---
name: rdra
description: >
  RDRA（Relationship Driven Requirement Analysis）2.0 による要件定義モデリングスキル。
  初期要望テキストから4フェーズで段階的にRDRAモデルを自動生成し、さらに仕様（論理データモデル・ビジネスルール・画面定義）まで作成する。
  要件定義、要件分析、RDRA、RDRAモデル、ビジネスユースケース、BUC、アクター、情報モデル、状態モデル、
  要求分析、初期要望、業務分析、システム仕様に関するタスクで使用する。
  ユーザーが「要件定義して」「RDRAで分析して」「初期要望から要件を整理して」「BUCを作って」
  「アクターを洗い出して」「仕様を作って」などと言ったら積極的にこのスキルを使うこと。
  引数に「ファイルのみ」「files」「説明のみ」などを含めると files モード（ファイル生成のみで外部ツール起動なし、
  使い方はチャットで説明）、指定なしなら full モード（RDRAGraph / Spreadsheet / 画面照会 まで全起動）で動作する。
---

# RDRA要件定義スキル

RDRA 2.0（Relationship Driven Requirement Analysis）の手法に基づき、初期要望テキストから段階的にRDRAモデルを自動生成する。

## 前提条件

- 作業ディレクトリに `初期要望.txt` が存在すること
- `初期要望.txt` は実現したいビジネスとシステムについて自然言語で記述されたテキスト

## 全体フロー

```
初期要望.txt
  → Phase1: 基礎要素の特定（5タスク並列）
  → Phase2: アクティビティ・条件・状態の詳細化（3タスク並列）
  → Phase3: BUC・バリエーションの整理（2タスク並列）
  → Phase4: 関係モデル変換（8タスク並列）
  → RDRA統合（1_RDRA/ へ集約 + 関連データ + ZeroOne データ生成）
  → 仕様生成（論理データ・ビジネスルール・画面定義 + 画面照会）
  → 外部ツール連携（RDRAGraph 表示 / Spreadsheet 展開 / 画面照会表示）
```

### 実行モード（引数で切り替え）

スキル引数のテキストに含まれるキーワードで **2 つのモード** を切り替える。特定フェーズ指定よりも優先してモード判定を行うこと。

| モード | 判定キーワード（いずれか含む） | 挙動 |
|--------|---------------------------------|------|
| **full**（既定） | 指定なし / `full` / `all` / `一括` / `すべて実行` | Phase1-4 → RDRA統合 → 仕様生成 → 外部ツール 11/12/22 を **連続起動**。【11】【12】起動後は各ターンで停止（クリップボード上書き回避のため） |
| **files** | `files` / `files-only` / `ファイルのみ` / `説明のみ` / `no-launch` / `explain` | Phase1-4 → RDRA統合 → 仕様生成 までファイルを全部生成するが、**外部ツールは起動しない**。代わりに最終メッセージで RDRAGraph / Spreadsheet / 画面照会 の使い方をチャット説明する |

### デフォルト動作（指示なし時）

引数がない、またはモードキーワードが含まれない場合は **full モード** として動作する。

ユーザーが特定フェーズや特定ステップだけを指定した場合は、その指定範囲のみを実行する（モード選択より優先）。

### files モードの最終メッセージ要件

files モードで全フェーズ完了後、最終メッセージに **必ず以下を含めて** ターンを終えること（外部ツールは **絶対に起動しない**）:

1. **生成ファイル一覧（カテゴリ別、相対パス + 一行説明付き）**
   - `0_RDRAZeroOne/phase1/` — Phase1 の 5 ファイル
   - `0_RDRAZeroOne/phase2/` — Phase2 の 3 ファイル
   - `0_RDRAZeroOne/phase3/` — Phase3 の 2 ファイル
   - `0_RDRAZeroOne/phase4/` — Phase4 の 8 ファイル
   - `1_RDRA/` — 統合後の 8 ファイル + `if/関連データ.txt` + `if/ZeroOne.txt`
   - `2_RDRASpec/` — 論理データモデル.md / ビジネスルール.md / 画面照会.json / phase1 配下 3 ファイル
2. **【11】RDRAGraph への反映方法** — 手元でユーザーが実行するコマンドとブラウザ操作:
   ```bash
   node <skill-path>/scripts/copyToClipboard.js graph
   open "https://vsa.co.jp/rdratool/graph/v0.94/index.html?clipboard"
   ```
   ブラウザで「クリップボードから読み込み」ボタンを押す
3. **【12】Spreadsheet への反映方法** — 手元でユーザーが実行するコマンドとブラウザ操作:
   ```bash
   node <skill-path>/scripts/copyToClipboard.js zeroone
   open "https://docs.google.com/spreadsheets/d/1h7J70l6DyXcuG0FKYqIpXXfdvsaqjdVFwc6jQXSh9fM/copy"
   ```
   コピーしたスプレッドシートの ZeroOne シートで A1 セルに貼り付け（Cmd+V/Ctrl+V）→ Import ボタン
4. **【22】画面照会の起動・アクセス方法** — 手元でユーザーが実行するコマンドとブラウザ操作:
   ```bash
   node <skill-path>/scripts/web_tool/bucActorUI.js  # ポート 3002、Ctrl+C で停止
   open "http://localhost:3002/"
   ```
   すでに 3002 が占有されている場合は `lsof -i :3002` で確認して停止

## 共通ルール

### TSVファイルの出力規則
- 出力形式: TSV（タブ区切り）
- エンコーディング: UTF-8
- 1行目は必ずヘッダー（カラム名）行を出力する
- 空フィールドにするときは、タブ区切りを省略しない
- 出力内容の判断に迷った場合は可能性の一番高いものを選択する
- プログラムは絶対に生成しない

### ファイル生成の原則
- テンプレートやプレースホルダーのファイルは作成しない — 必ず完全な内容を生成する
- 既存ファイルがある場合は上書きする
- 出力先ディレクトリが存在しない場合は作成する

---

## Phase1: 基礎要素の特定

初期要望から RDRA の基本要素を個別に洗い出す。

### 共通コンテキスト
以下のファイルを読み込んで理解する:
- `references/rdra-knowledge.md` — RDRA基本概念
- `初期要望.txt` — ユーザーの要望

### タスク（並列実行）
以下のタスクプロンプトを **subagent で並列実行** する。各 subagent には上記の共通コンテキスト（rdra-knowledge.md と 初期要望.txt）を読んだ上で、指定のタスクプロンプトに従って実行するよう指示する:

| # | タスクプロンプト | 出力ファイル |
|---|----------------|-------------|
| 1 | `references/phase1/業務生成.md` | `0_RDRAZeroOne/phase1/ph1業務.tsv` |
| 2 | `references/phase1/ビジネスポリシー生成.md` | `0_RDRAZeroOne/phase1/ph1ビジネスポリシー.tsv` |
| 3 | `references/phase1/ビジネスパラメータ生成.md` | `0_RDRAZeroOne/phase1/ph1ビジネスパラメータ.tsv` |
| 4 | `references/phase1/要求生成.md` | `0_RDRAZeroOne/phase1/ph1要求.tsv` |
| 5 | `references/phase1/システム概要生成.md` | `0_RDRAZeroOne/phase1/システム概要.json` |

### 出力チェック
以下のファイルが `0_RDRAZeroOne/phase1/` に生成されていることを確認:
- `ph1業務.tsv`, `ph1ビジネスポリシー.tsv`, `ph1ビジネスパラメータ.tsv`, `ph1要求.tsv`, `システム概要.json`

---

## Phase2: アクティビティ・条件・状態の詳細化

Phase1の出力を基に、業務をアクティビティにブレークダウンし、条件・状態を詳細化する。

### 共通コンテキスト
以下のファイルを読み込んで理解する:
- `references/rdra-knowledge.md` — RDRA基本概念
- `初期要望.txt` — ユーザーの要望
- `0_RDRAZeroOne/phase1/ph1業務.tsv`
- `0_RDRAZeroOne/phase1/ph1ビジネスポリシー.tsv`
- `0_RDRAZeroOne/phase1/ph1要求.tsv`

### タスク（並列実行）
以下のタスクプロンプトを **subagent で並列実行** する。各 subagent には上記の共通コンテキストを読んだ上で実行するよう指示する:

| # | タスクプロンプト | 出力ファイル |
|---|----------------|-------------|
| 1 | `references/phase2/アクティビティ生成.md` | `0_RDRAZeroOne/phase2/ph2アクティビティ.tsv` |
| 2 | `references/phase2/条件生成.md` | `0_RDRAZeroOne/phase2/ph2条件.tsv` |
| 3 | `references/phase2/状態生成.md` | `0_RDRAZeroOne/phase2/ph2状態.tsv` |

### 出力チェック
以下のファイルが `0_RDRAZeroOne/phase2/` に生成されていることを確認:
- `ph2アクティビティ.tsv`, `ph2条件.tsv`, `ph2状態.tsv`

---

## Phase3: BUC・バリエーションの整理

Phase2の出力を基に、UCの洗出しとバリエーションを整理する。

### 共通コンテキスト
以下のファイルを読み込んで理解する:
- `references/rdra-knowledge.md` — RDRA基本概念
- `初期要望.txt` — ユーザーの要望
- `0_RDRAZeroOne/phase1/ph1業務.tsv`
- `0_RDRAZeroOne/phase1/ph1ビジネスポリシー.tsv`
- `0_RDRAZeroOne/phase1/ph1ビジネスパラメータ.tsv`
- `0_RDRAZeroOne/phase1/ph1要求.tsv`
- `0_RDRAZeroOne/phase2/ph2アクティビティ.tsv`
- `0_RDRAZeroOne/phase2/ph2条件.tsv`
- `0_RDRAZeroOne/phase2/ph2状態.tsv`

### タスク（並列実行）
以下のタスクプロンプトを **subagent で並列実行** する:

| # | タスクプロンプト | 出力ファイル |
|---|----------------|-------------|
| 1 | `references/phase3/BUC生成.md` | `0_RDRAZeroOne/phase3/ph3BUC.tsv` |
| 2 | `references/phase3/バリエーション生成.md` | `0_RDRAZeroOne/phase3/ph3バリエーション.tsv` |

### 出力チェック
以下のファイルが `0_RDRAZeroOne/phase3/` に生成されていることを確認:
- `ph3BUC.tsv`, `ph3バリエーション.tsv`

---

## Phase4: 関係モデル変換

Phase3の出力を RDRASheet 形式の最終フォーマットに変換する。

### 共通コンテキスト
以下のファイルを読み込んで理解する:
- `references/rdra-knowledge.md` — RDRA基本概念
- `初期要望.txt` — ユーザーの要望
- `0_RDRAZeroOne/phase3/ph3BUC.tsv`
- `0_RDRAZeroOne/phase3/ph3バリエーション.tsv`
- `0_RDRAZeroOne/phase2/ph2状態.tsv`
- `0_RDRAZeroOne/phase1/ph1要求.tsv`

### タスク（並列実行）
以下のタスクプロンプトを **subagent で並列実行** する:

| # | タスクプロンプト | 出力ファイル |
|---|----------------|-------------|
| 1 | `references/phase4/アクター生成.md` | `0_RDRAZeroOne/phase4/ph4アクター.tsv` |
| 2 | `references/phase4/外部システム生成.md` | `0_RDRAZeroOne/phase4/ph4外部システム.tsv` |
| 3 | `references/phase4/UCアクター生成.md` | `0_RDRAZeroOne/phase4/ph4UCアクター.tsv` |
| 4 | `references/phase4/UCタイマー生成.md` | `0_RDRAZeroOne/phase4/ph4UCタイマー.tsv` |
| 5 | `references/phase4/UC外部システム生成.md` | `0_RDRAZeroOne/phase4/ph4UC外部システム.tsv` |
| 6 | `references/phase4/情報生成.md` | `0_RDRAZeroOne/phase4/ph4情報.tsv` |
| 7 | `references/phase4/条件生成.md` | `0_RDRAZeroOne/phase4/ph4条件.tsv` |
| 8 | `references/phase4/状態生成.md` | `0_RDRAZeroOne/phase4/ph4状態.tsv` |

### 出力チェック
以下のファイルが `0_RDRAZeroOne/phase4/` に生成されていることを確認:
- `ph4アクター.tsv`, `ph4外部システム.tsv`, `ph4UCアクター.tsv`, `ph4UCタイマー.tsv`, `ph4UC外部システム.tsv`, `ph4情報.tsv`, `ph4条件.tsv`, `ph4状態.tsv`

---

## RDRA統合: 1_RDRA/ への集約

Phase4 の最終出力を `1_RDRA/` ディレクトリに集約する。

### システム概要コピー
`0_RDRAZeroOne/phase1/システム概要.json` を `1_RDRA/システム概要.json` にコピーする。

### 実行手順
以下の 4つのスクリプトを順番に実行する。各スクリプトは作業ディレクトリ（`初期要望.txt` がある場所）で実行すること。

#### 1. BUC の展開（makeBUC.js）
`ph3BUC.tsv` + `ph4UC*.tsv` から、12列の関連モデル展開形式の `1_RDRA/BUC.tsv` を生成:
```bash
node <skill-path>/scripts/makeBUC.js
```
- 入力: `0_RDRAZeroOne/phase3/ph3BUC.tsv`, `0_RDRAZeroOne/phase4/ph4UCアクター.tsv`, `ph4UCタイマー.tsv`, `ph4UC外部システム.tsv`
- 出力: `1_RDRA/BUC.tsv`（12列: 業務/BUC/先/アクティビティ/次/UC/関連モデル1/関連オブジェクト1/関連モデル2/関連オブジェクト2/説明/画面要求）
- 1つの UC を情報/条件/画面+アクター/イベント+外部システム/タイマーの関連行に展開

#### 2. コンテキスト付与（attachContext.js）
`ph4情報.tsv` のコンテキスト列を推論して、条件・バリエーション・状態に付与:
```bash
node <skill-path>/scripts/attachContext.js
```
- `0_RDRAZeroOne/phase4/ph4条件.tsv` → `1_RDRA/条件.tsv`（コンテキスト列追加）
- `0_RDRAZeroOne/phase3/ph3バリエーション.tsv` → `1_RDRA/バリエーション.tsv`（コンテキスト列追加）
- `0_RDRAZeroOne/phase4/ph4状態.tsv` → `1_RDRA/状態.tsv`（コンテキスト列追加）

#### 3. ファイルコピー（rdraFileCopy.js）
システム概要、アクター、外部システム、情報を `1_RDRA/` にコピー:
```bash
node <skill-path>/scripts/rdraFileCopy.js
```
- `phase1/システム概要.json` → `1_RDRA/システム概要.json`
- `phase4/ph4アクター.tsv` → `1_RDRA/アクター.tsv`
- `phase4/ph4外部システム.tsv` → `1_RDRA/外部システム.tsv`
- `phase4/ph4情報.tsv` → `1_RDRA/情報.tsv`

#### 4. 関連データ生成（makeGraphData.js）
RDRAGraph 可視化用の関連データを生成:
```bash
node <skill-path>/scripts/makeGraphData.js
```
- 出力: `1_RDRA/if/関連データ.txt`

#### 5. ZeroOne データ生成（makeZeroOneData.js）
Google Spreadsheet 貼り付け用の ZeroOne データを生成:
```bash
node <skill-path>/scripts/makeZeroOneData.js
```
- 出力: `1_RDRA/if/ZeroOne.txt`

### 出力チェック
`1_RDRA/` に以下の 8 ファイルが揃っていることを確認:
- `システム概要.json`, `アクター.tsv`, `外部システム.tsv`, `情報.tsv`, `状態.tsv`, `条件.tsv`, `バリエーション.tsv`, `BUC.tsv`

`1_RDRA/if/` に以下のファイルが生成されていること:
- `関連データ.txt`, `ZeroOne.txt`

---

## 仕様生成（Spec）

RDRA統合後の `1_RDRA/` データから仕様ドキュメントを生成する。
デフォルト動作では RDRA統合の直後に必ず実行する（ユーザーが「仕様は不要」と明示した場合のみスキップ）。

### Spec Phase1: 論理データ・ビジネスルール・画面定義

#### 共通コンテキスト
- `references/rdra-knowledge.md` — RDRA基本概念
- `references/rdra-graph.md` — RDRAGraph データ構造
- `1_RDRA/if/関連データ.txt` — RDRA定義の関連データ

#### タスク（並列実行）
| # | タスクプロンプト | 出力ファイル |
|---|----------------|-------------|
| 1 | `references/spec/21_論理データ生成.md` | `2_RDRASpec/論理データモデル.md` |
| 2 | `references/spec/22_ビジネスルール生成.md` | `2_RDRASpec/ビジネスルール.md` |
| 3 | `references/spec/23_画面一覧生成.md` | `2_RDRASpec/phase1/画面一覧.json` |
| 4 | `references/spec/24_BUC画面生成.md` | `2_RDRASpec/phase1/BUC画面.json` |
| 5 | `references/spec/25_アクター画面生成.md` | `2_RDRASpec/phase1/アクター画面.json` |

### Spec Phase2: 画面照会（Spec Phase1 完了後に実行）

#### 共通コンテキスト
Spec Phase1 の共通コンテキストに加えて:
- `2_RDRASpec/論理データモデル.md`
- `2_RDRASpec/phase1/BUC画面.json`
- `2_RDRASpec/phase1/アクター画面.json`
- `2_RDRASpec/phase1/画面一覧.json`

#### タスク
| # | タスクプロンプト | 出力ファイル |
|---|----------------|-------------|
| 1 | `references/spec/26_画面照会生成.md` | `2_RDRASpec/画面照会.json` |

### 仕様の出力チェック
`2_RDRASpec/` に以下のファイルが揃っていることを確認:
- `論理データモデル.md`, `ビジネスルール.md`, `画面照会.json`

---

## 外部ツール連携

upstream の `node menu` のメニュー 11, 12, 22 に相当する機能を提供する。

**モード別の扱い**:
- **full モード**: 仕様生成の完了後に **11 → 12 → 22 の順で連続起動** する。ただし 11 と 12 の各ツール起動後は必ず 1 ターン停止し、使い方・ペースト先・次の手順をユーザーに説明してから、ユーザーが明示的に「続けて」などと指示したら次の手順へ進むこと（理由: 11 と 12 はいずれもクリップボードを使用するため、ユーザーの貼り付け操作が終わる前に次の手順を実行するとクリップボード内容が上書きされて破損する）
- **files モード**: 以下のツールは **一切起動しない**。代わりに「files モードの最終メッセージ要件」に従い、チャット回答でコマンドと操作手順を説明するだけにする

### 順序厳守ルール（full モード）

以下の順序を **絶対に崩してはならない**:

1. 【11】RDRAGraph コピー & オープン → **必ず 1 ターン停止**（ユーザーに「クリップボードから読み込み」ボタンを押してもらう時間を確保）
2. ユーザーが「続けて」と明示したら 【12】Spreadsheet コピー & オープン → **必ず 1 ターン停止**（A1 貼り付け + Import ボタンの時間を確保）
3. ユーザーが「続けて」と明示したら 【22】画面照会サーバー起動

**並行実行・先取り実行の禁止**: 11 の停止中に 12 の準備をしてはならない（クリップボードを先に上書きするため）。TodoList やサブエージェントで「3 つまとめて起動」と解釈してはならない。順序はユーザーとの対話で 1 つずつ進めること。

### 【11】RDRAGraph 可視化
`1_RDRA/if/関連データ.txt` の内容をクリップボードにコピーし、ブラウザでRDRAGraphを開く:

```bash
# 1. 関連データ生成（未実施の場合）
node <skill-path>/scripts/makeGraphData.js

# 2. クリップボードにコピー
node <skill-path>/scripts/copyToClipboard.js graph

# 3. ブラウザで可視化ツールを開く（?clipboard で自動読込み）
# macOS
open "https://vsa.co.jp/rdratool/graph/v0.94/index.html?clipboard"
# Windows
start "" "https://vsa.co.jp/rdratool/graph/v0.94/index.html?clipboard"
```

**停止ポイント**: 起動後、以下の内容をユーザーに説明してからターンを終えること:
- ブラウザが開いた RDRAGraph 可視化ツールで **「クリップボードから読み込み」ボタン** を押すとクリップボードの関連データが取り込まれる
- `?clipboard` パラメータ付きで開いているが、ブラウザのクリップボード権限次第で自動読込みにならないことがあるため、ユーザーに明示的にボタンを押してもらうこと
- 可視化を確認したらユーザーが明示的に次に進む指示（例: 「続けて」）を出すのを待つ。勝手に【12】へ進まない

**トラブル時**:
- クリップボードに別データが入っている（例: この後 12 を先に実行してしまった場合）→ `node <skill-path>/scripts/copyToClipboard.js graph` でクリップボードを再取得し、ブラウザ側の「クリップボードから読み込み」ボタンを再押下してもらう
- 「関連データ.txt が無い」と出る → `node <skill-path>/scripts/makeGraphData.js` を実行（RDRA 統合の Step 4 が未実行）

### 【12】Google Spreadsheet へ展開
`1_RDRA/if/ZeroOne.txt` の内容をクリップボードにコピーし、ブラウザでテンプレートのコピー URL（`/copy`）を開く:

```bash
# 1. ZeroOneデータ生成（未実施の場合）
node <skill-path>/scripts/makeZeroOneData.js

# 2. クリップボードにコピー
node <skill-path>/scripts/copyToClipboard.js zeroone

# 3. ブラウザでテンプレートのコピー URL を開く（必ず /copy を付ける）
# macOS
open "https://docs.google.com/spreadsheets/d/1h7J70l6DyXcuG0FKYqIpXXfdvsaqjdVFwc6jQXSh9fM/copy"
# Windows
start "" "https://docs.google.com/spreadsheets/d/1h7J70l6DyXcuG0FKYqIpXXfdvsaqjdVFwc6jQXSh9fM/copy"
```

**停止ポイント**: 起動後、以下の内容をユーザーに説明してからターンを終えること:
1. ブラウザでテンプレートの「コピーを作成」ダイアログが表示されるので、自分のドライブにコピーする
2. コピーしたスプレッドシートの **ZeroOne シート** を開く
3. **ZeroOne シートの A1 セルを選択し、クリップボードの内容を貼り付け（Cmd+V / Ctrl+V）**
4. その後 ZeroOne シート上の **Import ボタン** を押すと、貼り付けた内容が各 RDRA シート（業務・BUC・アクター・情報・状態・条件 など）に反映される
5. 確認が済んだらユーザーが明示的に次に進む指示（例: 「続けて」）を出すのを待つ。勝手に【22】へ進まない

**トラブル時**:
- クリップボードが既に別データで上書きされている → `node <skill-path>/scripts/copyToClipboard.js zeroone` で再取得し、ZeroOne シートの A1 で再貼り付け
- 「ZeroOne.txt が無い」と出る → `node <skill-path>/scripts/makeZeroOneData.js` を実行（RDRA 統合の Step 5 が未実行）
- Spreadsheet の Import ボタンがエラーを出す → ZeroOne シートの A1 貼り付けが UTF-8 のタブ区切りになっているか確認（リッチテキストのまま貼ると失敗する）

### 【22】画面照会表示（BUC・アクター別）
`2_RDRASpec/画面照会.json` をローカル HTTP サーバーで配信し、ブラウザで表示する:

```bash
# 1. 仕様作成（メニュー 21 相当）が完了していることが前提
# 2_RDRASpec/画面照会.json が存在すること

# 2. HTTP サーバー起動（ポート 3002、Ctrl+C で停止）
#    デフォルト動作では run_in_background=true で起動してフローを継続する
node <skill-path>/scripts/web_tool/bucActorUI.js

# 3. 別ターミナルまたはブラウザで開く
# macOS
open "http://localhost:3002/"
# Windows
start "" "http://localhost:3002/"
```
ブラウザの「閉じる」ボタンで `/shutdown` エンドポイントを叩くとサーバーが終了する。

**注意**: サーバーは常駐プロセスのため、Bash ツールから起動する際は必ず `run_in_background: true` を指定すること。フォアグラウンド起動するとスキルがここでブロックする。

**ポート 3002 競合時のワークフロー**:

1. 起動前に必ずポート占有を確認:
   ```bash
   lsof -i :3002 -sTCP:LISTEN -P -n
   ```
2. 占有プロセスが見つかった場合、**勝手に kill しない**。`ps -p <PID> -o pid,command` でプロセス名を確認し、AskUserQuestion で「PID X が 3002 を使用中です。停止して当スキルのサーバーを起動してよいですか?」とユーザーに確認する
3. ユーザーが承諾したら `kill <PID>` → 1 秒待機 → 再度 listen 確認 → 新サーバー起動
4. ユーザーが拒否したら起動をスキップし、「既存サーバーを流用する場合は `http://localhost:3002/` を直接開いてください。ただし配信される画面照会.json は当プロジェクトのものではない可能性があります」と伝える

---

## subagent への指示テンプレート

各タスクを subagent に委譲する際は、以下のパターンで指示する:

```
以下のファイルを読み込んで理解してください:
{共通コンテキストのファイルリスト}

次に、以下のタスクプロンプトを読み、その指示に従ってファイルを生成してください:
{タスクプロンプトのパス}

質問や確認は不要です。指示に従い即座に実行してください。
```
