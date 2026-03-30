# 精算結果を確認する

## 概要

精算額と支払い状況を確認する

## データフロー

```mermaid
graph LR
  subgraph FE["tier-frontend"]
    FE_View["View\n精算結果確認画面"]
    FE_State["State\n精算結果を確認するState"]
    FE_API["API Client\nGET /api/v1/owners/{owner_id}/settlements"]
    FE_View --> FE_State --> FE_API
  end
  subgraph BE["tier-backend-api"]
    BE_Pres["presentation\n精算結果を確認するRequest"]
    BE_UC["usecase\n精算結果を確認するUseCase"]
    BE_Domain["domain\n精算情報"]
    BE_GW["gateway\nsettlementsRepository"]
    BE_Pres --> BE_UC --> BE_Domain
    BE_UC --> BE_GW
  end
  subgraph DB["RDB"]
    DB_Table[("settlements")]
  end
  FE_API -->|"GET /api/v1/owners/{owner_id}/settlements"| BE_Pres
  BE_GW -->|"SQL"| DB_Table
  DB_Table --> BE_GW --> BE_Domain --> BE_UC --> BE_Pres -->|"HTTP 200/201"| FE_API --> FE_State --> FE_View
```

| レイヤー | データモデル | 変換内容 |
|---------|------------|---------|
| FE View | 精算結果確認画面の入力/表示内容 | ユーザー操作をState/API呼び出しに変換 |
| BE presentation | 精算結果を確認するRequest(精算情報, 売上実績) | 入力バリデーション + UseCase呼び出し |
| BE gateway | settlements テーブル操作 | レコード取得 |
| Response | 一覧/詳細データ | 画面表示用データ |

## 処理フロー

```mermaid
sequenceDiagram
  actor User as 会議室オーナー

  box rgb(230,240,255) tier-frontend
    participant View as View/精算結果確認画面
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
  View->>State: dispatch 精算結果を確認するAction
  State->>APIClient: GET /api/v1/owners/{owner_id}/settlements
  APIClient->>Pres: GET /api/v1/owners/{owner_id}/settlements
  Pres->>Pres: 入力バリデーション
  Pres->>UC: 精算結果を確認するCommand
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
| 業務 | 精算業務 | このUCが属する業務 |
| BUC | オーナー精算フロー | このUCを含むBUC |
| アクター | 会議室オーナー | 操作するアクター |
| 情報 | 精算情報 | 参照する情報 |
| 情報 | 売上実績 | 参照する情報 |




## E2E 完了条件（BDD）

### 正常系

```gherkin
Feature: 精算結果を確認する

  Scenario: 精算結果を確認するの正常実行
    Given 会議室オーナー「鈴木一郎」がログイン済みである
    When 精算結果確認画面でデータを表示する
    Then データが正常に表示される
```

### 異常系

```gherkin
  Scenario: 認証エラー
    Given 未ログイン状態である
    When 精算結果確認画面にアクセスする
    Then ログイン画面にリダイレクトされる

```

## ティア別仕様

- [フロントエンド](tier-frontend.md)
- [バックエンドAPI](tier-backend-api.md)

### 統合 API Spec

- [OpenAPI Spec](../../_cross-cutting/api/openapi.yaml)
