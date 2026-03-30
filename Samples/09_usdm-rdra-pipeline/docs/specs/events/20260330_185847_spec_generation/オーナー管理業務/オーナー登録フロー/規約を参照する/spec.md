# 規約を参照する

## 概要

サービス規約の内容を確認する

## データフロー

```mermaid
graph LR
  subgraph FE["tier-frontend"]
    FE_View["View\n規約参照画面"]
    FE_State["State\n規約を参照するState"]
    FE_API["API Client\nGET /api/v1/terms"]
    FE_View --> FE_State --> FE_API
  end
  subgraph BE["tier-backend-api"]
    BE_Pres["presentation\n規約を参照するRequest"]
    BE_UC["usecase\n規約を参照するUseCase"]
    BE_Domain["domain\nサービス規約"]
    BE_GW["gateway\nservice_termsRepository"]
    BE_Pres --> BE_UC --> BE_Domain
    BE_UC --> BE_GW
  end
  subgraph DB["RDB"]
    DB_Table[("service_terms")]
  end
  FE_API -->|"GET /api/v1/terms"| BE_Pres
  BE_GW -->|"SQL"| DB_Table
  DB_Table --> BE_GW --> BE_Domain --> BE_UC --> BE_Pres -->|"HTTP 200/201"| FE_API --> FE_State --> FE_View
```

| レイヤー | データモデル | 変換内容 |
|---------|------------|---------|
| FE View | 規約参照画面の入力/表示内容 | ユーザー操作をState/API呼び出しに変換 |
| BE presentation | 規約を参照するRequest(サービス規約) | 入力バリデーション + UseCase呼び出し |
| BE gateway | service_terms テーブル操作 | レコード取得 |
| Response | 一覧/詳細データ | 画面表示用データ |

## 処理フロー

```mermaid
sequenceDiagram
  actor User as 会議室オーナー

  box rgb(230,240,255) tier-frontend
    participant View as View/規約参照画面
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

  User->>View: 画面を表示
  View->>State: dispatch 規約を参照するAction
  State->>APIClient: GET /api/v1/terms
  APIClient->>Pres: GET /api/v1/terms
  Pres->>Pres: 入力バリデーション
  Pres->>UC: 規約を参照するCommand
  UC->>Domain: ビジネスルール検証
  UC->>GW: find
  GW->>DB: SELECT
  DB-->>GW: 結果
  GW-->>UC: ドメインモデル
  UC-->>Pres: 結果
  Pres-->>APIClient: HTTP 200
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
| 業務 | オーナー管理業務 | このUCが属する業務 |
| BUC | オーナー登録フロー | このUCを含むBUC |
| アクター | 会議室オーナー | 操作するアクター |
| 情報 | サービス規約 | 参照する情報 |




## E2E 完了条件（BDD）

### 正常系

```gherkin
Feature: 規約を参照する

  Scenario: 規約を参照するの正常実行
    Given 会議室オーナー「鈴木一郎」がログイン済みである
    When 規約参照画面でデータを表示する
    Then データが正常に表示される
```

### 異常系

```gherkin
  Scenario: 認証エラー
    Given 未ログイン状態である
    When 規約参照画面にアクセスする
    Then ログイン画面にリダイレクトされる

```

## ティア別仕様

- [フロントエンド](tier-frontend.md)
- [バックエンドAPI](tier-backend-api.md)

### 統合 API Spec

- [OpenAPI Spec](../../_cross-cutting/api/openapi.yaml)
