# Spec スナップショット更新タスク

生成された Spec を `docs/specs/latest/` に反映する。

## 入力

- `docs/specs/events/{event_id}/{UC名}/` — 生成された Spec
- `docs/specs/latest/` — 現在のスナップショット
- `docs/rdra/events/{event_id}/_changes.md` — 変更サマリ（削除判定用）

## 出力

- 更新された `docs/specs/latest/{UC名}/`

## マージ手順

### 1. 追加・更新

イベントに含まれる各 UC ディレクトリについて:

- `docs/specs/latest/{UC名}/` が存在しない場合: ディレクトリごとコピー（新規追加）
- `docs/specs/latest/{UC名}/` が存在する場合: イベント側のファイルで上書き

### 2. 削除

RDRA の `docs/rdra/events/{event_id}/_changes.md`（Spec ではなく RDRA レイヤーの _changes.md）を参照し、BUC またはそれに属する UC が削除された場合に Spec を削除する。

#### 削除ロジック

1. `_changes.md` の「削除」セクションから削除対象の BUC 名を抽出する
2. `docs/rdra/latest/BUC.tsv` を読む（削除前のスナップショットまたは _changes.md の記載から）
3. BUC列（2列目）が削除対象 BUC と一致するすべての行を抽出する
4. 各行の UC列（6列目）を取得し、削除対象 UC リストを作成する
5. `docs/specs/latest/` 配下から該当 UC ディレクトリをすべて削除する

例: 「レビュー管理フロー」（BUC）が削除された場合:
- BUC.tsv で該当行の UC: レビューを投稿する, レビューを閲覧する, レビューを削除する
- `docs/specs/latest/レビューを投稿する/`, `docs/specs/latest/レビューを閲覧する/`, `docs/specs/latest/レビューを削除する/` を削除

### 3. インデックスの更新

`docs/specs/latest/` 配下の全 UC ディレクトリをスキャンし、インデックスファイルを生成する:

**`docs/specs/latest/README.md`**:

```markdown
# Spec 一覧

| UC名 | BUC | 最終更新イベント |
|------|-----|----------------|
| {UC名} | {BUC名} | {event_id} |
```

#### README.md 生成アルゴリズム

1. `docs/specs/latest/` 配下の全ディレクトリを列挙（= UC 一覧）
2. 各 UC について:
   - `spec.md` の「関連 RDRA モデル」テーブルから モデル種別="BUC" の行を探し、BUC名を取得する
   - `docs/specs/events/` 配下を走査し、この UC を含む最新の event_id を取得する（ディレクトリ名の辞書順で最大のもの）
3. UC名の昇順でソートし、テーブルを生成する

## 出力ルール

- ディレクトリのコピーは再帰的に行う（spec.md, tier-*.md すべて）
- 存在しないディレクトリは自動作成する
- README.md は UC 名の昇順でソートする
