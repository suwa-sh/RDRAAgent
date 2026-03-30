# 会議室評価を確認する

## 概要

オーナーが利用者からの会議室評価（会議室評価点、ホスト評価点、コメント）を確認する。

## データフロー

```mermaid
graph LR
  subgraph FE["tier-frontend"]
    FE_View["view\n会議室評価一覧画面"]
    FE_State["state\n会議室評価を確認するState"]
    FE_API["api-client\nGET /api/v1/rooms/:id/reviews"]
    FE_View --> FE_State --> FE_API
  end
  subgraph BE["tier-backend-api"]
    BE_Pres["presentation\nGETRequest"]
    BE_UC["usecase\n会議室評価を確認するCommand"]
    BE_Domain["domain\n会議室評価"]
    BE_GW["gateway\nroom_reviews"]
    BE_Pres --> BE_UC --> BE_Domain
    BE_UC --> BE_GW
  end
  subgraph DB["RDB"]
    DB_Table[("room_reviews")]
  end
  FE_API -->|"GET /api/v1/rooms/:id/reviews"| BE_Pres
  BE_GW -->|"SELECT"| DB_Table
  DB_Table --> BE_GW --> BE_Domain --> BE_UC --> BE_Pres -->|"HTTP Response"| FE_API --> FE_State --> FE_View
```

| レイヤー | データモデル | 変換内容 |
|---------|------------|---------|
| FE View | 会議室評価一覧画面の表示/入力 | ユーザー操作 → state 更新 |
| BE presentation | Request | バリデーション + Command変換 |
| BE gateway | SELECT room_reviews | レコード操作 |
| Response | ReviewListResponse | 表示用データ |

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
  State->>APIClient: GET /api/v1/rooms/:id/reviews
  APIClient->>Pres: GET /api/v1/rooms/:id/reviews
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
| 業務 | 会議室管理業務 | このUCが属する業務 |
| BUC | 会議室評価確認フロー | このUCを含むBUC |
| アクター | 会議室オーナー | 操作するアクター |
| 情報 | 会議室評価 | 参照・更新する情報 |


| バリエーション | 評価種別 | 関連するバリエーション |


## E2E 完了条件（BDD）

### 正常系

```gherkin
Feature: 会議室評価を確認する

  Scenario: オーナーが会議室評価を確認する
    Given 会議室オーナー「田中太郎」が会議室「渋谷ミーティングルームA」の評価一覧画面を表示している
    When ページが読み込まれる
    Then 利用者からの会議室評価（評価点4.5、コメント「清潔で使いやすい」等）が一覧表示される
```

### 異常系

```gherkin
  Scenario: 評価がない会議室の評価一覧を表示する
    Given 会議室オーナーが評価のない会議室「新規ルームB」の評価一覧画面を表示している
    When ページが読み込まれる
    Then 「まだ評価はありません」の空状態メッセージが表示される
```

## ティア別仕様

- [フロントエンド](tier-frontend.md)
- [バックエンドAPI](tier-backend-api.md)

### 統合 API Spec

- [OpenAPI Spec](../../../_cross-cutting/api/openapi.yaml)
