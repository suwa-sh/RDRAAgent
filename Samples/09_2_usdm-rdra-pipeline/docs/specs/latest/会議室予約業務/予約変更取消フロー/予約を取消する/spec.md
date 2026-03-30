# 予約を取消する

## 概要

利用者が予約を取り消す。キャンセルポリシーに基づきキャンセル料が発生する場合がある。予約状態は取消済に遷移する。

## データフロー

```mermaid
graph LR
  subgraph FE["tier-frontend"]
    FE_View["view\n予約取消画面"]
    FE_State["state\n予約を取消するState"]
    FE_API["api-client\nPOST /api/v1/reservations/:id/cancel"]
    FE_View --> FE_State --> FE_API
  end
  subgraph BE["tier-backend-api"]
    BE_Pres["presentation\nCancelReservationRequest"]
    BE_UC["usecase\n予約を取消するCommand"]
    BE_Domain["domain\n予約情報"]
    BE_GW["gateway\nreservations"]
    BE_Pres --> BE_UC --> BE_Domain
    BE_UC --> BE_GW
  end
  subgraph DB["RDB"]
    DB_Table[("reservations")]
  end
  FE_API -->|"POST /api/v1/reservations/:id/cancel"| BE_Pres
  BE_GW -->|"UPDATE"| DB_Table
  DB_Table --> BE_GW --> BE_Domain --> BE_UC --> BE_Pres -->|"HTTP Response"| FE_API --> FE_State --> FE_View
```

| レイヤー | データモデル | 変換内容 |
|---------|------------|---------|
| FE View | 予約取消画面の表示/入力 | ユーザー操作 → state 更新 |
| BE presentation | CancelReservationRequest | バリデーション + Command変換 |
| BE gateway | UPDATE reservations | レコード操作 |
| Response | ReservationResponse | 表示用データ |

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
  State->>APIClient: POST /api/v1/reservations/:id/cancel
  APIClient->>Pres: POST /api/v1/reservations/:id/cancel
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
| キャンセルポリシー | 条件.tsvの定義に従う | tier-backend-api | ビジネスロジック | 異常系シナリオ |

## 計算ルール一覧

該当なし


## 状態遷移一覧

| 状態モデル | 遷移元 | 遷移先 | トリガー | 事前条件 | 事後処理 | 適用 tier |
|-----------|--------|--------|---------|---------|---------|----------|
| 予約状態 | 予約申請中 | 取消済 | 予約を取消する | - | - | tier-backend-api |
| 予約状態 | 予約確定 | 取消済 | 予約を取消する | - | - | tier-backend-api |

## 関連 RDRA モデル

| モデル種別 | 要素名 | 関連 |
|-----------|--------|------|
| 業務 | 会議室予約業務 | このUCが属する業務 |
| BUC | 予約変更取消フロー | このUCを含むBUC |
| アクター | 利用者 | 操作するアクター |
| 情報 | 予約情報 | 参照・更新する情報 |
| 状態 | 予約状態 | 関連する状態遷移 |
| 条件 | キャンセルポリシー | 適用される条件 |



## E2E 完了条件（BDD）

### 正常系

```gherkin
Feature: 予約を取消する

  Scenario: 利用者が予約を取り消す（キャンセル料なし）
    Given 利用者「山田花子」が予約「RSV-001」（利用日2026-04-20）の予約取消画面を本日2026-04-10に表示している
    When キャンセルポリシー「3日前まで無料」を確認し「取消する」ボタンをクリックする
    Then 予約状態が「取消済」に更新されキャンセル料は0円と表示される
```

### 異常系

```gherkin
  Scenario: 利用者が直前に予約を取り消す（キャンセル料発生）
    Given 利用者「山田花子」が予約「RSV-002」（利用日2026-04-12）の予約取消画面を本日2026-04-11に表示している
    When キャンセルポリシー「前日キャンセルは50%」を確認し「取消する」ボタンをクリックする
    Then 予約状態が「取消済」に更新されキャンセル料「2500円」が表示される
```

## ティア別仕様

- [フロントエンド](tier-frontend.md)
- [バックエンドAPI](tier-backend-api.md)

### 統合 API Spec

- [OpenAPI Spec](../../../_cross-cutting/api/openapi.yaml)
