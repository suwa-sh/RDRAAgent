# インフラ設計 イベントソーシングルール

インフラ設計の変更をイベントとして記録し、スナップショットを逐次更新する方式。
基本概念は usdm-rdra-nfr-arch のイベントソーシングルールと同一。

## 基本概念

```
events/        — 変更差分の履歴（追記のみ、不変）
latest/        — 現在の最新状態（スナップショット）
```

- `events/` 配下のファイルは一度書き込んだら変更・削除しない（イミュータブル）
  - **例外**: infra-event.yaml の `arch_feedback` セクションは Step3 完了時に追記する（フィードバック結果の記録）
- `latest/` は `events/` を順に適用した結果と常に一致する
- 新しい変更は必ず `events/` にイベントとして記録してから `latest/` を更新する

## ディレクトリ構成

### infra イベント

```
docs/infra/
  events/{event_id}/
    infra-event.yaml      # インフライベント（変換サマリ + MCL 実行結果 + フィードバック記録）
    infra-event.md        # Markdown 表現
    product-input.yaml    # 生成した MCL 入力（トレーサビリティ用コピー）
    _inference.md         # 変換推論根拠
    source.txt            # トリガー説明
  latest/
    infra-event.yaml      # 最新スナップショット
    infra-event.md
    product-input.yaml
```

### arch フィードバックイベント

arch フィードバックは既存の arch イベント形式に準拠する:

```
docs/arch/
  events/{feedback_event_id}/
    arch-design.yaml      # フィードバック反映済みの全量アーキテクチャ設計
    arch-design.md
    coverage-report.md
    _inference.md
    source.txt
  latest/
    arch-design.yaml      # 更新されたスナップショット
    arch-design.md
    coverage-report.md
```

## イベント ID

### infra イベント ID

- 形式: `{YYYYMMDD_HHMMSS}_infra_product_design`
- 例: `20260328_140000_infra_product_design`

### arch フィードバックイベント ID

- 形式: `{YYYYMMDD_HHMMSS}_arch_infra_feedback_{infra_event_id}`
- 例: `20260328_143000_arch_infra_feedback_20260328_140000_infra_product_design`

## イベント ID のユニーク性

- タイムスタンプ形式 `{YYYYMMDD_HHMMSS}` は秒単位のため、1 秒以内の連続実行で重複する可能性がある
- 重複を検出した場合、サフィックス `_2`, `_3` を付与する（例: `20260328_143000_infra_product_design_2`）
- 既存イベントディレクトリとの重複チェックは Step1 のイベントディレクトリ作成時に実施する

## イベントの構成

### infra イベント

各 infra イベントには以下を含める:

- `infra-event.yaml` — イベントメタデータ、変換サマリ、MCL 実行結果、フィードバック記録
- `product-input.yaml` — 生成した MCL 入力のコピー
- `_inference.md` — 変換推論根拠（どの arch/NFR 項目からどうマッピングしたか）
- `source.txt` — トリガー説明テキスト

### arch フィードバックイベント

既存の arch イベント形式に完全準拠する。アーキテクチャ設計全量を含む（差分ではなく全量）。

## スナップショット更新ルール

### infra スナップショット

- `latest/infra-event.yaml` をイベントの `infra-event.yaml` で **丸ごと上書き** する
- `latest/infra-event.md` をイベントの `infra-event.md` で **丸ごと上書き** する
- `latest/product-input.yaml` をイベントの `product-input.yaml` で **丸ごと上書き** する

### arch スナップショット（フィードバック時）

- `docs/arch/latest/arch-design.yaml` をフィードバックイベントの `arch-design.yaml` で **丸ごと上書き** する
- `docs/arch/latest/arch-design.md` をフィードバックイベントの `arch-design.md` で **丸ごと上書き** する
- `docs/arch/latest/coverage-report.md` をフィードバックイベントの `coverage-report.md` で **丸ごと上書き** する

## 注意事項

- infra イベントは arch-design.yaml + nfr-grade.yaml の現在の状態を入力とする
- arch フィードバックは infra 設計結果に基づくが、ベンダーニュートラルな知見のみを反映する
- confidence: "user" の項目はフィードバック時にも変更しない（ユーザー確定値を尊重）
- イベントは時系列順に適用すること（event_id のソートで時系列が保証される）
