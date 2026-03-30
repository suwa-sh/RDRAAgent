# 利用履歴を管理する

## 概要

サービス運営担当者が利用履歴を会員別・物件別に管理する。

## データフロー

```mermaid
graph LR
  subgraph FE["tier-frontend"]
    FE_View["view\n利用履歴管理画面"]
    FE_State["state\n利用履歴を管理するState"]
    FE_API["api-client\nGET /api/v1/admin/usage-history"]
    FE_View --> FE_State --> FE_API
  end
  subgraph BE["tier-backend-api"]
    BE_Pres["presentation\nGETRequest"]
    BE_UC["usecase\n利用履歴を管理するCommand"]
    BE_Domain["domain\n利用履歴"]
    BE_GW["gateway\nusage_history"]
    BE_Pres --> BE_UC --> BE_Domain
    BE_UC --> BE_GW
  end
  subgraph DB["RDB"]
    DB_Table[("usage_history")]
  end
  FE_API -->|"GET /api/v1/admin/usage-history"| BE_Pres
  BE_GW -->|"SELECT"| DB_Table
  DB_Table --> BE_GW --> BE_Domain --> BE_UC --> BE_Pres -->|"HTTP Response"| FE_API --> FE_State --> FE_View
```

| レイヤー | データモデル | 変換内容 |
|---------|------------|---------|
| FE View | 利用履歴管理画面の表示/入力 | ユーザー操作 → state 更新 |
| BE presentation | Request | バリデーション + Command変換 |
| BE gateway | SELECT usage_history | レコード操作 |
| Response | UsageHistoryListResponse | 表示用データ |

## 処理フロー

```mermaid
sequenceDiagram
  actor User as サービス運営担当者
  box rgb(230,240,255) tier-frontend
    participant View as View/Component
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
  User->>View: 操作実行
  View->>State: action dispatch
  State->>APIClient: GET /api/v1/admin/usage-history
  APIClient->>Pres: GET /api/v1/admin/usage-history
  Pres->>Pres: 入力バリデーション
  Pres->>UC: Command/Query
  UC->>Domain: ビジネスロジック
  UC->>GW: 永続化
  GW->>DB: SELECT
  DB-->>GW: Result
  GW-->>UC: Entity
  UC-->>Pres: Response
  Pres-->>APIClient: HTTP Response
  APIClient-->>State: Result
  State-->>View: 状態更新
  View-->>User: 表示更新
```

## バリエーション一覧

| バリエーション名 | 値 | 処理内容 | 適用 tier | 適用箇所 |
|----------------|---|---------|----------|---------|

## 分岐条件一覧

該当なし

## 計算ルール一覧

該当なし


## 状態遷移一覧

該当なし

## 関連 RDRA モデル

| モデル種別 | 要素名 | 関連 |
|-----------|--------|------|
| 業務 | サービス運営業務 | このUCが属する業務 |
| BUC | 利用状況管理フロー | このUCを含むBUC |
| アクター | サービス運営担当者 | 操作するアクター |
| 情報 | 利用履歴 | 参照・更新する情報 |


| バリエーション | 利用履歴分析軸 | 関連するバリエーション |


## E2E 完了条件（BDD）

### 正常系

```gherkin
Feature: 利用履歴を管理する

  Scenario: 運営担当者が利用履歴を管理する
    Given サービス運営担当者「管理者A」が利用履歴管理画面を表示している
    When 分析軸「会員別」でフィルターし期間「2026年3月」を選択する
    Then 会員別の利用履歴一覧が表示され各履歴に利用日時、利用時間、会議室名が含まれる
```

### 異常系

```gherkin
  Scenario: 条件に合う利用履歴がない場合
    Given サービス運営担当者が利用履歴管理画面を表示している
    When 存在しない会員IDで検索する
    Then 「条件に合う利用履歴はありません」の空状態メッセージが表示される
```

## ティア別仕様

- [フロントエンド](tier-frontend.md)
- [バックエンドAPI](tier-backend-api.md)

### 統合 API Spec

- [OpenAPI Spec](../../../_cross-cutting/api/openapi.yaml)
