# 精算内容を確認する

## 概要

オーナーが精算額（月次精算金額、支払状態）を確認する。

## データフロー

```mermaid
graph LR
  subgraph FE["tier-frontend"]
    FE_View["view\n精算確認画面"]
    FE_State["state\n精算内容を確認するState"]
    FE_API["api-client\nGET /api/v1/owners/me/settlements"]
    FE_View --> FE_State --> FE_API
  end
  subgraph BE["tier-backend-api"]
    BE_Pres["presentation\nGETRequest"]
    BE_UC["usecase\n精算内容を確認するCommand"]
    BE_Domain["domain\n精算情報"]
    BE_GW["gateway\nsettlements"]
    BE_Pres --> BE_UC --> BE_Domain
    BE_UC --> BE_GW
  end
  subgraph DB["RDB"]
    DB_Table[("settlements")]
  end
  FE_API -->|"GET /api/v1/owners/me/settlements"| BE_Pres
  BE_GW -->|"SELECT"| DB_Table
  DB_Table --> BE_GW --> BE_Domain --> BE_UC --> BE_Pres -->|"HTTP Response"| FE_API --> FE_State --> FE_View
```

| レイヤー | データモデル | 変換内容 |
|---------|------------|---------|
| FE View | 精算確認画面の表示/入力 | ユーザー操作 → state 更新 |
| BE presentation | Request | バリデーション + Command変換 |
| BE gateway | SELECT settlements | レコード操作 |
| Response | SettlementListResponse | 表示用データ |

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
  State->>APIClient: GET /api/v1/owners/me/settlements
  APIClient->>Pres: GET /api/v1/owners/me/settlements
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
| 業務 | 精算業務 | このUCが属する業務 |
| BUC | オーナー精算フロー | このUCを含むBUC |
| アクター | 会議室オーナー | 操作するアクター |
| 情報 | 精算情報 | 参照・更新する情報 |





## E2E 完了条件（BDD）

### 正常系

```gherkin
Feature: 精算内容を確認する

  Scenario: オーナーが精算内容を確認する
    Given 会議室オーナー「田中太郎」が精算確認画面を表示している
    When ページが読み込まれる
    Then 月次精算一覧が表示され2026年3月分の精算金額「202,500円」、支払状態「支払済」が確認できる
```

### 異常系

```gherkin
  Scenario: 精算情報がない場合
    Given 新規登録直後の会議室オーナーが精算確認画面を表示している
    When ページが読み込まれる
    Then 「まだ精算情報はありません」の空状態メッセージが表示される
```

## ティア別仕様

- [フロントエンド](tier-frontend.md)
- [バックエンドAPI](tier-backend-api.md)

### 統合 API Spec

- [OpenAPI Spec](../../../_cross-cutting/api/openapi.yaml)
