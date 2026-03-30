# 鍵を貸し出す

## 概要

オーナーが利用者に鍵を渡し貸出を記録する。鍵状態は保管中→貸出中、会議室利用状態は利用前→利用中に遷移する。

## データフロー

```mermaid
graph LR
  subgraph FE["tier-frontend"]
    FE_View["view\n鍵管理画面"]
    FE_State["state\n鍵を貸し出すState"]
    FE_API["api-client\nPOST /api/v1/reservations/:id/key/handover"]
    FE_View --> FE_State --> FE_API
  end
  subgraph BE["tier-backend-api"]
    BE_Pres["presentation\nKeyHandoverRequest"]
    BE_UC["usecase\n鍵を貸し出すCommand"]
    BE_Domain["domain\n鍵"]
    BE_GW["gateway\nkeys"]
    BE_Pres --> BE_UC --> BE_Domain
    BE_UC --> BE_GW
  end
  subgraph DB["RDB"]
    DB_Table[("keys")]
  end
  FE_API -->|"POST /api/v1/reservations/:id/key/handover"| BE_Pres
  BE_GW -->|"UPDATE"| DB_Table
  DB_Table --> BE_GW --> BE_Domain --> BE_UC --> BE_Pres -->|"HTTP Response"| FE_API --> FE_State --> FE_View
```

| レイヤー | データモデル | 変換内容 |
|---------|------------|---------|
| FE View | 鍵管理画面の表示/入力 | ユーザー操作 → state 更新 |
| BE presentation | KeyHandoverRequest | バリデーション + Command変換 |
| BE gateway | UPDATE keys | レコード操作 |
| Response | KeyResponse | 表示用データ |

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
  State->>APIClient: POST /api/v1/reservations/:id/key/handover
  APIClient->>Pres: POST /api/v1/reservations/:id/key/handover
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

該当なし

## 計算ルール一覧

該当なし


## 状態遷移一覧

| 状態モデル | 遷移元 | 遷移先 | トリガー | 事前条件 | 事後処理 | 適用 tier |
|-----------|--------|--------|---------|---------|---------|----------|
| 鍵状態 | 保管中 | 貸出中 | 鍵を貸し出す | - | - | tier-backend-api |
| 会議室利用状態 | 利用前 | 利用中 | 鍵を貸し出す | - | - | tier-backend-api |

## 関連 RDRA モデル

| モデル種別 | 要素名 | 関連 |
|-----------|--------|------|
| 業務 | 会議室貸出業務 | このUCが属する業務 |
| BUC | 会議室貸出フロー | このUCを含むBUC |
| アクター | 会議室オーナー | 操作するアクター |
| 情報 | 鍵 | 参照・更新する情報 |
| 状態 | 鍵状態 | 関連する状態遷移 |
| 状態 | 会議室利用状態 | 関連する状態遷移 |




## E2E 完了条件（BDD）

### 正常系

```gherkin
Feature: 鍵を貸し出す

  Scenario: オーナーが鍵を貸し出す
    Given 会議室オーナー「田中太郎」が鍵管理画面で予約確定済みの予約を表示し鍵状態が「保管中」である
    When 「鍵を貸し出す」ボタンをクリックする
    Then 鍵状態が「貸出中」に更新され会議室利用状態が「利用中」になる
```

### 異常系

```gherkin
  Scenario: 既に貸出中の鍵を再度貸し出そうとする
    Given 鍵状態が「貸出中」の鍵管理画面を表示している
    When 「鍵を貸し出す」ボタンをクリックする
    Then 「この鍵は既に貸出中です」のエラーが表示される
```

## ティア別仕様

- [フロントエンド](tier-frontend.md)
- [バックエンドAPI](tier-backend-api.md)

### 統合 API Spec

- [OpenAPI Spec](../../../_cross-cutting/api/openapi.yaml)
