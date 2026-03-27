# Spec 生成タスク

差分 RDRA モデルから、影響を受けた UC の Spec（BDD 完了条件付き）を生成する。

## 入力

- `docs/rdra/events/{event_id}/_changes.md` — 変更サマリ
- `docs/rdra/latest/*.tsv` — 更新後の RDRA モデル
- `docs/rdra/latest/システム概要.json` — システム概要
- `docs/specs/latest/` — 既存の Spec（あれば）
- `references/specs/spec-template.md` — Spec フォーマット定義

## 出力

- `docs/specs/events/{event_id}/{UC名}/spec.md`
- `docs/specs/events/{event_id}/{UC名}/tier-frontend.md`
- `docs/specs/events/{event_id}/{UC名}/tier-backend.md`
- `docs/specs/events/{event_id}/{UC名}/tier-infra.md`（必要な場合のみ）

## 手順

### 1. 影響を受けた UC の特定

`_changes.md` と `docs/rdra/latest/BUC.tsv` を照合し、変更の影響を受けた UC を特定する。

影響判定ルール:
- BUC が追加・変更された場合: そのBUC配下の全 UC が影響を受ける
- 情報が追加・変更・削除された場合: その情報を参照する UC が影響を受ける
- アクターが追加・変更された場合: そのアクターが関わる UC が影響を受ける
- 状態が追加・変更された場合: その状態に関連する UC が影響を受ける
- 条件が追加・変更された場合: その条件が適用される UC が影響を受ける
- 外部システムが追加・変更された場合: その外部システムと連携する UC が影響を受ける

### 2. UC 情報の収集

影響を受けた各 UC について、以下の情報を `docs/rdra/latest/*.tsv` から収集する:

- **BUC.tsv**: UC が属する BUC、関連アクター、アクティビティ、情報、条件、外部システム
- **情報.tsv**: UC で参照・更新する情報の詳細（属性）
- **状態.tsv**: UC に関連する状態遷移
- **アクター.tsv**: 操作するアクターの詳細
- **条件.tsv**: 適用される条件の詳細
- **バリエーション.tsv**: 関連するバリエーション

### 3. 既存 Spec の確認

`docs/specs/latest/{UC名}/` が存在する場合、既存の Spec を読み込み、差分を把握する。

- 既存 Spec がある場合: 変更部分のみを更新した Spec を生成する
- 既存 Spec がない場合: 新規に Spec を生成する

### 4. spec.md の生成

`references/specs/spec-template.md` の spec.md フォーマットに従い、以下を記述する:

- **概要**: UC の目的と範囲
- **関連 RDRA モデル**: `docs/rdra/latest/*.tsv` の実際の要素名を使用
- **E2E 完了条件**: Gherkin 形式の BDD シナリオ
  - 正常系: 主要なユーザーフローを網羅
  - 異常系: エラーケース、バリデーション失敗、権限エラーなど

### 5. tier-frontend.md の生成

`references/specs/spec-template.md` の tier-frontend.md フォーマットに従い、以下を記述する:

- **画面仕様**: 表示要素、入力フォーム、操作フロー
- **ティア完了条件**: 画面操作に閉じた BDD シナリオ

画面仕様は以下の情報源から導出する:
- BUC.tsv の UC 説明
- 情報.tsv の属性（フォーム項目の候補）
- 条件.tsv（バリデーションルール）
- バリエーション.tsv（選択肢の候補）

### 6. tier-backend.md の生成

`references/specs/spec-template.md` の tier-backend.md フォーマットに従い、以下を記述する:

- **API 仕様**: エンドポイント、リクエスト/レスポンス
- **データモデル変更**: 情報.tsv から導出
- **ビジネスルール**: 条件.tsv, バリエーション.tsv から導出
- **ティア完了条件**: API レベルの BDD シナリオ

### 7. tier-infra.md の生成（必要な場合のみ）

以下の場合に tier-infra.md を生成する:
- 新しいデータストアが必要な場合
- 外部システム連携が追加・変更された場合
- パフォーマンス要件に関わる変更がある場合

### 補足: USDM acceptance_criteria との対応

USDM の acceptance_criteria と Spec の BDD シナリオの関係:

- USDM の acceptance_criteria は仕様要件の受け入れ基準（何を満たすべきか）
- Spec の E2E BDD シナリオはその要件が実装で満たされることを確認するテスト仕様（どう検証するか）
- 対応関係: 各 acceptance_criteria は1つ以上の BDD Scenario に対応させる
- RDRA モデルから導出可能な追加シナリオ（エラーケース、境界値等）は含めてよい

## 出力ルール

- UC名のディレクトリ名にはスラッシュ(/)を含めない。UC名に "/" が含まれる場合は "-" に置き換える（例: "ユーザー設定/プロフィール編集" → "ユーザー設定-プロフィール編集"）
- BDD シナリオは具体的な値を含める（例: `Given 利用者「田中太郎」がログイン済み`）
- 関連 RDRA モデルは `docs/rdra/latest/*.tsv` の実際の要素名を使用する
- 推測でティアの仕様を追加しない — RDRA モデルから導出できる範囲で記述する
- 1つの UC の Spec 生成は1つの subagent で完結させる（UC 間で並列実行可能）
