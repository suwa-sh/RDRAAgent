# オーナー精算を実行する

## 概要

サービス運営担当者が月末精算処理を実行しオーナーに支払う。決済機関との連携で精算依頼を送信する。

## データフロー

```mermaid
graph LR
  subgraph FE["tier-frontend"]
    FE_View["view\n精算実行画面"]
    FE_State["state\nオーナー精算を実行するState"]
    FE_API["api-client\nPOST /api/v1/admin/settlements/execute"]
    FE_View --> FE_State --> FE_API
  end
  subgraph BE["tier-backend-api"]
    BE_Pres["presentation\nExecuteSettlementRequest"]
    BE_UC["usecase\nオーナー精算を実行するCommand"]
    BE_Domain["domain\n精算情報"]
    BE_GW["gateway\nsettlements"]
    BE_Pres --> BE_UC --> BE_Domain
    BE_UC --> BE_GW
  end
  subgraph DB["RDB"]
    DB_Table[("settlements")]
  end
  FE_API -->|"POST /api/v1/admin/settlements/execute"| BE_Pres
  BE_GW -->|"INSERT"| DB_Table
  DB_Table --> BE_GW --> BE_Domain --> BE_UC --> BE_Pres -->|"HTTP Response"| FE_API --> FE_State --> FE_View
```

| レイヤー | データモデル | 変換内容 |
|---------|------------|---------|
| FE View | 精算実行画面の表示/入力 | ユーザー操作 → state 更新 |
| BE presentation | ExecuteSettlementRequest | バリデーション + Command変換 |
| BE gateway | INSERT settlements | レコード操作 |
| Response | SettlementExecutionResponse | 表示用データ |

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
  State->>APIClient: POST /api/v1/admin/settlements/execute
  APIClient->>Pres: POST /api/v1/admin/settlements/execute
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

該当なし

## 分岐条件一覧

| 条件名 | 判定ルール | 適用 tier | 適用箇所 | BDD Scenario |
|--------|----------|----------|---------|-------------|
| 精算ルール | 条件.tsvの定義に従う | tier-backend-api | ビジネスロジック | 異常系シナリオ |

## 計算ルール一覧

該当なし

## 非同期イベント

| イベント | チャネル | 方向 |
|---------|---------|------|
| 決済機関への精算依頼 | settlement-request-queue | publish |

## 状態遷移一覧

該当なし

## 関連 RDRA モデル

| モデル種別 | 要素名 | 関連 |
|-----------|--------|------|
| 業務 | 精算業務 | このUCが属する業務 |
| BUC | オーナー精算フロー | このUCを含むBUC |
| アクター | サービス運営担当者 | 操作するアクター |
| 情報 | 精算情報 | 参照・更新する情報 |
| 情報 | 利用実績 | 参照・更新する情報 |

| 条件 | 精算ルール | 適用される条件 |

| 外部システム | 決済機関 | 連携する外部システム |

## E2E 完了条件（BDD）

### 正常系

```gherkin
Feature: オーナー精算を実行する

  Scenario: 運営担当者が月末精算を実行する
    Given サービス運営担当者「管理者A」が精算実行画面を表示し対象月「2026年3月」を選択している
    When 精算対象オーナー一覧（オーナー「田中太郎」精算額「202,500円」等）を確認し「精算実行」ボタンをクリックし確認ダイアログで「実行する」を選択する
    Then 精算処理がバッチ実行され決済機関に精算依頼が送信される
```

### 異常系

```gherkin
  Scenario: 既に精算済みの月で再度精算を実行しようとする
    Given サービス運営担当者が精算実行画面を表示している
    When 既に精算済みの「2026年2月」を選択し「精算実行」ボタンをクリックする
    Then 「2026年2月は既に精算済みです」のエラーが表示される
```

## ティア別仕様

- [フロントエンド](tier-frontend.md)
- [バックエンドAPI](tier-backend-api.md)
- [バックエンドワーカー](tier-backend-worker.md)

### 統合 API Spec

- [OpenAPI Spec](../../../_cross-cutting/api/openapi.yaml)
