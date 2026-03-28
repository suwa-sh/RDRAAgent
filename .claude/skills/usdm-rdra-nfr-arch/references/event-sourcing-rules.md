# アーキテクチャ設計 イベントソーシングルール

アーキテクチャ設計の変更をイベントとして記録し、スナップショットを逐次更新する方式。
基本概念は usdm-rdra-nfr のイベントソーシングルールと同一。

## 基本概念

```
events/        — 変更差分の履歴（追記のみ、不変）
latest/        — 現在の最新状態（スナップショット）
```

- `events/` 配下のファイルは一度書き込んだら変更・削除しない（イミュータブル）
- `latest/` は `events/` を順に適用した結果と常に一致する
- 新しい変更は必ず `events/` にイベントとして記録してから `latest/` を更新する

## ディレクトリ構成

```
docs/arch/
  events/{event_id}/
    arch-design.yaml      # この変更でのアーキテクチャ設計（全量）
    arch-design.md         # Markdown 表現（Mermaid 図含む）
    _inference.md          # 推論根拠サマリ
    source.txt             # トリガー説明のコピー
  latest/
    arch-design.yaml       # 最新スナップショット
    arch-design.md         # 最新 Markdown
```

## イベント ID

- 形式: `{YYYYMMDD_HHMMSS}_{変更名}`
- 変更名は変更内容を表す短い snake_case の名前
- RDRA/NFR の差分更新に起因する場合はそのイベント ID を変更名に含める
- 例:
  - 初期構築: `20260328_100000_initial_arch`
  - RDRA 差分起因: `20260328_150000_arch_update_for_20260328_143000_add_reservation`
  - NFR 変更起因: `20260328_160000_arch_update_for_nfr_20260328_150000`
  - 手動更新: `20260328_170000_arch_manual_update`

## イベントの構成

各イベントディレクトリには、その時点のアーキテクチャ設計全体を含める（差分ではなく全量）。
これはアーキテクチャ設計が各セクション間の整合性を持つ必要があるため。

### アーキテクチャイベント

```
docs/arch/events/{event_id}/
  arch-design.yaml      # システム・アプリ・データアーキテクチャの完全版
  arch-design.md         # Markdown 表現（Mermaid 図含む）
  _inference.md          # 推論根拠サマリ（どの RDRA/NFR 要素からどう推論したか）
  source.txt             # トリガー説明テキスト
```

## スナップショット更新ルール

### アーキテクチャスナップショット

- `latest/arch-design.yaml` をイベントの `arch-design.yaml` で **丸ごと上書き** する
- `latest/arch-design.md` をイベントの `arch-design.md` で **丸ごと上書き** する
- アーキテクチャ設計は全セクション（システム・アプリ・データ）の整合性が重要なため、部分マージではなく全量置換とする
- 上書き前に既存の `latest/arch-design.yaml` が存在する場合は、内容が実際に変更されたことを確認する

## 差分更新モードの動作

既存のアーキテクチャ設計がある状態で RDRA/NFR が更新された場合:

1. RDRA の差分（`docs/rdra/events/{rdra_event_id}/_changes.md`）または NFR の差分を読み取る
2. 変更された RDRA/NFR 要素に関連するアーキテクチャ項目のみを再推論する
3. 既存のアーキテクチャ設計（`docs/arch/latest/arch-design.yaml`）をベースに、再推論結果で該当項目を更新する
4. 更新結果を新しいイベントとして記録する
5. スナップショットを更新する

## 注意事項

- アーキテクチャ設計は RDRA + NFR + ユーザー対話の結果であるため、入力が更新されても自動更新しない
- RDRA/NFR 更新後にアーキテクチャの再評価が必要かはユーザーが判断する
- イベントは時系列順に適用すること（event_id のソートで時系列が保証される）
- confidence: "user" の項目は差分更新時にも再推論しない（ユーザー確定値を尊重）
