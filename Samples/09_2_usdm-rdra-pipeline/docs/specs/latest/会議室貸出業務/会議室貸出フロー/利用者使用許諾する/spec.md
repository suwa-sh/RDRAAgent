# 利用者使用許諾する

## 概要

オーナーが利用者の過去評価を確認し貸出可否を判断する。

## データフロー

```mermaid
graph LR
  subgraph FE["tier-frontend"]
    FE_View["view\n利用者許諾画面"]
    FE_State["state\n利用者使用許諾するState"]
    FE_API["api-client\nPOST /api/v1/reservations/:id/approve"]
    FE_View --> FE_State --> FE_API
  end
  subgraph BE["tier-backend-api"]
    BE_Pres["presentation\nApproveReservationRequest"]
    BE_UC["usecase\n利用者使用許諾するCommand"]
    BE_Domain["domain\n予約情報"]
    BE_GW["gateway\nreservations"]
    BE_Pres --> BE_UC --> BE_Domain
    BE_UC --> BE_GW
  end
  subgraph DB["RDB"]
    DB_Table[("reservations")]
  end
  FE_API -->|"POST /api/v1/reservations/:id/approve"| BE_Pres
  BE_GW -->|"UPDATE"| DB_Table
  DB_Table --> BE_GW --> BE_Domain --> BE_UC --> BE_Pres -->|"HTTP Response"| FE_API --> FE_State --> FE_View
```

| レイヤー | データモデル | 変換内容 |
|---------|------------|---------|
| FE View | 利用者許諾画面の表示/入力 | ユーザー操作 → state 更新 |
| BE presentation | ApproveReservationRequest | バリデーション + Command変換 |
| BE gateway | UPDATE reservations | レコード操作 |
| Response | ReservationResponse | 表示用データ |

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
  State->>APIClient: POST /api/v1/reservations/:id/approve
  APIClient->>Pres: POST /api/v1/reservations/:id/approve
  Pres->>Pres: 入力バリデーション
  Pres->>UC: Command/Query
  UC->>Domain: ビジネスロジック
  UC->>GW: 永続化
  GW->>DB: UPDATE
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

| 条件名 | 判定ルール | 適用 tier | 適用箇所 | BDD Scenario |
|--------|----------|----------|---------|-------------|
| 利用者許諾条件 | 条件.tsvの定義に従う | tier-backend-api | ビジネスロジック | 異常系シナリオ |

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
| 情報 | 予約情報 | 参照・更新する情報 |
| 情報 | 利用者評価 | 参照・更新する情報 |

| 条件 | 利用者許諾条件 | 適用される条件 |



## E2E 完了条件（BDD）

### 正常系

```gherkin
Feature: 利用者使用許諾する

  Scenario: オーナーが利用者の使用を許諾する
    Given 会議室オーナー「田中太郎」が利用者許諾画面で利用者「山田花子」（評価4.8）の予約を表示している
    When 利用者の過去評価を確認し「許諾する」ボタンをクリックする
    Then 予約が許諾され利用者に通知される
```

### 異常系

```gherkin
  Scenario: オーナーが利用者の使用を拒否する
    Given 会議室オーナー「田中太郎」が利用者許諾画面で利用者「佐藤一郎」（評価2.1）の予約を表示している
    When 拒否理由「過去の利用マナーに問題あり」を入力し「拒否する」ボタンをクリックする
    Then 予約が拒否され利用者に通知される
```

## ティア別仕様

- [フロントエンド](tier-frontend.md)
- [バックエンドAPI](tier-backend-api.md)

### 統合 API Spec

- [OpenAPI Spec](../../../_cross-cutting/api/openapi.yaml)
