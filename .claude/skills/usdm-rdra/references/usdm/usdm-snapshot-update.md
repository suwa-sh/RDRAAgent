# USDM スナップショット更新タスク

USDM イベントの requirements.yaml を latest/requirements.yaml にマージする。

## 入力

- `docs/usdm/events/{event_id}/requirements.yaml` — 新しいイベント
- `docs/usdm/latest/requirements.yaml` — 現在のスナップショット（存在しない場合は新規作成）

## 出力

- 更新された `docs/usdm/latest/requirements.yaml`

## マージルール

### 新規作成（latest が存在しない場合）

イベントの requirements.yaml をそのまま latest にコピーし、以下のフィールドを追加する:

```yaml
version: "1.0"
last_updated: "{現在の日時}"
last_event_id: "{event_id}"
requirements:
  # イベントの requirements をそのまま含める
```

### 既存への追加（latest が存在する場合）

1. イベントの requirements.yaml から各要求を取得
2. 要求 ID が latest に存在しない場合: 末尾に追加
3. 要求 ID が latest に存在する場合: イベント側の内容で上書き
4. `last_updated` と `last_event_id` を更新

### 注意事項

- 要求の物理削除は行わない。削除が必要な場合は `status: deleted` を付与する
- イベントの `event_id` と `created_at` は各要求の履歴として保持する
- latest の `version` は変更しない
- マージ後の YAML は ID 順にソートする
