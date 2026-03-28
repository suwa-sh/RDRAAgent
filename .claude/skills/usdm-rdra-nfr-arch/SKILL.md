---
name: usdm-rdra-nfr-arch
description: >
  RDRA モデルと NFR グレードからアーキテクチャ設計を推論・対話・出力するスキル。
  usdm-rdra スキルの RDRA モデル（docs/rdra/latest/）と
  usdm-rdra-nfr スキルの NFR グレード（docs/nfr/latest/nfr-grade.yaml）を入力とし、
  システムアーキテクチャ（ティア構成・IdP・認可サービス・API Gateway）、
  アプリケーションアーキテクチャ（presentation/usecase/domain/gateway の4層設計・ロギング方針）、
  データアーキテクチャ（イミュータブルデータモデル・概念モデル・ストレージマッピング）を自動推論。
  クラウドデザインパターン（Circuit Breaker, Saga, CQRS 等）の適用判断、
  認可モデル選定（RBAC/ABAC/ReBAC）、ログ出力方針（レイヤー別ログカテゴリ）も含む。
  対話で確認・調整し、arch-design.yaml + coverage-report.md として出力する。
  全テクノロジー記述はベンダーニュートラル（FaaS, CaaS(k8s), RDB 等）。
  図解は全て Mermaid graph。イベントソーシングで履歴管理する。
  「アーキテクチャ設計」「システム構成を設計」「ティア構成」「レイヤ設計」
  「データモデル設計」「アプリケーション構成」「概念モデルを作成」
  「認証認可の設計」「IdP の選定」「認可モデルを選びたい」
  「ログ出力方針」「イミュータブルデータモデル」「クラウドデザインパターン」
  「非機能要求からアーキテクチャ」などで発動。
  RDRA や NFR からアーキテクチャを導出したい場合にも積極的に使うこと。
---

# アーキテクチャ設計スキル

RDRA モデルと NFR グレードからシステム・アプリケーション・データアーキテクチャを推論・対話・出力する。
全テクノロジー記述はベンダーニュートラル。クラウドベンダーへのマッピングは後続の別スキルの責務。

## 前提条件

- `docs/rdra/latest/*.tsv` が存在すること（usdm-rdra スキル実行済み）
- `docs/rdra/latest/システム概要.json` が存在すること
- `docs/nfr/latest/nfr-grade.yaml` が存在すること（usdm-rdra-nfr スキル実行済み）

## ディレクトリ構成

```
docs/
  arch/
    events/{event_id}/
      arch-design.yaml      # この変更でのアーキテクチャ設計
      arch-design.md         # Markdown 表現（Mermaid 図含む）
      coverage-report.md     # RDRA/NFR カバレッジレポート
      _inference.md          # 推論根拠サマリ
      source.txt             # トリガー説明
    latest/
      arch-design.yaml       # 最新スナップショット
      arch-design.md         # 最新 Markdown
      coverage-report.md     # 最新カバレッジレポート
```

## 全体フロー

```
docs/rdra/latest/*.tsv + docs/nfr/latest/nfr-grade.yaml
  → Step1: RDRA + NFR からアーキテクチャ推論（自動マッピング）
  → Step2: 対話で確認・調整（テクノロジースタック + ティア + レイヤー + データモデル）
  → Step3: アーキテクチャ設計 YAML 出力（イベント記録 + スナップショット更新）
```

## モード判定

パイプライン開始時に `docs/arch/latest/arch-design.yaml` の状態を確認する:

- **初期構築モード**: `docs/arch/latest/arch-design.yaml` が存在しないか空
  → Step1-3 をフル実行（全セクションを推論）
- **差分更新モード**: `docs/arch/latest/arch-design.yaml` が存在する
  → RDRA/NFR 差分に基づき関連項目のみ再推論、差分を対話で確認

---

## Step1: RDRA + NFR からのアーキテクチャ推論

RDRA モデルと NFR グレードを読み取り、アーキテクチャ設計を推論する。

### 共通コンテキスト

以下のファイルを読み込んで理解する:

- `references/arch-inference-rules.md` — RDRA + NFR → アーキテクチャ推論ルール
- `references/arch-schema.md` — アーキテクチャ設計 YAML スキーマ
- `docs/rdra/latest/*.tsv` — 現在の RDRA モデル（全ファイル）
- `docs/rdra/latest/システム概要.json` — システム概要
- `docs/nfr/latest/nfr-grade.yaml` — NFR グレード
- `docs/arch/latest/arch-design.yaml`（差分更新モード時のみ）— 既存のアーキテクチャ設計

### タスク

`references/arch/arch-infer.md` に従い、RDRA モデルと NFR グレードからアーキテクチャを推論する。

### 出力

このステップではファイル出力を行わない。推論結果を内部データとして保持し、Step2 に渡す。

---

## Step2: 対話によるアーキテクチャ設計確認・調整

Step1 の推論結果をユーザーに提示し、対話で確認・調整する。

### タスク

`references/arch/arch-dialogue.md` に従い、以下の順で対話を行う:

1. **テクノロジースタックの確認**: 言語/FW の希望、技術的制約（デプロイ先は対象外��
2. **システムアーキテクチャの確認**: ティア構成、テクノロジー候補、ティア共通方針/ルール
3. **アプリケーションアーキテクチャの確認**: ティアごとのレイヤリング、レイヤー共通方針/ルール
4. **データアーキテクチャの確認**: 概念モデル、ストレージマッピング
5. **最終確認**: 確定内容のサマリを提示

