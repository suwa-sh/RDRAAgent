# Event Sourcing Rules (Design System)

## イベント ID 生成

- フォーマット: `{YYYYMMDD_HHMMSS}_design_system`
- 例: `20260329_100000_design_system`
- 同一秒に複数イベントが発生する場合: `_2`, `_3` サフィックスを付与

## 不変ルール

1. **events/ ディレクトリ**: Write-once, never modify/delete
   - 一度書き込んだイベントは変更・削除しない
   - 修正が必要な場合は新しいイベントとして追加する

2. **latest/ ディレクトリ**: 完全上書き（マージではない）
   - スナップショット = 最新イベントの全成果物のコピー
   - 古いファイルが残らないよう、更新前に latest/ 内の該当ディレクトリを削除してからコピーする

3. **source.txt**: 各イベントのトリガー説明を記録する
   - 例: "初期デザインシステム生成: 貸し会議室マッチングSaaS"

## ディレクトリ構造

```
docs/design/
  events/
    {event_id}/
      tokens/
        design-tokens.json
        design-tokens.css
      components/
        component-specs.md
        screen-mapping.md
        state-mapping.md
      storybook-app/
        .storybook/
        src/
          components/
          docs/
          styles/
        package.json
      _inference.md
      source.txt
  latest/
    (events/{event_id}/ と同一構造)
```

## スナップショット更新手順

1. `docs/design/latest/` が存在する場合、`tokens/`, `components/`, `storybook-app/` を削除する
2. `docs/design/events/{event_id}/` の内容を `docs/design/latest/` にコピーする
3. コピー後、latest/ の内容が events/{event_id}/ と一致することを確認する
