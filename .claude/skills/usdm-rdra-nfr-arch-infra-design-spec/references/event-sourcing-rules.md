# Event Sourcing Rules (Spec)

## イベント ID 生成

- フォーマット: `{YYYYMMDD_HHMMSS}_spec_generation`
- 例: `20260329_100000_spec_generation`
- 同一秒に複数イベントが発生する場合: `_2`, `_3` サフィックスを付与

## 不変ルール

1. **events/ ディレクトリ**: Write-once, never modify/delete
   - 一度書き込んだイベントは変更・削除しない
   - 修正が必要な場合は新しいイベントとして追加する

2. **latest/ ディレクトリ**: 完全上書き（マージではない）
   - スナップショット = 最新イベントの全成果物のコピー
   - 古いファイルが残らないよう、更新前に latest/ を削除してからコピーする

3. **source.txt**: 各イベントのトリガー説明を記録する
   - 例: "Spec 生成: 貸し会議室マッチングSaaS 全UC仕様"

## ディレクトリ構造

```
docs/specs/
  events/
    {event_id}/
      {業務名}/
        {BUC名}/
          {UC名}/
            spec.md
            tier-frontend.md
            tier-backend.md
            tier-backend-openapi.yaml
            tier-backend-asyncapi.yaml  （非同期イベントがある場合のみ）
            tier-infra.md              （必要な場合のみ）
      _cross-cutting/
        ux-design.md
        ui-design.md
        data-visualization.md
      spec-event.yaml
      spec-event.md
      _inference.md
      source.txt
  latest/
    (events/{event_id}/ と同一構造)
```

## スナップショット更新手順

1. `docs/specs/latest/` が存在する場合、全内容を削除する
2. `docs/specs/events/{event_id}/` の内容を `docs/specs/latest/` にコピーする
3. `docs/specs/latest/README.md` を生成する（UC 一覧インデックス）
4. コピー後、latest/ の内容が events/{event_id}/ と一致することを確認する（README.md は latest/ のみ）
