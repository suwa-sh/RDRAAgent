# Spec スナップショット更新タスク

生成された Spec を `docs/specs/latest/` に反映する。

## 入力

- `docs/specs/events/{event_id}/` — 生成された Spec（全UC + _cross-cutting + spec-event.yaml）

## 出力

- 更新された `docs/specs/latest/`

## マージ手順

### 1. latest/ の完全置換

1. `docs/specs/latest/` が存在する場合、全内容を削除する
2. `docs/specs/events/{event_id}/` の全内容を `docs/specs/latest/` にコピーする

### 2. README.md の生成

`docs/specs/latest/` 配下の全 UC ディレクトリをスキャンし、インデックスファイルを生成する:

**`docs/specs/latest/README.md`**:

```markdown
# Spec 一覧

## UC 仕様

| 業務 | BUC | UC名 | API数 | 非同期 | 最終更新イベント |
|------|-----|------|:-----:|:-----:|----------------|
| {業務名} | {BUC名} | [{UC名}]({業務名}/{BUC名}/{UC名}/spec.md) | {API数} | {有/無} | {event_id} |

## 全体横断仕様

- [UX デザイン仕様](_cross-cutting/ux-ui/ux-design.md)
- [UI デザイン仕様](_cross-cutting/ux-ui/ui-design.md)
- [データ可視化仕様](_cross-cutting/ux-ui/data-visualization.md)

## メタデータ

- Event ID: {event_id}
- 生成日時: {created_at}
- UC 総数: {total_ucs}
- API 総数: {total_apis}
```

#### README.md 生成アルゴリズム

1. `docs/specs/latest/` 配下を再帰的に走査し、`spec.md` を含むディレクトリを UC として列挙する
2. パスから `{業務名}/{BUC名}/{UC名}` を抽出する
3. 各 UC について:
   - `tier-backend-openapi.yaml` から API エンドポイント数をカウントする（paths のキー数）
   - `tier-backend-asyncapi.yaml` の存在で非同期の有/無を判定する
4. `spec-event.yaml` から event_id, created_at を取得する
5. 業務名 → BUC名 → UC名の昇順でソートし、テーブルを生成する

## 出力ルール

- ディレクトリのコピーは再帰的に行う（全ファイル）
- 存在しないディレクトリは自動作成する
- README.md は業務名 → BUC名 → UC名の昇順でソートする