### 出力

対話で確定したアーキテクチャ設計情報を Step3 に渡す。ファイル出力はこのステップでは行わない。

---

## Step3: アーキテクチャ設計 YAML 出力

確定したアーキテクチャ設計を YAML ファイルとして出力し、イベント記録 + スナップショット更新を行う。

### 共通コンテキスト

- `references/arch-schema.md` — 出力スキーマ
- `references/event-sourcing-rules.md` — イベントソーシングルール

### タスク

`references/arch/arch-output.md` に従い、以下を生成する:

1. イベント ID の生成
2. `arch-design.yaml` の生成（全セクション含む完全版）
3. `_inference.md` の生成（推論根拠サマリ）
4. `source.txt` の生成（トリガー説明）

### 出力

- `docs/arch/events/{event_id}/arch-design.yaml`
- `docs/arch/events/{event_id}/_inference.md`
- `docs/arch/events/{event_id}/source.txt`

### バリデーション

出力後、スキーマバリデータを実行して arch-design.yaml の構造を検証する:

```bash
node <skill-path>/scripts/validateArchDesign.js docs/arch/events/{event_id}/arch-design.yaml
```

- 終了コード 0（PASS）: Markdown 生成へ進む
- 終了コード 1（FAIL）: エラー内容を確認し、arch-design.yaml を修正してから再度バリデーションを実行する

`<skill-path>` は本スキルのディレクトリパス（`.claude/skills/usdm-rdra-nfr-arch`）。

### Markdown の生成

バリデーション通過後、arch-design.yaml を Markdown 形式に変換する:

```bash
node <skill-path>/scripts/generateArchDesignMd.js docs/arch/events/{event_id}/arch-design.yaml
```

これにより `docs/arch/events/{event_id}/arch-design.md` が生成される。このスクリプトは決定論的（同一入力 → 同一��力）なため、LLM に依存せずバンドルスクリプトで実行する。

### カバレッジレポート生成

バリデーション通過・Markdown 生成後、RDRA/NFR に対するアーキテクチャ設計の要件網羅率レポートを生成する:

```bash
node <skill-path>/scripts/generateCoverageReport.js <rdra-dir> <nfr-yaml> docs/arch/events/{event_id}/arch-design.yaml
```

- `<rdra-dir>`: RDRA latest ディレクトリ（`docs/rdra/latest/`）
- `<nfr-yaml>`: NFR グレード YAML（`docs/nfr/latest/nfr-grade.yaml`）

これにより `docs/arch/events/{event_id}/coverage-report.md` が生成される。
RDRA 網羅率・NFR 網羅率ともに 100% を目標とする。未カバー項目がある場合は、policy/rule の追加または source_model への NFR ID 追記を検討する。

### スナップショット更新

`references/arch/arch-snapshot-update.md` に従い、`docs/arch/latest/` を更新する。

スナップショット更新後、latest にも Markdown を生成する:

```bash
node <skill-path>/scripts/generateArchDesignMd.js docs/arch/latest/arch-design.yaml
```

スナップショット更新後、latest にもカバレッジレポートを生成する:

```bash
node <skill-path>/scripts/generateCoverageReport.js <rdra-dir> <nfr-yaml> docs/arch/latest/arch-design.yaml
```

---

## subagent への指示テンプレート

Step1 は RDRA/NFR モデルの読み込みと推論を行うため、メインエージェントが直接実行する。
Step2 は対話が必要なため、メインエージェントが直接実行する。
Step3 は以下のパターンで subagent に委譲可能。

### Step3 例: アーキテクチャ設計出力

```
以下のファイルを順に読み込んで理解してください:

1. スキーマ定義
   - .claude/skills/usdm-rdra-nfr-arch/references/arch-schema.md
   - .claude/skills/usdm-rdra-nfr-arch/references/event-sourcing-rules.md

2. タスク指示
   - .claude/skills/usdm-rdra-nfr-arch/references/arch/arch-output.md

3. 確定データ
   以下のアーキテクチャ設計情報を arch-design.yaml として出力してください:
   {Step2 で確定したアーキテクチャ設計データ}

質問や確認は不要です。指示に従い即座に実行してください。
```

---

## 出力チェック

パイプライン完了後、以下を確認する:

- `docs/arch/events/{event_id}/arch-design.yaml` が存在すること
- `docs/arch/events/{event_id}/arch-design.md` が存在すること
- `docs/arch/events/{event_id}/_inference.md` が存在すること
- `docs/arch/events/{event_id}/source.txt` が存在すること
- `docs/arch/latest/arch-design.yaml` が最新イベントと一致すること
- `docs/arch/latest/arch-design.md` が最新イベントと一致すること
- バリデーションスクリプトが PASS すること
- `docs/arch/events/{event_id}/coverage-report.md` が存在すること
- `docs/arch/latest/coverage-report.md` が存在すること
- RDRA 網羅率が 100% であること
- NFR 網羅率（重要メトリクスのみ）が 100% であること
- テクノロジー候補にクラウドベンダー固有のサービス名が含まれていないこと
