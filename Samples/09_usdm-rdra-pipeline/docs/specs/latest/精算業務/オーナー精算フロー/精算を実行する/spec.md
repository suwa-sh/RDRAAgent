# 精算を実行する

## 概要

算出した精算額を決済機関経由でオーナーに支払う

## データフロー

```mermaid
graph LR
  subgraph FE["tier-frontend"]
    FE_View["View\n精算実行画面"]
    FE_State["State\n精算を実行するState"]
    FE_API["API Client\nPOST /api/v1/settlements/actions/execute"]
    FE_View --> FE_State --> FE_API
  end
  subgraph BE["tier-backend-api"]
    BE_Pres["presentation\n精算を実行するRequest"]
    BE_UC["usecase\n精算を実行するUseCase"]
    BE_Domain["domain\n精算情報"]
    BE_GW["gateway\nsettlementsRepository"]
    BE_Pres --> BE_UC --> BE_Domain
    BE_UC --> BE_GW
  end
  subgraph DB["RDB"]
    DB_Table[("settlements")]
  end
  FE_API -->|"POST /api/v1/settlements/actions/execute"| BE_Pres
  BE_GW -->|"SQL"| DB_Table
  DB_Table --> BE_GW --> BE_Domain --> BE_UC --> BE_Pres -->|"HTTP 200/201"| FE_API --> FE_State --> FE_View
```

| レイヤー | データモデル | 変換内容 |
|---------|------------|---------|
| FE View | 精算実行画面の入力/表示内容 | ユーザー操作をState/API呼び出しに変換 |
| BE presentation | 精算を実行するRequest(精算情報) | 入力バリデーション + UseCase呼び出し |
| BE gateway | settlements テーブル操作 | レコード作成 |
| Response | 操作結果 | 画面表示用データ |

## 処理フロー

```mermaid
sequenceDiagram
  actor User as サービス運営担当者

  box rgb(230,240,255) tier-frontend
    participant View as View/精算実行画面
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

  User->>View: 操作を実行
  View->>State: dispatch 精算を実行するAction
  State->>APIClient: POST /api/v1/settlements/actions/execute
  APIClient->>Pres: POST /api/v1/settlements/actions/execute
  Pres->>Pres: 入力バリデーション
  Pres->>UC: 精算を実行するCommand
  UC->>Domain: ビジネスルール検証
  UC->>GW: save
  GW->>DB: INSERT
  DB-->>GW: 結果
  GW-->>UC: ドメインモデル
  UC-->>Pres: 結果
  Pres-->>APIClient: HTTP 201
  APIClient-->>State: レスポンス
  State-->>View: 状態更新
  View-->>User: 画面更新
```


## 状態遷移一覧

| 状態モデル | 遷移元 | 遷移先 | トリガー | 事前条件 | 事後処理 | 適用 tier |
|-----------|--------|--------|---------|---------|---------|----------|
| - | - | - | - | - | - | - |

## 関連 RDRA モデル

| モデル種別 | 要素名 | 関連 |
|-----------|--------|------|
| 業務 | 精算業務 | このUCが属する業務 |
| BUC | オーナー精算フロー | このUCを含むBUC |
| アクター | サービス運営担当者 | 操作するアクター |
| 情報 | 精算情報 | 更新する情報 |


| 外部システム | 決済機関 | 連携する外部システム |

## E2E 完了条件（BDD）

### 正常系

```gherkin
Feature: 精算を実行する

  Scenario: 精算を実行するの正常実行
    Given サービス運営担当者「山田花子」がログイン済みである
    When 精算実行画面で操作を実行する
    Then 操作が正常に完了し画面にフィードバックが表示される
```

### 異常系

```gherkin
  Scenario: 認証エラー
    Given 未ログイン状態である
    When 精算実行画面にアクセスする
    Then ログイン画面にリダイレクトされる

```

## ティア別仕様

- [フロントエンド](tier-frontend.md)
- [バックエンドAPI](tier-backend-api.md)
- [バックエンドワーカー](tier-backend-worker.md)

### 統合 API Spec

- [OpenAPI Spec](../../_cross-cutting/api/openapi.yaml)
