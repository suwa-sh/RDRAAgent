# サービス問合せに対応する

## 概要

サービス運営担当者が利用者からのサービス問合せに対応する。

## データフロー

```mermaid
graph LR
  subgraph FE["tier-frontend"]
    FE_View["view\nサービス問合せ対応画面"]
    FE_State["state\nサービス問合せに対応するState"]
    FE_API["api-client\nPOST /api/v1/admin/inquiries/:id/replies"]
    FE_View --> FE_State --> FE_API
  end
  subgraph BE["tier-backend-api"]
    BE_Pres["presentation\nCreateReplyRequest"]
    BE_UC["usecase\nサービス問合せに対応するCommand"]
    BE_Domain["domain\n問合せ"]
    BE_GW["gateway\ninquiries"]
    BE_Pres --> BE_UC --> BE_Domain
    BE_UC --> BE_GW
  end
  subgraph DB["RDB"]
    DB_Table[("inquiries")]
  end
  FE_API -->|"POST /api/v1/admin/inquiries/:id/replies"| BE_Pres
  BE_GW -->|"UPDATE"| DB_Table
  DB_Table --> BE_GW --> BE_Domain --> BE_UC --> BE_Pres -->|"HTTP Response"| FE_API --> FE_State --> FE_View
```

| レイヤー | データモデル | 変換内容 |
|---------|------------|---------|
| FE View | サービス問合せ対応画面の表示/入力 | ユーザー操作 → state 更新 |
| BE presentation | CreateReplyRequest | バリデーション + Command変換 |
| BE gateway | UPDATE inquiries | レコード操作 |
| Response | InquiryResponse | 表示用データ |

## 処理フロー

```mermaid
sequenceDiagram
  actor User as サービス運営担当者
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
  State->>APIClient: POST /api/v1/admin/inquiries/:id/replies
  APIClient->>Pres: POST /api/v1/admin/inquiries/:id/replies
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

該当なし

## 関連 RDRA モデル

| モデル種別 | 要素名 | 関連 |
|-----------|--------|------|
| 業務 | サービス運営業務 | このUCが属する業務 |
| BUC | サービス問合せ対応フロー | このUCを含むBUC |
| アクター | サービス運営担当者 | 操作するアクター |
| 情報 | 問合せ | 参照・更新する情報 |





## E2E 完了条件（BDD）

### 正常系

```gherkin
Feature: サービス問合せに対応する

  Scenario: 運営担当者がサービス問合せに回答する
    Given サービス運営担当者「管理者A」がサービス問合せ対応画面で利用者「山田花子」の問合せ「退会方法について」を表示している
    When 回答「マイページの設定メニューから退会手続きが可能です」を入力し「回答する」ボタンをクリックする
    Then 回答が送信され利用者に通知される
```

### 異常系

```gherkin
  Scenario: 空の回答を送信しようとする
    Given サービス運営担当者がサービス問合せ対応画面を表示している
    When 回答内容を空のまま「回答する」ボタンをクリックする
    Then 「回答内容は必須です」のバリデーションエラーが表示される
```

## ティア別仕様

- [フロントエンド](tier-frontend.md)
- [バックエンドAPI](tier-backend-api.md)

### 統合 API Spec

- [OpenAPI Spec](../../../_cross-cutting/api/openapi.yaml)
