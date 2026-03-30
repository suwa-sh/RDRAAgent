# 評価を登録する

## 概要

利用者が利用した会議室とホストの評価（会議室評価点、ホスト評価点、コメント）を登録する。

## データフロー

```mermaid
graph LR
  subgraph FE["tier-frontend"]
    FE_View["view\n評価登録画面"]
    FE_State["state\n評価を登録するState"]
    FE_API["api-client\nPOST /api/v1/reservations/:id/room-reviews"]
    FE_View --> FE_State --> FE_API
  end
  subgraph BE["tier-backend-api"]
    BE_Pres["presentation\nCreateRoomReviewRequest"]
    BE_UC["usecase\n評価を登録するCommand"]
    BE_Domain["domain\n会議室評価"]
    BE_GW["gateway\nroom_reviews"]
    BE_Pres --> BE_UC --> BE_Domain
    BE_UC --> BE_GW
  end
  subgraph DB["RDB"]
    DB_Table[("room_reviews")]
  end
  FE_API -->|"POST /api/v1/reservations/:id/room-reviews"| BE_Pres
  BE_GW -->|"INSERT"| DB_Table
  DB_Table --> BE_GW --> BE_Domain --> BE_UC --> BE_Pres -->|"HTTP Response"| FE_API --> FE_State --> FE_View
```

| レイヤー | データモデル | 変換内容 |
|---------|------------|---------|
| FE View | 評価登録画面の表示/入力 | ユーザー操作 → state 更新 |
| BE presentation | CreateRoomReviewRequest | バリデーション + Command変換 |
| BE gateway | INSERT room_reviews | レコード操作 |
| Response | RoomReviewResponse | 表示用データ |

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
  State->>APIClient: POST /api/v1/reservations/:id/room-reviews
  APIClient->>Pres: POST /api/v1/reservations/:id/room-reviews
  Pres->>Pres: 入力バリデーション
  Pres->>UC: Command/Query
  UC->>Domain: ビジネスロジック
  UC->>GW: 永続化
  GW->>DB: INSERT
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
| 業務 | 評価管理業務 | このUCが属する業務 |
| BUC | 評価登録フロー | このUCを含むBUC |
| アクター | 利用者 | 操作するアクター |
| 情報 | 会議室評価 | 参照・更新する情報 |


| バリエーション | 評価種別 | 関連するバリエーション |


## E2E 完了条件（BDD）

### 正常系

```gherkin
Feature: 評価を登録する

  Scenario: 利用者が会議室とホストを評価する
    Given 利用者「山田花子」が利用済み予約「RSV-001」の評価登録画面を表示している
    When 会議室評価点「5」、ホスト評価点「4」、コメント「清潔で設備が充実していました」を入力し「評価する」ボタンをクリックする
    Then 会議室評価が登録される
```

### 異常系

```gherkin
  Scenario: 評価点未選択で登録に失敗する
    Given 利用者が評価登録画面を表示している
    When 会議室評価点を選択せずに「評価する」ボタンをクリックする
    Then 「会議室評価点を選択してください」のバリデーションエラーが表示される
```

## ティア別仕様

- [フロントエンド](tier-frontend.md)
- [バックエンドAPI](tier-backend-api.md)

### 統合 API Spec

- [OpenAPI Spec](../../../_cross-cutting/api/openapi.yaml)
