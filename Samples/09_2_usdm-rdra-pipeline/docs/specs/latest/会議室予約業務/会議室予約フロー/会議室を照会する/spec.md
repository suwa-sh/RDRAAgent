# 会議室を照会する

## 概要

利用者が条件（所在地、価格帯、広さ、機能性）で会議室を検索する。

## データフロー

```mermaid
graph LR
  subgraph FE["tier-frontend"]
    FE_View["view\n会議室検索画面"]
    FE_State["state\n会議室を照会するState"]
    FE_API["api-client\nGET /api/v1/rooms"]
    FE_View --> FE_State --> FE_API
  end
  subgraph BE["tier-backend-api"]
    BE_Pres["presentation\nGETRequest"]
    BE_UC["usecase\n会議室を照会するCommand"]
    BE_Domain["domain\n会議室情報"]
    BE_GW["gateway\nrooms"]
    BE_Pres --> BE_UC --> BE_Domain
    BE_UC --> BE_GW
  end
  subgraph DB["RDB"]
    DB_Table[("rooms")]
  end
  FE_API -->|"GET /api/v1/rooms"| BE_Pres
  BE_GW -->|"SELECT"| DB_Table
  DB_Table --> BE_GW --> BE_Domain --> BE_UC --> BE_Pres -->|"HTTP Response"| FE_API --> FE_State --> FE_View
```

| レイヤー | データモデル | 変換内容 |
|---------|------------|---------|
| FE View | 会議室検索画面の表示/入力 | ユーザー操作 → state 更新 |
| BE presentation | Request | バリデーション + Command変換 |
| BE gateway | SELECT rooms | レコード操作 |
| Response | RoomListResponse | 表示用データ |

## 処理フロー

```mermaid
sequenceDiagram
  actor User as 利用者
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
  State->>APIClient: GET /api/v1/rooms
  APIClient->>Pres: GET /api/v1/rooms
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
| 業務 | 会議室予約業務 | このUCが属する業務 |
| BUC | 会議室予約フロー | このUCを含むBUC |
| アクター | 利用者 | 操作するアクター |
| 情報 | 会議室情報 | 参照・更新する情報 |
| 情報 | 会議室評価 | 参照・更新する情報 |





## E2E 完了条件（BDD）

### 正常系

```gherkin
Feature: 会議室を照会する

  Scenario: 利用者が会議室を検索する
    Given 利用者「山田花子」が会議室検索画面を表示している
    When 所在地「渋谷区」、価格帯「3000-8000円」、収容人数「10人以上」で検索する
    Then 条件に合致する会議室が一覧表示され各会議室の評価点が表示される
```

### 異常系

```gherkin
  Scenario: 条件に合う会議室がない場合
    Given 利用者が会議室検索画面を表示している
    When 所在地「北海道稚内市」で検索する
    Then 「条件に合う会議室が見つかりませんでした」の空状態メッセージが表示される
```

## ティア別仕様

- [フロントエンド](tier-frontend.md)
- [バックエンドAPI](tier-backend-api.md)

### 統合 API Spec

- [OpenAPI Spec](../../../_cross-cutting/api/openapi.yaml)
