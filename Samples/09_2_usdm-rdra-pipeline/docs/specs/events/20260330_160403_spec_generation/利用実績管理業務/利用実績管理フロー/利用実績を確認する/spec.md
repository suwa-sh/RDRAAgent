# 利用実績を確認する

## 概要

オーナーが会議室の利用実績（利用件数、利用時間、利用料金）を確認する。

## データフロー

```mermaid
graph LR
  subgraph FE["tier-frontend"]
    FE_View["view\n利用実績確認画面"]
    FE_State["state\n利用実績を確認するState"]
    FE_API["api-client\nGET /api/v1/owners/me/usage-stats"]
    FE_View --> FE_State --> FE_API
  end
  subgraph BE["tier-backend-api"]
    BE_Pres["presentation\nGETRequest"]
    BE_UC["usecase\n利用実績を確認するCommand"]
    BE_Domain["domain\n利用実績"]
    BE_GW["gateway\nusage_records"]
    BE_Pres --> BE_UC --> BE_Domain
    BE_UC --> BE_GW
  end
  subgraph DB["RDB"]
    DB_Table[("usage_records")]
  end
  FE_API -->|"GET /api/v1/owners/me/usage-stats"| BE_Pres
  BE_GW -->|"SELECT"| DB_Table
  DB_Table --> BE_GW --> BE_Domain --> BE_UC --> BE_Pres -->|"HTTP Response"| FE_API --> FE_State --> FE_View
```

| レイヤー | データモデル | 変換内容 |
|---------|------------|---------|
| FE View | 利用実績確認画面の表示/入力 | ユーザー操作 → state 更新 |
| BE presentation | Request | バリデーション + Command変換 |
| BE gateway | SELECT usage_records | レコード操作 |
| Response | UsageStatsResponse | 表示用データ |

## 処理フロー

```mermaid
sequenceDiagram
  actor User as 会議室オーナー
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
  State->>APIClient: GET /api/v1/owners/me/usage-stats
  APIClient->>Pres: GET /api/v1/owners/me/usage-stats
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

該当なし

## 分岐条件一覧

該当なし

## 計算ルール一覧

該当なし


## 状態遷移一覧

該当なし

## 関連 RDRA モデル

| モデル種別 | 要素名 | 関連 |
|-----------|--------|------|
| 業務 | 利用実績管理業務 | このUCが属する業務 |
| BUC | 利用実績管理フロー | このUCを含むBUC |
| アクター | 会議室オーナー | 操作するアクター |
| 情報 | 利用実績 | 参照・更新する情報 |





## E2E 完了条件（BDD）

### 正常系

```gherkin
Feature: 利用実績を確認する

  Scenario: オーナーが利用実績を確認する
    Given 会議室オーナー「田中太郎」が利用実績確認画面を表示している
    When 期間「2026年3月」を選択する
    Then 月間利用件数「15件」、月間利用時間「45時間」、月間利用料金「225,000円」のサマリーと日別推移グラフが表示される
```

### 異常系

```gherkin
  Scenario: 利用実績がない期間を選択する
    Given 会議室オーナーが利用実績確認画面を表示している
    When 期間「2025年1月」を選択する
    Then 「この期間の利用実績はありません」の空状態メッセージが表示される
```

## ティア別仕様

- [フロントエンド](tier-frontend.md)
- [バックエンドAPI](tier-backend-api.md)

### 統合 API Spec

- [OpenAPI Spec](../../../_cross-cutting/api/openapi.yaml)
