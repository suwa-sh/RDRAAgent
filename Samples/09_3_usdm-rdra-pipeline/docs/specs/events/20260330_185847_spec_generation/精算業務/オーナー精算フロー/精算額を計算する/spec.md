# 精算額を計算する

## 概要

会議室別の利用履歴から精算額を算出する

## データフロー

```mermaid
graph LR
  subgraph FE["tier-frontend"]
    FE_View["View\n精算処理画面"]
    FE_State["State\n精算額を計算するState"]
    FE_API["API Client\nPOST /api/v1/settlements/actions/calculate"]
    FE_View --> FE_State --> FE_API
  end
  subgraph BE["tier-backend-api"]
    BE_Pres["presentation\n精算額を計算するRequest"]
    BE_UC["usecase\n精算額を計算するUseCase"]
    BE_Domain["domain\n利用履歴"]
    BE_GW["gateway\nusage_historyRepository"]
    BE_Pres --> BE_UC --> BE_Domain
    BE_UC --> BE_GW
  end
  subgraph DB["RDB"]
    DB_Table[("usage_history")]
  end
  FE_API -->|"POST /api/v1/settlements/actions/calculate"| BE_Pres
  BE_GW -->|"SQL"| DB_Table
  DB_Table --> BE_GW --> BE_Domain --> BE_UC --> BE_Pres -->|"HTTP 200/201"| FE_API --> FE_State --> FE_View
```

| レイヤー | データモデル | 変換内容 |
|---------|------------|---------|
| FE View | 精算処理画面の入力/表示内容 | ユーザー操作をState/API呼び出しに変換 |
| BE presentation | 精算額を計算するRequest(利用履歴, 手数料情報, 精算情報) | 入力バリデーション + UseCase呼び出し |
| BE gateway | usage_history テーブル操作 | レコード作成 |
| Response | 操作結果 | 画面表示用データ |

## 処理フロー

```mermaid
sequenceDiagram
  actor User as サービス運営担当者

  box rgb(230,240,255) tier-frontend
    participant View as View/精算処理画面
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
  View->>State: dispatch 精算額を計算するAction
  State->>APIClient: POST /api/v1/settlements/actions/calculate
  APIClient->>Pres: POST /api/v1/settlements/actions/calculate
  Pres->>Pres: 入力バリデーション
  Pres->>UC: 精算額を計算するCommand
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


## 分岐条件一覧

| 条件名 | 判定ルール | 適用 tier | 適用箇所 | BDD Scenario |
|--------|----------|----------|---------|-------------|
| 精算条件 | RDRA条件定義に基づく | tier-backend-api | 精算額を計算するのビジネスルール | 精算額を計算する 精算条件シナリオ |

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
| 情報 | 利用履歴 | 更新する情報 |
| 情報 | 手数料情報 | 更新する情報 |
| 情報 | 精算情報 | 更新する情報 |

| 条件 | 精算条件 | 適用される条件 |


## E2E 完了条件（BDD）

### 正常系

```gherkin
Feature: 精算額を計算する

  Scenario: 精算額を計算するの正常実行
    Given サービス運営担当者「山田花子」がログイン済みである
    When 精算処理画面で操作を実行する
    Then 操作が正常に完了し画面にフィードバックが表示される
```

### 異常系

```gherkin
  Scenario: 認証エラー
    Given 未ログイン状態である
    When 精算処理画面にアクセスする
    Then ログイン画面にリダイレクトされる

  Scenario: 精算条件違反
    Given サービス運営担当者「山田花子」がログイン済みである
    When 精算条件を満たさない状態で操作を実行する
    Then エラーメッセージ「条件を満たしていません」が表示される

```

## ティア別仕様

- [フロントエンド](tier-frontend.md)
- [バックエンドAPI](tier-backend-api.md)
- [バックエンドワーカー](tier-backend-worker.md)

### 統合 API Spec

- [OpenAPI Spec](../../_cross-cutting/api/openapi.yaml)
