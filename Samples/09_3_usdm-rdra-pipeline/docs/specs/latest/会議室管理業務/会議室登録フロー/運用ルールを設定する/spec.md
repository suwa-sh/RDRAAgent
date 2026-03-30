# 運用ルールを設定する

## 概要

キャンセルポリシーや貸出可否を設定する

## データフロー

```mermaid
graph LR
  subgraph FE["tier-frontend"]
    FE_View["View\n運用ルール設定画面"]
    FE_State["State\n運用ルールを設定するState"]
    FE_API["API Client\nPUT /api/v1/rooms/{room_id}/rules"]
    FE_View --> FE_State --> FE_API
  end
  subgraph BE["tier-backend-api"]
    BE_Pres["presentation\n運用ルールを設定するRequest"]
    BE_UC["usecase\n運用ルールを設定するUseCase"]
    BE_Domain["domain\n運用ルール"]
    BE_GW["gateway\noperation_rulesRepository"]
    BE_Pres --> BE_UC --> BE_Domain
    BE_UC --> BE_GW
  end
  subgraph DB["RDB"]
    DB_Table[("operation_rules")]
  end
  FE_API -->|"PUT /api/v1/rooms/{room_id}/rules"| BE_Pres
  BE_GW -->|"SQL"| DB_Table
  DB_Table --> BE_GW --> BE_Domain --> BE_UC --> BE_Pres -->|"HTTP 200/201"| FE_API --> FE_State --> FE_View
```

| レイヤー | データモデル | 変換内容 |
|---------|------------|---------|
| FE View | 運用ルール設定画面の入力/表示内容 | ユーザー操作をState/API呼び出しに変換 |
| BE presentation | 運用ルールを設定するRequest(運用ルール) | 入力バリデーション + UseCase呼び出し |
| BE gateway | operation_rules テーブル操作 | レコード更新 |
| Response | 操作結果 | 画面表示用データ |

## 処理フロー

```mermaid
sequenceDiagram
  actor User as 会議室オーナー

  box rgb(230,240,255) tier-frontend
    participant View as View/運用ルール設定画面
    participant State as State Management
    participant APIClient as API Client
  end

  box rgb(240,255,240) tier-backend-api
    participant Pres as presentation
    participant UC as usecase
    participant Domain as domain
    participant GW as gateway
  end

  participant DB as RDB

  User->>View: 操作を実行
  View->>State: dispatch 運用ルールを設定するAction
  State->>APIClient: PUT /api/v1/rooms/{room_id}/rules
  APIClient->>Pres: PUT /api/v1/rooms/{room_id}/rules
  Pres->>Pres: 入力バリデーション
  Pres->>UC: 運用ルールを設定するCommand
  UC->>Domain: ビジネスルール検証
  UC->>GW: update
  GW->>DB: UPDATE
  DB-->>GW: 結果
  GW-->>UC: ドメインモデル
  UC-->>Pres: 結果
  Pres-->>APIClient: HTTP 201
  APIClient-->>State: レスポンス
  State-->>View: 状態更新
  View-->>User: 画面更新
```

## バリエーション一覧

| バリエーション名 | 値 | 処理内容 | 適用 tier | 適用箇所 |
|----------------|---|---------|----------|---------|
| 貸出可否 | (バリエーション.tsvの値) | 表示切替/フィルター | tier-frontend | 運用ルール設定画面 |


## 状態遷移一覧

| 状態モデル | 遷移元 | 遷移先 | トリガー | 事前条件 | 事後処理 | 適用 tier |
|-----------|--------|--------|---------|---------|---------|----------|
| - | - | - | - | - | - | - |

## 関連 RDRA モデル

| モデル種別 | 要素名 | 関連 |
|-----------|--------|------|
| 業務 | 会議室管理業務 | このUCが属する業務 |
| BUC | 会議室登録フロー | このUCを含むBUC |
| アクター | 会議室オーナー | 操作するアクター |
| 情報 | 運用ルール | 更新する情報 |




## E2E 完了条件（BDD）

### 正常系

```gherkin
Feature: 運用ルールを設定する

  Scenario: 運用ルールを設定するの正常実行
    Given 会議室オーナー「鈴木一郎」がログイン済みである
    When 運用ルール設定画面で操作を実行する
    Then 操作が正常に完了し画面にフィードバックが表示される
```

### 異常系

```gherkin
  Scenario: 認証エラー
    Given 未ログイン状態である
    When 運用ルール設定画面にアクセスする
    Then ログイン画面にリダイレクトされる

```

## ティア別仕様

- [フロントエンド](tier-frontend.md)
- [バックエンドAPI](tier-backend-api.md)

### 統合 API Spec

- [OpenAPI Spec](../../_cross-cutting/api/openapi.yaml)
