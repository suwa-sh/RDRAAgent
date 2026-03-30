# 利用者評価を登録する

## 概要

オーナーが利用者の評価（評価点、コメント）を登録する。

## データフロー

```mermaid
graph LR
  subgraph FE["tier-frontend"]
    FE_View["view\n利用者評価登録画面"]
    FE_State["state\n利用者評価を登録するState"]
    FE_API["api-client\nPOST /api/v1/reservations/:id/user-reviews"]
    FE_View --> FE_State --> FE_API
  end
  subgraph BE["tier-backend-api"]
    BE_Pres["presentation\nCreateUserReviewRequest"]
    BE_UC["usecase\n利用者評価を登録するCommand"]
    BE_Domain["domain\n利用者評価"]
    BE_GW["gateway\nuser_reviews"]
    BE_Pres --> BE_UC --> BE_Domain
    BE_UC --> BE_GW
  end
  subgraph DB["RDB"]
    DB_Table[("user_reviews")]
  end
  FE_API -->|"POST /api/v1/reservations/:id/user-reviews"| BE_Pres
  BE_GW -->|"INSERT"| DB_Table
  DB_Table --> BE_GW --> BE_Domain --> BE_UC --> BE_Pres -->|"HTTP Response"| FE_API --> FE_State --> FE_View
```

| レイヤー | データモデル | 変換内容 |
|---------|------------|---------|
| FE View | 利用者評価登録画面の表示/入力 | ユーザー操作 → state 更新 |
| BE presentation | CreateUserReviewRequest | バリデーション + Command変換 |
| BE gateway | INSERT user_reviews | レコード操作 |
| Response | UserReviewResponse | 表示用データ |

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
  State->>APIClient: POST /api/v1/reservations/:id/user-reviews
  APIClient->>Pres: POST /api/v1/reservations/:id/user-reviews
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
| 業務 | 会議室貸出業務 | このUCが属する業務 |
| BUC | 会議室貸出フロー | このUCを含むBUC |
| アクター | 会議室オーナー | 操作するアクター |
| 情報 | 利用者評価 | 参照・更新する情報 |


| バリエーション | 評価種別 | 関連するバリエーション |


## E2E 完了条件（BDD）

### 正常系

```gherkin
Feature: 利用者評価を登録する

  Scenario: オーナーが利用者を評価する
    Given 会議室オーナー「田中太郎」が利用済みの予約の利用者評価登録画面を表示している
    When 評価点「4」、コメント「時間通りに利用いただきました」を入力し「評価する」ボタンをクリックする
    Then 利用者評価が登録される
```

### 異常系

```gherkin
  Scenario: 評価点なしで登録しようとする
    Given 会議室オーナーが利用者評価登録画面を表示している
    When 評価点を選択せずに「評価する」ボタンをクリックする
    Then 「評価点を選択してください」のバリデーションエラーが表示される
```

## ティア別仕様

- [フロントエンド](tier-frontend.md)
- [バックエンドAPI](tier-backend-api.md)

### 統合 API Spec

- [OpenAPI Spec](../../../_cross-cutting/api/openapi.yaml)
