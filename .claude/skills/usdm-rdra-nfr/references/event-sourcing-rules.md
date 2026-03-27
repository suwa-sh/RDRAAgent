# NFR イベントソーシングルール

NFR グレードの変更をイベントとして記録し、スナップショットを逐次更新する方式。
基本概念は usdm-rdra のイベントソーシングルールと同一。

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
docs/nfr/
  events/{event_id}/
    nfr-grade.yaml       # この変更での NFR グレード（全カテゴリ含む完全版）
    _inference.md         # 推論根拠サマリ
    source.txt            # トリガー説明のコピー
  latest/
    nfr-grade.yaml        # 最新スナップショット
```

## イベント ID

- 形式: `{YYYYMMDD_HHMMSS}_{変更名}`
- 変更名は変更内容を表す短い snake_case の名前
- RDRA の差分更新に起因する場合は RDRA のイベント ID を変更名に含める
- 例:
  - 初期構築: `20260327_100000_initial_nfr`
  - RDRA 差分起因: `20260327_150000_nfr_update_for_20260327_143000_add_reservation`

## イベントの構成

各イベントディレクトリには、その時点の NFR グレード全体を含める（差分ではなく全量）。
これは NFR グレードが全体の整合性を持つ必要があるため。

### NFR イベント

```
docs/nfr/events/{event_id}/
  nfr-grade.yaml       # 全カテゴリの完全な NFR グレード
  _inference.md         # 推論根拠サマリ（どのRDRA要素からどう推論したか）
  source.txt            # トリガー説明テキスト
```

## スナップショット更新ルール

### NFR スナップショット

- `latest/nfr-grade.yaml` をイベントの `nfr-grade.yaml` で **丸ごと上書き** する
- NFR グレードは全カテゴリの整合性が重要なため、部分マージではなく全量置換とする
- 上書き前に既存の `latest/nfr-grade.yaml` が存在する場合は、内容が実際に変更されたことを確認する

## 差分更新モードの動作

既存の NFR グレードがある状態で RDRA が更新された場合:

1. RDRA の差分（`docs/rdra/events/{rdra_event_id}/_changes.md`）を読み取る
2. 変更された RDRA 要素に関連する NFR 項目のみを再推論する
3. 既存の NFR グレード（`docs/nfr/latest/nfr-grade.yaml`）をベースに、再推論結果で該当項目を更新する
4. 更新結果を新しいイベントとして記録する
5. スナップショットを更新する

## 注意事項

- NFR グレードは RDRA モデル + ユーザー対話の結果であるため、RDRA が更新されても自動更新しない
- RDRA 更新後に NFR の再評価が必要かはユーザーが判断する
- イベントは時系列順に適用すること（event_id のソートで時系列が保証される）
