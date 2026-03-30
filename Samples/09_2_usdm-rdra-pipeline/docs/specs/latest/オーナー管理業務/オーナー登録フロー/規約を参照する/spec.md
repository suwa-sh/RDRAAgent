# 規約を参照する

## 概要

オーナーが利用規約を確認する。規約確認日時がオーナー申請に記録される。

## データフロー

```mermaid
graph LR
  subgraph FE["tier-frontend"]
    FE_View["view\n規約確認画面"]
    FE_State["state\n規約を参照するState"]
    FE_API["api-client\nGET /api/v1/terms"]
    FE_View --> FE_State --> FE_API
  end
  subgraph BE["tier-backend-api"]
    BE_Pres["presentation\nGETRequest"]
    BE_UC["usecase\n規約を参照するCommand"]
    BE_Domain["domain\nオーナー申請"]
    BE_GW["gateway\nowner_applications"]
    BE_Pres --> BE_UC --> BE_Domain
    BE_UC --> BE_GW
  end
  subgraph DB["RDB"]
    DB_Table[("owner_applications")]
  end
  FE_API -->|"GET /api/v1/terms"| BE_Pres
  BE_GW -->|"SELECT"| DB_Table
  DB_Table --> BE_GW --> BE_Domain --> BE_UC --> BE_Pres -->|"HTTP Response"| FE_API --> FE_State --> FE_View
```

| レイヤー | データモデル | 変換内容 |
|---------|------------|---------|
| FE View | 規約確認画面の表示/入力 | ユーザー操作 → state 更新 |
| BE presentation | Request | バリデーション + Command変換 |
| BE gateway | SELECT owner_applications | レコード操作 |
| Response | TermsResponse | 表示用データ |

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
  State->>APIClient: GET /api/v1/terms
  APIClient->>Pres: GET /api/v1/terms
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
| 業務 | オーナー管理業務 | このUCが属する業務 |
| BUC | オーナー登録フロー | このUCを含むBUC |
| アクター | 会議室オーナー | 操作するアクター |
| 情報 | オーナー申請 | 参照・更新する情報 |





## E2E 完了条件（BDD）

### 正常系

```gherkin
Feature: 規約を参照する

  Scenario: オーナーが利用規約を確認する
    Given 会議室オーナー「田中太郎」がオーナー登録フロー中で規約確認画面を表示している
    When 規約内容を最後までスクロールし「同意する」ボタンをクリックする
    Then 規約確認日時が記録され次のステップ（オーナー申請画面）へ遷移する
```

### 異常系

```gherkin
  Scenario: 規約に同意せずに次へ進もうとする
    Given 会議室オーナーが規約確認画面を表示している
    When 規約をスクロールせずに「同意する」ボタンをクリックする
    Then 「規約を最後までお読みください」のメッセージが表示される
```

## ティア別仕様

- [フロントエンド](tier-frontend.md)
- [バックエンドAPI](tier-backend-api.md)

### 統合 API Spec

- [OpenAPI Spec](../../../_cross-cutting/api/openapi.yaml)
